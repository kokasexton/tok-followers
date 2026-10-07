// Minimal Apify REST client for the afanasenko/tiktok-profile-scraper actor.
// Docs: https://docs.apify.com/api/v2 — run start, run poll, dataset read.

const APIFY = 'https://api.apify.com/v2';
const ACTOR = 'afanasenko~tiktok-profile-scraper';

function token(): string {
  const t = Deno.env.get('APIFY_TOKEN');
  if (!t) throw new Error('APIFY_TOKEN is not set');
  return t;
}

export interface ApifyRun {
  id: string;
  status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'ABORTING' | 'ABORTED' | 'TIMING-OUT' | 'TIMED-OUT';
  defaultDatasetId: string;
}

export async function startRun(input: Record<string, unknown>): Promise<ApifyRun> {
  const res = await fetch(`${APIFY}/acts/${ACTOR}/runs?token=${token()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Apify start failed: ${res.status} ${JSON.stringify(body)}`);
  return body.data as ApifyRun;
}

export async function getRun(runId: string): Promise<ApifyRun> {
  const res = await fetch(`${APIFY}/actor-runs/${runId}?token=${token()}`);
  const body = await res.json();
  if (!res.ok) throw new Error(`Apify poll failed: ${res.status} ${JSON.stringify(body)}`);
  return body.data as ApifyRun;
}

export async function getDatasetItems(datasetId: string, limit = 100000): Promise<Record<string, unknown>[]> {
  const items: Record<string, unknown>[] = [];
  const pageSize = 1000;
  let offset = 0;
  // Paginate; stop early once we hit the requested limit.
  while (items.length < limit) {
    const url = `${APIFY}/datasets/${datasetId}/items?token=${token()}&clean=true&offset=${offset}&limit=${pageSize}`;
    const res = await fetch(url);
    const body = await res.json();
    if (!res.ok) throw new Error(`Apify dataset read failed: ${res.status}`);
    const batch = body as Record<string, unknown>[];
    items.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }
  return items.slice(0, limit);
}

// ---- Output mapping (afanasenko) → our schema ------------------------------

function num(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === 'number' ? v : parseInt(String(v).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === 'N/A' || s === 'No Content') return null;
  return s;
}

export interface FollowerInsert {
  scan_id: string;
  user_id: string;
  tiktok_user_id: string | null;
  username: string;
  display_name: string | null;
  profile_url: string | null;
  follower_count: number | null;
  video_count: number | null;
  verified: boolean;
  avatar_url: string | null;
}

/** Map one Apify dataset row to a `followers` insert row. */
export function mapFollowerRow(
  row: Record<string, unknown>,
  scan: { id: string; user_id: string },
): FollowerInsert | null {
  // Respect the actor's own delivery verdict — withheld rows are not billed and not stored.
  const rowStatus = str(row['Row Status']);
  if (rowStatus && rowStatus.toLowerCase() !== 'delivered') return null;
  const account = str(row['Account']) ?? '';
  const username = (str(row['User Name']) ?? account.replace(/^https?:\/\/tiktok\.com\/@?/i, '')).replace(/^@/, '');
  if (!username) return null;
  return {
    scan_id: scan.id,
    user_id: scan.user_id,
    tiktok_user_id: str(row['User ID']) ?? str(row['ID']),
    username,
    display_name: str(row['Full Name']),
    profile_url: account ? (account.startsWith('http') ? account : `https://tiktok.com/@${username}`) : `https://tiktok.com/@${username}`,
    follower_count: num(row['Followers Count']),
    video_count: num(row['Videos Count']),
    verified: String(row['Verified'] ?? '').toLowerCase() === 'yes',
    avatar_url: str(row['Profile Picture']),
  };
}
