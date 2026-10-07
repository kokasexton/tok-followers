// stripe-webhook — the ONLY place credits are added. Verify signature, be idempotent.
import { handleOptions, json } from '../_shared/cors.ts';
import { adminClient } from '../_shared/supabaseAdmin.ts';
import { stripe } from '../_shared/stripe.ts';
import Stripe from 'npm:stripe@17';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  const s = stripe();
  const sig = req.headers.get('stripe-signature');
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!sig || !secret) return json({ error: 'Missing signature or webhook secret' }, 400);

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await s.webhooks.constructEventAsync(raw, sig, secret, undefined, Stripe.createSubtleCryptoProvider());
  } catch (e) {
    return json({ error: `Signature verification failed: ${String(e).slice(0, 120)}` }, 400);
  }

  const admin = adminClient();

  // Idempotency: the event id is the primary key. A duplicate insert = already handled.
  const { error: dupErr } = await admin
    .from('stripe_events')
    .insert({ id: event.id, type: event.type });
  if (dupErr) {
    if (dupErr.code === '23505') return json({ received: true, duplicate: true });
    return json({ error: dupErr.message }, 500);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id ?? session.client_reference_id;
      const credits = Number(session.metadata?.credits ?? 0);
      if (userId && credits > 0) {
        const { data: profile } = await admin
          .from('profiles')
          .select('credits_balance')
          .eq('id', userId)
          .maybeSingle();
        const next = (profile?.credits_balance ?? 0) + credits;
        await admin.from('profiles').update({ credits_balance: next }).eq('id', userId);
        await admin
          .from('purchases')
          .update({
            status: 'paid',
            stripe_payment_intent: String(session.payment_intent ?? '') || null,
          })
          .eq('stripe_session_id', session.id);
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const { data: purchase } = await admin
        .from('purchases')
        .select('*')
        .eq('stripe_payment_intent', String(charge.payment_intent ?? ''))
        .maybeSingle();
      if (purchase && purchase.status !== 'refunded') {
        const { data: profile } = await admin
          .from('profiles')
          .select('credits_balance')
          .eq('id', purchase.user_id)
          .maybeSingle();
        const next = Math.max(0, (profile?.credits_balance ?? 0) - purchase.credits);
        await admin.from('profiles').update({ credits_balance: next }).eq('id', purchase.user_id);
        await admin.from('purchases').update({ status: 'refunded' }).eq('id', purchase.id);
      }
    }

    await admin.from('stripe_events').update({ handled: true }).eq('id', event.id);
    return json({ received: true });
  } catch (e) {
    // Let Stripe retry: delete the idempotency row so the next attempt re-runs.
    await admin.from('stripe_events').delete().eq('id', event.id);
    return json({ error: String(e).slice(0, 300) }, 500);
  }
});
