export interface Profile {
  id: string;
  email: string;
  credits_balance: number;
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  tiktok_handle: string;
  scan_type: 'followers' | 'videos' | 'both';
  status: 'pending' | 'running' | 'completed' | 'failed';
  results_limit: number;
  followers_count: number;
  videos_count: number;
  credits_used: number;
  continuation_token: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface FollowerRecord {
  id: string;
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
  created_at: string;
}

export interface VideoRecord {
  id: string;
  scan_id: string;
  user_id: string;
  tiktok_video_id: string | null;
  caption: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  sound_name: string | null;
  duration_seconds: number | null;
  posted_at: string | null;
  hashtags: string[] | null;
  created_at: string;
}
