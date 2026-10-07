// start-scan — kick off an Apify followers pull for an authenticated user.
// Enforces the credit ceiling (1 credit = 1 delivered row) and a one-per-24h free preview.
import { handleOptions, json } from '../_shared/cors.ts';
import { adminClient, requireUser } from '../_shared/supabaseAdmin.ts';
import { startRun } from '../_shared/apify.ts';

const PREVIEW_LIMIT = 25;

function cleanHandle(h: string): string {
  return (h || '')
    .trim()
    .replace(/^https?:\/\/(www\.)?tiktok\.com\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/^@+/, '');
}

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    const user = await requireUser(req);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const { handle, scanType = 'followers', limit = 0, preview = false } =
      await req.json().catch(() => ({}));
    const target = cleanHandle(String(handle ?? ''));
    if (!target) return json({ error: 'A TikTok handle is required' }, 400);

    const admin = adminClient();

    // Load profile + credit balance.
    const { data: profile } = await admin
      .from('profiles')
      .select('credits_balance')
      .eq('id', user.id)
      .maybeSingle();
    const balance = profile?.credits_balance ?? 0;

    // Free preview: 25 rows, no credits, once per handle per user per 24h.
    if (preview) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await admin
        .from('scans')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('tiktok_handle', target)
        .eq('is_preview', true)
        .gte('created_at', since);
      if ((count ?? 0) > 0) {
        return json({ error: 'You already used the free preview for this account in the last 24 hours.' }, 429);
      }
    }

    const requested = preview ? PREVIEW_LIMIT : Math.max(0, Math.floor(Number(limit)));
    if (!preview && requested < 1) return json({ error: 'Limit must be at least 1' }, 400);

    // Ceiling = what they can pay for. Never launch a run that can overspend.
    const effective = preview ? PREVIEW_LIMIT : Math.min(requested, balance);
    if (effective < 1) return json({ error: 'Not enough credits. Top up to run a scan.' }, 402);

    const { data: scan, error: scanErr } = await admin
      .from('scans')
      .insert({
        user_id: user.id,
        tiktok_handle: target,
        scan_type: scanType,
        status: 'pending',
        results_limit: effective,
        is_preview: preview,
      })
      .select('*')
      .single();
    if (scanErr) return json({ error: scanErr.message }, 500);

    // Build the Apify input (afanasenko/tiktok-profile-scraper, mode 1).
    const input = {
      operationMode: 'analyzeFollowersFollowing',
      targetUsernames: [target],
      analyzeFollowers: true,
      maxCount: effective,
      maxBudgetUsd: Math.max(0.01, effective * 0.002),
      extractEmail: true,
      extractWebsiteUrl: true,
      postExtractionMode: 'recent',
      clearSavedData: false,
    };

    try {
      const run = await startRun(input);
      await admin
        .from('scans')
        .update({ status: 'running', apify_run_id: run.id, apify_dataset_id: run.defaultDatasetId })
        .eq('id', scan.id);
      return json({ scan: { ...scan, status: 'running', apify_run_id: run.id, apify_dataset_id: run.defaultDatasetId } });
    } catch (e) {
      await admin
        .from('scans')
        .update({ status: 'failed', error_message: String(e).slice(0, 500) })
        .eq('id', scan.id);
      return json({ error: `Could not start the scan: ${String(e).slice(0, 200)}` }, 502);
    }
  } catch (e) {
    return json({ error: String(e).slice(0, 300) }, 500);
  }
});
