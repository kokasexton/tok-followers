export function FinalCTA() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            width: 760,
            height: 420,
            marginLeft: -380,
            borderRadius: '50%',
            background: '#FF4FB8',
            filter: 'blur(120px)',
            opacity: 0.45,
            animation: 'sl-drift1 18s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '8%',
            width: 120,
            height: 120,
            borderRadius: 32,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.35)',
            ['--r' as string]: '-12deg',
            animation: 'sl-float 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '14%',
            right: '9%',
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,225,74,0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.35)',
            ['--r' as string]: '0deg',
            animation: 'sl-float 9s ease-in-out 1s infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12%',
            right: '16%',
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(94,231,255,0.25)',
            border: '1px solid rgba(255,255,255,0.4)',
            ['--r' as string]: '0deg',
            animation: 'sl-float 7s ease-in-out 0.5s infinite',
          }}
        />
      </div>
      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 36 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(60px, 10vw, 160px)',
            lineHeight: 0.84,
            maxWidth: 1150,
          }}
        >
          Someone already cracked your niche. See how.
        </h2>
        <span className="sl-ring" style={{ display: 'inline-block', borderRadius: 23, padding: 3 }}>
          <a
            href="#start"
            className="sl-btn sl-shine"
            style={{
              display: 'block',
              textDecoration: 'none',
              background: '#FFE14A',
              color: '#170E8F',
              fontWeight: 800,
              fontSize: 20,
              padding: '22px 34px',
              borderRadius: 20,
            }}
          >
            Preview followers free
          </a>
        </span>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, fontSize: 14, color: '#C9C4FF' }}>
      <div>© Scoutline. Public data only. Not affiliated with, endorsed or sponsored by TikTok or ByteDance.</div>
      <div style={{ display: 'flex', gap: 20 }}>
        <a href="#top" style={{ color: '#C9C4FF' }}>Privacy</a>
        <a href="#top" style={{ color: '#C9C4FF' }}>Terms</a>
        <a href="#top" style={{ color: '#C9C4FF' }}>Contact</a>
      </div>
    </footer>
  );
}
