import { FollowerRow, VideoRow } from '@/data/tiktokData';

interface ReportProps {
  rows: FollowerRow[];
  vids: VideoRow[];
}

export function Report({ rows, vids }: ReportProps) {
  return (
    <section id="report" style={{ background: '#170E8F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <h2
            className="sl-reveal"
            style={{
              margin: 0,
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(48px, 6.4vw, 96px)',
              lineHeight: 0.86,
              maxWidth: 760,
            }}
          >
            Two files. Everything they won't tell you.
          </h2>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: '#DCD8FF', maxWidth: 420 }}>
            The follower list shows who they've won. The video report shows how they won them.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {/* followers file */}
          <div
            className="sl-lift"
            style={{ flex: '1 1 440px', minWidth: 0, background: '#FFFFFF', color: '#170E8F', borderRadius: 26, overflow: 'hidden' }}
          >
            <div style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 34 }}>Followers</h3>
              <span style={{ fontSize: 14, color: '#5D57A0' }}>Included</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 500 }}>
                <div style={{ display: 'flex', padding: '10px 24px', fontSize: 13, fontWeight: 700, color: '#5D57A0', background: '#F3F2FD' }}>
                  <div style={{ flex: 1 }}>Username</div>
                  <div style={{ width: 92, textAlign: 'right' }}>Followers</div>
                  <div style={{ width: 76, textAlign: 'right' }}>Videos</div>
                  <div style={{ width: 72, textAlign: 'center' }}>Verified</div>
                </div>
                {rows.map((r, k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', fontSize: 15, borderBottom: '1px solid #F3F2FD' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>{r.h}</div>
                      <div style={{ fontSize: 13, color: '#5D57A0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.b}</div>
                    </div>
                    <div style={{ width: 92, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.f}</div>
                    <div style={{ width: 76, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#4A4490' }}>{r.v}</div>
                    <div style={{ width: 72, textAlign: 'center' }}>
                      {r.verified ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" aria-label="Verified" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <path d="M12 2l2.6 1.5 3-.4 1 2.8 2.3 2-1 2.8 1 2.8-2.3 2-1 2.8-3-.4L12 22l-2.6-1.5-3 .4-1-2.8-2.3-2 1-2.8-1-2.8 2.3-2 1-2.8 3 .4z" fill="#2B1CF5" />
                          <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: 13, color: '#B9B3F0' }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', fontSize: 14, color: '#5D57A0' }}>
              Also: display name, profile URL, avatar URL, TikTok user ID.
            </div>
          </div>

          {/* videos file */}
          <div
            className="sl-lift"
            style={{
              flex: '1 1 560px',
              minWidth: 0,
              background: '#FFE14A',
              color: '#170E8F',
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 0 80px -30px rgba(255,225,74,0.7)',
            }}
          >
            <div style={{ padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 34 }}>Last 30 days of videos</h3>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Add-on</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 600 }}>
                <div style={{ display: 'flex', padding: '10px 24px', fontSize: 13, fontWeight: 700, background: '#F5D52E' }}>
                  <div style={{ flex: 1 }}>Video</div>
                  <div style={{ width: 76, textAlign: 'right' }}>Views</div>
                  <div style={{ width: 70, textAlign: 'right' }}>Shares</div>
                  <div style={{ width: 64, textAlign: 'right' }}>Length</div>
                  <div style={{ width: 92, textAlign: 'right' }}>Posted</div>
                </div>
                {vids.map((v, k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', fontSize: 15, borderBottom: '1px solid #F0D02A' }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ flex: '0 0 30px', height: 42, borderRadius: 6, background: v.c }} />
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.hook}</span>
                        <span style={{ display: 'block', fontSize: 13, color: '#4A4490' }}>{v.sound}</span>
                      </span>
                    </div>
                    <div style={{ width: 76, textAlign: 'right', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{v.views}</div>
                    <div style={{ width: 70, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.shares}</div>
                    <div style={{ width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v.len}</div>
                    <div style={{ width: 92, textAlign: 'right' }}>{v.when}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', fontSize: 14 }}>
              Also: likes, comments, saves, sound name, hashtags and the full caption for every video.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
