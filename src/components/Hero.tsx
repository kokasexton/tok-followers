import { Phone, FloatingChips } from './Phone';
import { FollowerRow } from '@/data/tiktokData';

interface HeroProps {
  handle: string;
  shown: string;
  initials: string;
  statusLine: string;
  pillBg: string;
  isIdle: boolean;
  isLoading: boolean;
  isDone: boolean;
  rows: FollowerRow[];
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  pull: () => void;
}

export function Hero(props: HeroProps) {
  const { handle, shown, initials, statusLine, pillBg, isIdle, isLoading, isDone, rows, onInput, onKey, pull } = props;
  return (
    <section
      id="start"
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '40px 24px 96px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 48,
        alignItems: 'center',
      }}
    >
      {/* Left column */}
      <div style={{ flex: '1 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(64px, 10vw, 152px)',
            lineHeight: 0.84,
            letterSpacing: '-0.01em',
          }}
        >
          Steal your competitor's TikTok playbook before they post again.
        </h1>
        <p style={{ margin: 0, fontSize: 21, lineHeight: 1.5, color: '#DCD8FF', maxWidth: 560 }}>
          Pull any public account's full follower list and last 30 days of videos into a spreadsheet. See who follows them, which hooks go viral, and when to post — so you stop guessing and start copying what works.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 580 }}>
          <label htmlFor="tt-handle" style={{ fontSize: 15, fontWeight: 700 }}>
            Whose account should we pull?
          </label>
          <div className="sl-ring" style={{ borderRadius: 25, padding: 3 }}>
            <div
              className="sl-field"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                background: 'rgba(23,14,143,0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 22,
                padding: 8,
              }}
            >
              <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: 4, padding: '0 12px' }}>
                <span style={{ fontSize: 19, fontWeight: 700, color: '#8F88C9' }}>@</span>
                <input
                  id="tt-handle"
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="competitor"
                  value={handle}
                  onChange={onInput}
                  onKeyDown={onKey}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 0,
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 19,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    height: 56,
                  }}
                />
              </div>
              <button
                type="button"
                className="sl-btn sl-shine"
                onClick={pull}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  background: '#FFE14A',
                  color: '#170E8F',
                  fontFamily: 'inherit',
                  fontSize: 18,
                  fontWeight: 800,
                  padding: '0 26px',
                  minHeight: 58,
                  borderRadius: 16,
                }}
              >
                Preview followers free
              </button>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#DCD8FF' }}>
            First 25 rows free, before you pay. No TikTok login. They're never notified.
          </p>
          <a
            href="#pricing"
            style={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              padding: '10px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <strong style={{ color: '#FFE14A' }}>$10 per 1,000 followers</strong>
            Credit packs from $25
          </a>
        </div>
      </div>

      {/* Phone column */}
      <div style={{ flex: '1 1 400px', minWidth: 0, display: 'flex', justifyContent: 'center', position: 'relative', padding: '24px 0' }}>
        <FloatingChips />
        <Phone
          shown={shown}
          initials={initials}
          statusLine={statusLine}
          pillBg={pillBg}
          isIdle={isIdle}
          isLoading={isLoading}
          isDone={isDone}
          rows={rows}
        />
      </div>
    </section>
  );
}
