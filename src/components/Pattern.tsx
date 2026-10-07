import { HookRow } from '@/data/tiktokData';

interface PatternProps {
  hooks: HookRow[];
}

export function Pattern({ hooks }: PatternProps) {
  return (
    <section
      id="videos"
      style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}
    >
      <div
        aria-hidden="true"
        style={{ position: 'absolute', top: 220, left: '10%', width: 520, height: 520, borderRadius: '50%', background: '#FF4FB8', filter: 'blur(110px)', opacity: 0.45, pointerEvents: 'none', animation: 'sl-drift1 20s ease-in-out infinite' }}
      />
      <div
        aria-hidden="true"
        style={{ position: 'absolute', top: 320, right: '4%', width: 420, height: 420, borderRadius: '50%', background: '#5EE7FF', filter: 'blur(110px)', opacity: 0.35, pointerEvents: 'none', animation: 'sl-drift2 24s ease-in-out infinite' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(48px, 6.4vw, 96px)',
            lineHeight: 0.86,
            maxWidth: 820,
          }}
        >
          Copy the pattern, not the video.
        </h2>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: '#DCD8FF', maxWidth: 420 }}>
          The 30-day add-on sums up what their videos have in common, so you leave with a plan instead of a pile of links.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div
          className="sl-reveal"
          style={{
            position: 'relative',
            flex: '1 1 460px',
            minWidth: 0,
            background: 'rgba(23,14,143,0.45)',
            backdropFilter: 'blur(26px) saturate(170%)',
            WebkitBackdropFilter: 'blur(26px) saturate(170%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 40px 80px -40px rgba(8,4,60,0.9)',
            borderRadius: 26,
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700 }}>Which hooks pull the views</h3>
          {hooks.map((h, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
                <span style={{ fontWeight: 600 }}>{h.name}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: '#DCD8FF' }}>{h.label}</span>
              </div>
              <div style={{ height: 14, borderRadius: 14, background: 'rgba(255,255,255,0.12)' }}>
                <div
                  className="sl-grow"
                  style={{ height: 14, borderRadius: 14, width: `${h.w}%`, background: h.c, boxShadow: `0 0 20px ${h.c}` }}
                />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 13, color: '#B9B3F0' }}>Share of total views, sample account</div>
        </div>
        <div style={{ position: 'relative', flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            className="sl-reveal"
            style={{
              background: 'rgba(255,122,198,0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 60px -30px rgba(255,79,184,0.8)',
              color: '#170E8F',
              borderRadius: 26,
              padding: 28,
            }}
          >
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 72, lineHeight: 0.9 }}>21–34 sec</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>the length of their 5 best videos</div>
          </div>
          <div
            className="sl-reveal"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: 'inset 0 1px 0 #FFFFFF, 0 30px 60px -30px rgba(94,231,255,0.7)',
              color: '#170E8F',
              borderRadius: 26,
              padding: 28,
            }}
          >
            <div style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 72, lineHeight: 0.9 }}>Sun 7pm</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>when their videos take off fastest</div>
          </div>
        </div>
      </div>
    </section>
  );
}
