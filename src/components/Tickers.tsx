import { SparkleIcon } from './icons';
import { TICKER, TICKER2 } from '@/data/tiktokData';

export function Tickers() {
  return (
    <section aria-label="Sample report highlights" style={{ position: 'relative', zIndex: 1, height: 190, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: -60,
          right: -60,
          transform: 'rotate(-3deg)',
          background: '#FFE14A',
          color: '#170E8F',
          padding: '14px 0',
          boxShadow: '0 20px 40px -20px rgba(8,4,60,0.8)',
        }}
      >
        <div className="sl-marquee">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 26,
                paddingRight: 26,
                whiteSpace: 'nowrap',
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 900,
                fontSize: 40,
                lineHeight: 1,
              }}
            >
              {t}
              <SparkleIcon size={24} fill="#2B1CF5" />
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: -60,
          right: -60,
          transform: 'rotate(2.5deg)',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.35)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          color: '#FFFFFF',
          padding: '12px 0',
        }}
      >
        <div className="sl-marquee-r">
          {[...TICKER2, ...TICKER2].map((t, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 22,
                paddingRight: 22,
                whiteSpace: 'nowrap',
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 800,
                fontSize: 30,
                lineHeight: 1,
              }}
            >
              {t}
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4l13 8-13 8z" fill="#FF7AC6" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
