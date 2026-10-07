import { UploadIcon } from './icons';
import { FollowerRow } from '@/data/tiktokData';

interface PhoneProps {
  shown: string;
  initials: string;
  statusLine: string;
  pillBg: string;
  isIdle: boolean;
  isLoading: boolean;
  isDone: boolean;
  rows: FollowerRow[];
}

export function Phone({ shown, initials, statusLine, pillBg, isIdle, isLoading, isDone, rows }: PhoneProps) {
  return (
    <div style={{ position: 'relative', width: 330, maxWidth: '100%', aspectRatio: '9 / 18.5', borderRadius: 48, background: 'rgba(13,8,56,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: 12, boxShadow: '0 60px 120px -30px rgba(8,4,60,0.95), 0 0 80px -20px rgba(255,79,184,0.55), inset 0 0 0 2px rgba(255,255,255,0.22)', boxSizing: 'border-box', animation: 'sl-phone 9s ease-in-out infinite' }}>
      {/* glare */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 12, borderRadius: 38, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '45%', height: '140%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', animation: 'sl-glare 7s ease-in-out infinite' }} />
      </div>
      <div style={{ height: '100%', borderRadius: 38, background: '#FFFFFF', color: '#170E8F', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* profile header */}
        <div style={{ padding: '26px 18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', borderBottom: '1px solid #ECEAFB' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#2B1CF5', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 }}>{initials}</div>
          <div style={{ fontWeight: 800, fontSize: 17, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shown}</div>
          <div style={{ display: 'flex', gap: 18, fontSize: 12, color: '#5D57A0' }}>
            <span><strong style={{ color: '#170E8F', fontSize: 15 }}>212K</strong> followers</span>
            <span><strong style={{ color: '#170E8F', fontSize: 15 }}>41</strong> videos (30d)</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: pillBg, color: '#170E8F' }}>{statusLine}</div>
        </div>

        {/* loading state */}
        {isLoading && (
          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Pulling public followers\u2026</div>
            <div style={{ height: 8, borderRadius: 8, background: '#ECEAFB', overflow: 'hidden' }}>
              <div style={{ height: 8, borderRadius: 8, background: '#2B1CF5', animation: 'sl-load 1.6s ease-out forwards' }} />
            </div>
            <div style={{ height: 40, borderRadius: 10, background: '#ECEAFB', animation: 'sl-pulse 1s ease-in-out infinite' }} />
            <div style={{ height: 40, borderRadius: 10, background: '#ECEAFB', animation: 'sl-pulse 1s ease-in-out 0.15s infinite' }} />
            <div style={{ height: 40, borderRadius: 10, background: '#ECEAFB', animation: 'sl-pulse 1s ease-in-out 0.3s infinite' }} />
            <div style={{ height: 40, borderRadius: 10, background: '#ECEAFB', animation: 'sl-pulse 1s ease-in-out 0.45s infinite' }} />
          </div>
        )}

        {/* rows */}
        {!isLoading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {rows.map((r, k) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderBottom: '1px solid #F3F2FD',
                  animation: 'sl-pop 0.4s ease both',
                  animationDelay: r.delay,
                }}
              >
                <div style={{ width: 34, height: 34, flex: '0 0 34px', borderRadius: '50%', background: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#170E8F' }}>{r.i}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.h}</div>
                  <div style={{ fontSize: 12, color: '#5D57A0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.b}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{r.f}</div>
                {r.verified && (
                  <svg width="14" height="14" viewBox="0 0 24 24" style={{ flex: '0 0 14px' }} aria-hidden="true">
                    <path d="M12 2l2.6 1.5 3-.4 1 2.8 2.3 2-1 2.8 1 2.8-2.3 2-1 2.8-3-.4L12 22l-2.6-1.5-3 .4-1-2.8-2.3-2 1-2.8-1-2.8 2.3-2 1-2.8 3 .4z" fill="#2B1CF5" />
                    <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}

        {/* done CTA */}
        {isDone && (
          <a href="#pricing" className="sl-btn" style={{ margin: '12px 14px 16px', textDecoration: 'none', textAlign: 'center', background: '#2B1CF5', color: '#FFFFFF', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 14 }}>
            Pull all 212,480 for $2,125
          </a>
        )}

        {/* idle hint */}
        {isIdle && (
          <div style={{ margin: '12px 14px 16px', textAlign: 'center', fontSize: 12, color: '#5D57A0' }}>
            Sample report. Type a handle to preview yours.
          </div>
        )}
      </div>
    </div>
  );
}

export function FloatingChips() {
  return (
    <>
      {/* followers chip */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          zIndex: 2,
          ['--r' as string]: '-6deg',
          animation: 'sl-float 5s ease-in-out infinite',
          background: 'rgba(255,225,74,0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.7)',
          color: '#170E8F',
          borderRadius: 18,
          padding: '14px 18px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -18px rgba(10,6,80,0.9)',
        }}
      >
        <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 36, lineHeight: 1 }}>212,480</div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>followers in the file</div>
      </div>

      {/* views chip */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          right: 0,
          zIndex: 2,
          ['--r' as string]: '5deg',
          animation: 'sl-float 6s ease-in-out 0.8s infinite',
          background: 'rgba(255,122,198,0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.7)',
          color: '#170E8F',
          borderRadius: 18,
          padding: '14px 18px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 50px -18px rgba(10,6,80,0.9)',
        }}
      >
        <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 36, lineHeight: 1 }}>2.1M views</div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>their top video this month</div>
      </div>

      {/* top sound chip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 210,
          right: 6,
          zIndex: 3,
          ['--r' as string]: '3deg',
          animation: 'sl-float 6.5s ease-in-out 0.4s infinite',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 24px 50px -18px rgba(10,6,80,0.9)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
          {['#5EE7FF', '#FFE14A', '#FF7AC6', '#FFFFFF'].map((c, i) => (
            <span key={i} style={{ width: 4, borderRadius: 2, background: c, animation: `sl-eq 0.9s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </span>
        <span>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>Top sound: original audio</span>
          <span style={{ display: 'block', fontSize: 12, color: '#DCD8FF' }}>used on 62% of their videos</span>
        </span>
      </div>

      {/* shares chip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 210,
          left: 10,
          zIndex: 3,
          ['--r' as string]: '-4deg',
          animation: 'sl-float 7s ease-in-out 1.4s infinite',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px 10px 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 24px 50px -18px rgba(10,6,80,0.9)',
        }}
      >
        <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#5EE7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UploadIcon size={16} stroke="#170E8F" />
        </span>
        <span style={{ fontSize: 14, fontWeight: 700 }}>18.4K shares on one video</span>
      </div>
    </>
  );
}
