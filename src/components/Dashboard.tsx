import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Scan, FollowerRecord, VideoRecord } from '@/lib/types';
import { LogoMark } from './icons';

const PAGE_SIZE = 50;

type Tab = 'scans' | 'followers' | 'videos';

function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          if (val == null) return '';
          const s = String(val).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function Dashboard({ onSignOut, onBackToLanding }: { onSignOut: () => void; onBackToLanding: () => void }) {
  const { profile, signOut } = useAuth();
  const [scans, setScans] = useState<Scan[]>([]);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [tab, setTab] = useState<Tab>('scans');
  const [followers, setFollowers] = useState<FollowerRecord[]>([]);
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [followerPage, setFollowerPage] = useState(0);
  const [videoPage, setVideoPage] = useState(0);
  const [loadingScans, setLoadingScans] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadScans() {
      setLoadingScans(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else {
        setScans((data as Scan[]) ?? []);
      }
      setLoadingScans(false);
    }
    loadScans();
    return () => { cancelled = true; };
  }, []);

  const openScan = useCallback(async (scan: Scan) => {
    setSelectedScan(scan);
    setTab('followers');
    setFollowers([]);
    setVideos([]);
    setFollowerPage(0);
    setVideoPage(0);
    setLoadingDetail(true);
    setError(null);

    const [fRes, vRes] = await Promise.all([
      supabase.from('followers').select('*', { count: 'exact' }).eq('scan_id', scan.id).range(0, PAGE_SIZE - 1),
      supabase.from('videos').select('*', { count: 'exact' }).eq('scan_id', scan.id).order('views', { ascending: false }).range(0, PAGE_SIZE - 1),
    ]);

    if (fRes.error || vRes.error) {
      setError(fRes.error?.message || vRes.error?.message || 'Failed to load results');
    } else {
      setFollowers((fRes.data as FollowerRecord[]) ?? []);
      setVideos((vRes.data as VideoRecord[]) ?? []);
      setFollowerCount(fRes.count ?? 0);
      setVideoCount(vRes.count ?? 0);
    }
    setLoadingDetail(false);
  }, []);

  const loadMoreFollowers = useCallback(async () => {
    if (!selectedScan) return;
    const next = followerPage + 1;
    const { data, error: err } = await supabase
      .from('followers')
      .select('*')
      .eq('scan_id', selectedScan.id)
      .range(next * PAGE_SIZE, (next + 1) * PAGE_SIZE - 1);
    if (err) return;
    setFollowers((prev) => [...prev, ...((data as FollowerRecord[]) ?? [])]);
    setFollowerPage(next);
  }, [selectedScan, followerPage]);

  const loadMoreVideos = useCallback(async () => {
    if (!selectedScan) return;
    const next = videoPage + 1;
    const { data, error: err } = await supabase
      .from('videos')
      .select('*')
      .eq('scan_id', selectedScan.id)
      .order('views', { ascending: false })
      .range(next * PAGE_SIZE, (next + 1) * PAGE_SIZE - 1);
    if (err) return;
    setVideos((prev) => [...prev, ...((data as VideoRecord[]) ?? [])]);
    setVideoPage(next);
  }, [selectedScan, videoPage]);

  const handleDownloadFollowers = useCallback(async () => {
    if (!selectedScan) return;
    const { data, error: err } = await supabase
      .from('followers')
      .select('username,display_name,profile_url,follower_count,video_count,verified,avatar_url,tiktok_user_id')
      .eq('scan_id', selectedScan.id);
    if (err) { setError(err.message); return; }
    downloadCSV(`${selectedScan.tiktok_handle}_followers.csv`, (data as Record<string, unknown>[]) ?? []);
  }, [selectedScan]);

  const handleDownloadVideos = useCallback(async () => {
    if (!selectedScan) return;
    const { data, error: err } = await supabase
      .from('videos')
      .select('caption,views,likes,comments,shares,saves,sound_name,duration_seconds,posted_at,hashtags')
      .eq('scan_id', selectedScan.id)
      .order('views', { ascending: false });
    if (err) { setError(err.message); return; }
    downloadCSV(`${selectedScan.tiktok_handle}_videos.csv`, (data as Record<string, unknown>[]) ?? []);
  }, [selectedScan]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    onSignOut();
  }, [signOut, onSignOut]);

  const backToScans = useCallback(() => {
    setSelectedScan(null);
    setTab('scans');
  }, []);

  // ===== styles =====
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#2B1CF5',
    color: '#FFFFFF',
    fontFamily: "'Instrument Sans', system-ui, sans-serif",
    overflowX: 'hidden',
  };
  const headerStyle: React.CSSProperties = {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  };
  const cardStyle: React.CSSProperties = {
    background: '#170E8F',
    borderRadius: 22,
    padding: 0,
    overflow: 'hidden',
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark />
          <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 24 }}>
            Scoutline
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px 20px', flexWrap: 'wrap' }}>
          <button type="button" onClick={onBackToLanding} style={{ background: 'none', border: 0, color: '#DCD8FF', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Landing page
          </button>
          {profile && (
            <span style={{ fontSize: 14, fontWeight: 600, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,225,74,0.15)', border: '1px solid rgba(255,225,74,0.4)' }}>
              <strong style={{ color: '#FFE14A' }}>{profile.credits_balance.toLocaleString()}</strong> credits
            </span>
          )}
          <button type="button" onClick={handleSignOut} className="sl-btn" style={{ background: '#FFE14A', color: '#170E8F', border: 0, fontFamily: 'inherit', fontSize: 15, fontWeight: 700, padding: '10px 18px', borderRadius: 999, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px 80px' }}>
        {error && (
          <div style={{ marginBottom: 20, fontSize: 15, fontWeight: 600, color: '#FF6B8B', background: 'rgba(255,107,139,0.12)', borderRadius: 12, padding: '12px 18px' }}>
            {error}
          </div>
        )}

        {/* ===== Scan list view ===== */}
        {!selectedScan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <h1 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.9 }}>
              Your scans
            </h1>

            {loadingScans ? (
              <div style={{ fontSize: 18, color: '#DCD8FF' }}>Loading…</div>
            ) : scans.length === 0 ? (
              <div style={{ padding: '48px 32px', textAlign: 'center', ...cardStyle }}>
                <div style={{ fontSize: 21, fontWeight: 700, marginBottom: 8 }}>No scans yet</div>
                <p style={{ fontSize: 16, color: '#DCD8FF', margin: 0 }}>
                  Go back to the landing page and pull an account to see your results here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scans.map((scan) => (
                  <button
                    key={scan.id}
                    type="button"
                    onClick={() => openScan(scan)}
                    className="sl-lift"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      flexWrap: 'wrap',
                      width: '100%',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 18,
                      padding: '20px 24px',
                      background: 'rgba(23,14,143,0.6)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: '#FFFFFF',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        @{scan.tiktok_handle}
                      </span>
                      <span style={{ fontSize: 14, color: '#B9B3F0' }}>{formatDate(scan.created_at)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px 24px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>
                        {scan.followers_count > 0 && `${formatNumber(scan.followers_count)} followers`}
                        {scan.followers_count > 0 && scan.videos_count > 0 && ' · '}
                        {scan.videos_count > 0 && `${formatNumber(scan.videos_count)} videos`}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: 999,
                          background: scan.status === 'completed' ? 'rgba(124,245,208,0.2)' : scan.status === 'failed' ? 'rgba(255,107,139,0.2)' : 'rgba(255,225,74,0.2)',
                          color: scan.status === 'completed' ? '#7CF5D0' : scan.status === 'failed' ? '#FF6B8B' : '#FFE14A',
                        }}
                      >
                        {scan.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Scan detail view ===== */}
        {selectedScan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button type="button" onClick={backToScans} style={{ background: 'none', border: 0, color: '#DCD8FF', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                ← All scans
              </button>
              <h1 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.9 }}>
                @{selectedScan.tiktok_handle}
              </h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid rgba(255,255,255,0.12)' }}>
              {(['followers', 'videos'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    border: 0,
                    borderBottom: tab === t ? '3px solid #FFE14A' : '3px solid transparent',
                    background: 'none',
                    color: tab === t ? '#FFFFFF' : '#8F88C9',
                    fontFamily: 'inherit',
                    fontSize: 17,
                    fontWeight: 700,
                    padding: '10px 20px',
                    cursor: 'pointer',
                    marginBottom: -2,
                  }}
                >
                  {t === 'followers' ? `Followers (${followerCount})` : `Videos (${videoCount})`}
                </button>
              ))}
            </div>

            {loadingDetail ? (
              <div style={{ fontSize: 18, color: '#DCD8FF' }}>Loading results…</div>
            ) : (
              <>
                {/* Followers tab */}
                {tab === 'followers' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {followerCount > 0 && (
                      <button type="button" onClick={handleDownloadFollowers} className="sl-btn" style={{ alignSelf: 'flex-start', background: '#FFE14A', color: '#170E8F', border: 0, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, padding: '12px 22px', borderRadius: 999, cursor: 'pointer' }}>
                        Download CSV
                      </button>
                    )}
                    {followers.length === 0 ? (
                      <div style={{ padding: 32, textAlign: 'center', ...cardStyle, color: '#DCD8FF' }}>
                        No follower data in this scan yet.
                      </div>
                    ) : (
                      <div style={{ ...cardStyle, overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, minWidth: 600 }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.12)' }}>
                              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Username</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Followers</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Videos</th>
                              <th style={{ textAlign: 'center', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Verified</th>
                            </tr>
                          </thead>
                          <tbody>
                            {followers.map((f) => (
                              <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <td style={{ padding: '12px 20px', fontWeight: 700 }}>
                                  {f.username}
                                  {f.display_name && <div style={{ fontSize: 13, fontWeight: 400, color: '#B9B3F0' }}>{f.display_name}</div>}
                                </td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(f.follower_count)}</td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(f.video_count)}</td>
                                <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                                  {f.verified ? <span style={{ color: '#FFE14A', fontWeight: 700 }}>✓</span> : <span style={{ color: '#5D57A0' }}>—</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {(followerPage + 1) * PAGE_SIZE < followerCount && (
                      <button type="button" onClick={loadMoreFollowers} className="sl-btn" style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, padding: '12px 28px', borderRadius: 999, cursor: 'pointer' }}>
                        Load more
                      </button>
                    )}
                  </div>
                )}

                {/* Videos tab */}
                {tab === 'videos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {videoCount > 0 && (
                      <button type="button" onClick={handleDownloadVideos} className="sl-btn" style={{ alignSelf: 'flex-start', background: '#FFE14A', color: '#170E8F', border: 0, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, padding: '12px 22px', borderRadius: 999, cursor: 'pointer' }}>
                        Download CSV
                      </button>
                    )}
                    {videos.length === 0 ? (
                      <div style={{ padding: 32, textAlign: 'center', ...cardStyle, color: '#DCD8FF' }}>
                        No video data in this scan yet.
                      </div>
                    ) : (
                      <div style={{ ...cardStyle, overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, minWidth: 700 }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.12)' }}>
                              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Caption</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Views</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Likes</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Shares</th>
                              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#8F88C9' }}>Posted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {videos.map((v) => (
                              <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <td style={{ padding: '12px 20px', fontWeight: 700, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {v.caption || '—'}
                                  {v.sound_name && <div style={{ fontSize: 13, fontWeight: 400, color: '#B9B3F0' }}>{v.sound_name}</div>}
                                </td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatNumber(v.views)}</td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(v.likes)}</td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatNumber(v.shares)}</td>
                                <td style={{ padding: '12px 20px', textAlign: 'right', fontSize: 14, color: '#B9B3F0' }}>{formatDate(v.posted_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {(videoPage + 1) * PAGE_SIZE < videoCount && (
                      <button type="button" onClick={loadMoreVideos} className="sl-btn" style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, padding: '12px 28px', borderRadius: 999, cursor: 'pointer' }}>
                        Load more
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
