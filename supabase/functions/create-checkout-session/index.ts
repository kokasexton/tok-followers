// create-checkout-session — Stripe Checkout for a credit pack (hosted, no card data in-app).
import { handleOptions, json } from '../_shared/cors.ts';
import { adminClient, requireUser } from '../_shared/supabaseAdmin.ts';
import { stripe } from '../_shared/stripe.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    const user = await requireUser(req);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const { priceId } = await req.json().catch(() => ({}));
    if (!priceId || typeof priceId !== 'string') return json({ error: 'priceId is required' }, 400);

    const s = stripe();

    // Resolve the price + its credit amount from Stripe (never trust the client for credits).
    const price = await s.prices.retrieve(priceId, { expand: ['product'] });
    const credits = Number(price.metadata?.credits ?? 0);
    if (!price.active || price.currency !== 'usd' || credits <= 0) {
      return json({ error: 'Unknown or inactive price' }, 400);
    }

    const admin = adminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await s.customers.create({
        email: profile?.email ?? user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const origin = req.headers.get('Origin') ?? Deno.env.get('APP_URL') ?? 'http://localhost:5173';

    const session = await s.checkout.sessions.create({
      mode: 'payment',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { user_id: user.id, credits: String(credits) },
      payment_intent_data: { metadata: { user_id: user.id, credits: String(credits) } },
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    // Record the intent as pending so the dashboard shows it even before the webhook.
    await admin.from('purchases').insert({
      user_id: user.id,
      credits,
      amount_cents: price.unit_amount ?? 0,
      currency: price.currency,
      stripe_session_id: session.id,
      status: 'pending',
    });

    return json({ url: session.url });
  } catch (e) {
    return json({ error: String(e).slice(0, 300) }, 500);
  }
});
