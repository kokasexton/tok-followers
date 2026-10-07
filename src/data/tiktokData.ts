// Sample data for the TikTok Scoutline landing page
// Fields match scraping_solutions/tiktok-followers-following-scraper output
// and clockworks/tiktok-profile-scraper output.

export interface FollowerRow {
  i: string;
  c: string;
  h: string;
  b: string;
  f: string;
  v: string;
  verified: boolean;
  delay: string;
}

export interface VideoRow {
  c: string;
  hook: string;
  sound: string;
  views: string;
  shares: string;
  len: string;
  when: string;
}

export interface HookRow {
  name: string;
  label: string;
  w: number;
  c: string;
}

export interface Pack {
  c: string;
  credits: number;
  p: string;
  priceUsd: number;
  /** Stripe Price ID (price_…). Populated by `node scripts/stripe-setup.mjs`; see .env.example. */
  stripePriceId: string;
  fits: string;
}

export const PACKS: Pack[] = [
  { c: '2,500', credits: 2500, p: '$25', priceUsd: 25, stripePriceId: import.meta.env.VITE_STRIPE_PRICE_2500 ?? '', fits: 'Pulls one account with up to 2,500 followers, or the last 30 days of videos for about 60 accounts.' },
  { c: '10,000', credits: 10000, p: '$100', priceUsd: 100, stripePriceId: import.meta.env.VITE_STRIPE_PRICE_10000 ?? '', fits: 'Pulls a 10K-follower creator, or a 9K account plus its last 30 days of videos.' },
  { c: '50,000', credits: 50000, p: '$500', priceUsd: 500, stripePriceId: import.meta.env.VITE_STRIPE_PRICE_50000 ?? '', fits: 'Pulls a 50K-follower competitor, or five 10K creators in your niche.' },
  { c: '250,000', credits: 250000, p: '$2,500', priceUsd: 2500, stripePriceId: import.meta.env.VITE_STRIPE_PRICE_250000 ?? '', fits: 'Pulls a 212K account like the sample above, with plenty left for videos on dozens of accounts.' },
];

export const FOLLOWER_ROWS: Omit<FollowerRow, 'delay'>[] = [
  { i: 'AV', c: '#FF7AC6', h: '@ava.glowsup', b: 'Skincare reviews, honest only', f: '184K', v: '87', verified: true },
  { i: 'MB', c: '#7CF5D0', h: '@marcus.builds', b: 'Grooming and routines, NYC', f: '61.2K', v: '142', verified: false },
  { i: 'LS', c: '#FFE14A', h: '@lunaskinlab', b: 'Indie skincare brand, shop below', f: '29.8K', v: '53', verified: true },
  { i: 'TP', c: '#C4BCFF', h: '@tasha.pov', b: 'Esthetician. POV storytimes', f: '12.7K', v: '31', verified: false },
  { i: 'RJ', c: '#FFB38A', h: '@rj.rates.it', b: 'I try it so you don\u2019t have to', f: '4,416', v: '19', verified: false },
];

export const VIDEOS: VideoRow[] = [
  { c: '#2B1CF5', hook: 'POV: your skin after 7 days', sound: 'Original audio', views: '2.1M', shares: '18.4K', len: '0:27', when: 'Sun 7:12pm' },
  { c: '#FF7AC6', hook: 'Dermatologist reacts to my routine', sound: 'Duet', views: '864K', shares: '6,120', len: '0:34', when: 'Wed 6:40pm' },
  { c: '#7CF5D0', hook: 'Full routine under $40', sound: 'Trending audio', views: '512K', shares: '4,980', len: '0:22', when: 'Sun 8:05pm' },
  { c: '#FFB38A', hook: 'Things I stopped buying', sound: 'Original audio', views: '301K', shares: '2,210', len: '0:31', when: 'Fri 12:30pm' },
  { c: '#C4BCFF', hook: 'Unboxing the new serum', sound: 'Trending audio', views: '96K', shares: '410', len: '0:58', when: 'Tue 9:15am' },
];

export const HOOKS: HookRow[] = [
  { name: '\u201CPOV:\u201D openers', label: '41%', w: 100, c: '#FFE14A' },
  { name: 'Expert reaction', label: '22%', w: 54, c: '#FF7AC6' },
  { name: 'Price-point list', label: '17%', w: 41, c: '#7CF5D0' },
  { name: 'Unboxing', label: '6%', w: 15, c: '#C4BCFF' },
];

export const TICKER: string[] = [
  '212,480 followers', '41 videos', '2.1M views', 'POV hooks win', 'Sunday 7pm', '21\u201334 seconds',
];
export const TICKER2: string[] = [
  'Every follower', 'Every video', 'Every hook', 'Every sound', 'One download', 'No login',
];

// Exact data fields shown in the "What's in the file" preview section.
// Follower fields match scraping_solutions output.
export interface FollowerField {
  field: string;
  label: string;
  sample: string;
}

export const FOLLOWER_FIELDS: FollowerField[] = [
  { field: 'username', label: 'Username', sample: '@ava.glowsup' },
  { field: 'nickName', label: 'Display name', sample: 'Ava Glow' },
  { field: 'profileUrl', label: 'Profile URL', sample: 'tiktok.com/@ava.glowsup' },
  { field: 'fans', label: 'Follower count', sample: '184,200' },
  { field: 'video', label: 'Video count', sample: '87' },
  { field: 'verified', label: 'Verified flag', sample: 'Yes' },
  { field: 'avatar', label: 'Avatar URL', sample: 'p16-sign…/avatar.jpg' },
  { field: 'id', label: 'TikTok user ID', sample: '6784642169778...' },
];

// Video fields match clockworks/tiktok-profile-scraper output.
export const VIDEO_FIELDS: FollowerField[] = [
  { field: 'text', label: 'Full caption', sample: 'POV: your skin after 7 days #skincare' },
  { field: 'playCount', label: 'Views', sample: '2,100,000' },
  { field: 'diggCount', label: 'Likes', sample: '312,400' },
  { field: 'commentCount', label: 'Comments', sample: '4,820' },
  { field: 'shareCount', label: 'Shares', sample: '18,400' },
  { field: 'collectCount', label: 'Saves', sample: '9,210' },
  { field: 'musicMeta', label: 'Sound / music', sample: 'Original audio' },
  { field: 'videoMeta.duration', label: 'Video duration (sec)', sample: '27' },
  { field: 'createTimeISO', label: 'Posted date/time', sample: '2026-09-28T19:12Z' },
  { field: 'hashtags', label: 'Hashtags', sample: '#skincare #pov #routine' },
];
