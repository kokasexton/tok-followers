// Apify actor configuration for TikTok data pulls.
// Updated to use scraping_solutions (no hard cap, continuation tokens)
// instead of clockworks (caps at 10,000 followers per run).

export const TIKTOK_ACTORS = {
  followers: {
    actorId: 'scraping_solutions/tiktok-followers-following-scraper',
    apifyId: 'clockworks~tiktok-followers-scraper',
    inputSchema: {
      Account: 'string[] — TikTok usernames, @handles, or profile URLs',
      dataToScrape: "'followers' | 'following'",
      resultsLimit: 'number — max unique profiles per username (target, not guarantee)',
      continuationToken: 'string — optional, from prior run for pagination',
    },
    costPerRowUsd: 0.0004,
  },
  videos: {
    actorId: 'clockworks/tiktok-profile-scraper',
    inputSchema: {
      profiles: 'string[] — TikTok usernames',
      oldestPostDateUnified: 'ISO date string, e.g. "30 days"',
      resultsPerPage: 'number — max results per profile',
    },
    costPerRowUsd: 0.003,
  },
} as const;

// Follower output fields from scraping_solutions:
// id, name (username), nickName (display name), profileUrl, verified, fans (follower count), video (video count), avatar

// Video output fields from clockworks/tiktok-profile-scraper:
// text (caption), playCount, diggCount, commentCount, shareCount, collectCount (saves),
// musicMeta (sound name), videoMeta.duration, createTimeISO, hashtags
