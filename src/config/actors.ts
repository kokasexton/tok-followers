// Apify actor configuration for TikTok data pulls.
//
// FOLLOWERS / AUDIENCE — afanasenko/tiktok-profile-scraper (id evoGyJLMGMqysXSfl)
//   Store: https://apify.com/afanasenko/tiktok-profile-scraper
//   Modes: analyzeFollowersFollowing | analyzeSpecificAccounts | analyzeEngagedAudience
//   Pricing: PAY_PER_EVENT — $0.002 per "Profile Analyzed" (retrieved + analyzed,
//   whether or not it passes filters). Cost is capped per run by maxCount / maxBudgetUsd.
//   Runs from the `start-scan` Supabase edge function (never from the browser).
//
// VIDEO METRICS — NOT covered by the actor above. It returns profile-level engagement
//   (Median Views, Most Viewed Video Plays, Avg Shares, ER, Last Post Date) plus up to 20
//   post captions — no per-video rows. Per-video output needs a second actor, e.g.
//   clockworks/tiktok-profile-scraper. Left referenced here so the wiring is explicit.

export const APIFY_FOLLOWERS_ACTOR = 'afanasenko~tiktok-profile-scraper';

export type OperationMode =
  | 'analyzeFollowersFollowing'
  | 'analyzeSpecificAccounts'
  | 'analyzeEngagedAudience';

export interface FollowerScanInput {
  operationMode: OperationMode;
  /** Mode 1 & 3: 1–3 target accounts. */
  targetUsernames?: string[];
  /** Mode 2: a known username list to enrich. */
  specificUsernamesList?: string[];
  analyzeFollowers?: boolean;
  /** Hard cost ceiling (rows) — each profile = one $0.002 event. */
  maxCount?: number;
  maxCountList?: number;
  maxEngagedProfiles?: number;
  /** Alternative USD ceiling; the run stops before exceeding it. */
  maxBudgetUsd?: number;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRatio?: number;
  extractEmail?: boolean;
  extractWebsiteUrl?: boolean;
  postExtractionMode?: 'none' | 'recent' | 'popular';
  clearSavedData?: boolean;
}

// Fields returned per analyzed profile (afanasenko) — verified against a live run 2026-10-06.
// "N/A" / "No Content" replace nulls. "Row Status" is 'delivered' or withheld; "Why Withheld"
// explains the latter.
export const FOLLOWER_OUTPUT_FIELDS = [
  'Account',
  'Source',
  'Profile Picture',
  'Full Name',
  'Followers Count',
  'Following Count',
  'Likes Count',
  'Videos Count',
  'Median Views',
  'Most Viewed Video Plays',
  'Avg. Shares (Recent)',
  'ER (incl. shares) (%)',
  'Last Post Date',
  'Biography',
  'Profile Language',
  'Verified',
  'Category',
  'Account Type',
  'Email',
  'Website',
  'Row Status',
  'Why Withheld',
] as const;

export const FOLLOWER_COST_PER_PROFILE_USD = 0.002;

/**
 * Build the Apify input for a followers pull. `limit` is the hard row ceiling
 * (translated straight into dollars at $0.002/row).
 */
export function buildFollowersInput(handle: string, limit: number): FollowerScanInput {
  const clean = handle.replace(/^@+/, '').trim();
  return {
    operationMode: 'analyzeFollowersFollowing',
    targetUsernames: [clean],
    analyzeFollowers: true,
    maxCount: Math.max(1, Math.min(limit, 100000)),
    maxBudgetUsd: Math.max(0.01, limit * FOLLOWER_COST_PER_PROFILE_USD),
    extractEmail: true,
    extractWebsiteUrl: true,
    postExtractionMode: 'recent',
    clearSavedData: false,
  };
}
