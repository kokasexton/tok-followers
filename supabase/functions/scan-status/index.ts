// scan-status — poll an Apify run; on success, ingest rows, charge credits, complete the scan.
import { handleOptions, json } from '../_shared/cors.ts';
import { adminClient, requireUser } from '../_shared/supabaseAdmin.ts';
import { getDatasetItems, getRun, mapFollowerRow } from '../_shared/apify.ts';

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    const user = await requireUser(req);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const { scanId } = await req.json().catch(() => ({}));
    if (!scanId) return json({ error: 'scanId is required' }, 400);

    const admin = adminClient();
    const { data: scan, error } = await admin
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !scan) return json({ error: 'Scan not found' }, 404);

    // Already settled — nothing to do.
    if (scan.status === 'completed' || scan.status === 'failed') {
      return json({ scan });
    }

    if (!scan.apify_run_id || !scan.apify_dataset_id) {
      return json({ error: 'Scan has no Apify run attached' }, 409);
    }

    const run = await getRun(scan.apify_run_id);

    if (run.status === 'READY' || run.status === 'RUNNING') {
      await admin.from('scans').update({ status: 'running' }).eq('id', scan.id);
      return json({ scan: { ...scan, status: 'running' } });
    }

    if (run.status !== 'SUCCEEDED') {
      await admin
        .from('scans')
        .update({ status: 'failed', error_message: `Apify run ${run.status}`, completed_at: new Date().toISOString() })
        .eq('id', scan.id);
      return json({ scan: { ...scan, status: 'failed', error_message: `Apify run ${run.status}` } });
    }

    // Pull rows and map to our schema.
    const items = await getDatasetItems(run.defaultDatasetId, scan.results_limit || 100000);
    const rows = items
      .map((r) => mapFollowerRow(r, { id: scan.id, user_id: scan.user_id }))
      .filter((r): r is NonNullable<typeof r> => r !== null);

    // Dedupe by username within the batch.
    const seen = new Set<string>();
    const unique = rows.filter((r) => (seen.has(r.username) ? false : (seen.add(r.username), true)));

    let delivered = 0;
    if (unique.length) {
      const { error: insErr, count } = await admin
        .from('followers')
        .upsert(unique, { onConflict: 'scan_id,username', ignoreDuplicates: true, count: 'exact' });
      if (insErr) {
        await admin.from('scans').update({ status: 'failed', error_message: insErr.message, completed_at: new Date().toISOString() }).eq('id', scan.id);
        return json({ error: insErr.message }, 500);
      }
      delivered = count ?? unique.length;
    }

    const creditsUsed = scan.is_preview ? 0 : delivered;

    // Charge credits (only on delivery), then complete. Only one poll wins this transition.
    if (creditsUsed > 0) {
      const { data: profile } = await admin
        .from('profiles')
        .select('credits_balance')
        .eq('id', scan.user_id)
        .maybeSingle();
      const next = Math.max(0, (profile?.credits_balance ?? 0) - creditsUsed);
      await admin.from('profiles').update({ credits_balance: next }).eq('id', scan.user_id);
    }

    const { data: updated } = await admin
      .from('scans')
      .update({
        status: 'completed',
        followers_count: delivered,
        videos_count: 0,
        credits_used: creditsUsed,
        completed_at: new Date().toISOString(),
      })
      .eq('id', scan.id)
      .select('*')
      .single();

    return json({ scan: updated, ingested: delivered });
  } catch (e) {
    return json({ error: String(e).slice(0, 300) }, 500);
  }
});
