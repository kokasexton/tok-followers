import { LogoMark } from './icons';

interface NavProps {
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  isLoggedIn: boolean;
  onGoToDashboard: () => void;
}

export function Nav({ onAuthOpen, isLoggedIn, onGoToDashboard }: NavProps) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <LogoMark />
        <span
          style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 26,
            letterSpacing: '0.01em',
          }}
        >
          Scoutline
        </span>
      </a>
      <nav
        aria-label="Primary"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px 28px',
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        <a href="#report" style={{ textDecoration: 'none' }}>The report</a>
        <a href="#videos" style={{ textDecoration: 'none' }}>30-day videos</a>
        <a href="#pricing" style={{ textDecoration: 'none' }}>Pricing</a>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="sl-btn"
            style={{
              textDecoration: 'none',
              background: '#FFE14A',
              color: '#170E8F',
              padding: '13px 20px',
              borderRadius: 999,
              fontWeight: 700,
              border: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 16,
            }}
          >
            My scans
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onAuthOpen('signin')}
              style={{
                background: 'none',
                border: 0,
                color: '#FFFFFF',
                fontFamily: 'inherit',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 4px',
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => onAuthOpen('signup')}
              className="sl-btn"
              style={{
                background: '#FFE14A',
                color: '#170E8F',
                padding: '13px 20px',
                borderRadius: 999,
                fontWeight: 700,
                border: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 16,
              }}
            >
              Get started
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
