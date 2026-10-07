import { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { LogoMark } from './icons';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({ open, onClose, initialMode = 'signin', onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setError(null);
      setBusy(true);

      const result = mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password);

      setBusy(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      setEmail('');
      setPassword('');
      onClose();
      onSuccess?.();
    },
    [mode, email, password, busy, signIn, signUp, onClose, onSuccess]
  );

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError(null);
  }, []);

  if (!open) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10,5,40,0.78)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    padding: 24,
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 440,
    background: '#FFFFFF',
    borderRadius: 28,
    padding: '40px 36px',
    color: '#170E8F',
    boxShadow: '0 40px 80px -20px rgba(8,4,60,0.9)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid #E2E0F7',
    borderRadius: 14,
    padding: '15px 16px',
    fontSize: 16,
    fontFamily: 'inherit',
    fontWeight: 600,
    color: '#170E8F',
    background: '#F8F7FE',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <LogoMark />
          <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 24 }}>
            Scoutline
          </span>
        </div>

        <h2 style={{ margin: '0 0 6px', fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 38, lineHeight: 0.9 }}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: 15, color: '#5D57A0' }}>
          {mode === 'signin' ? 'Sign in to view your scans and download files.' : 'Start pulling TikTok accounts in minutes.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <div style={{ fontSize: 14, fontWeight: 600, color: '#E0315B', background: '#FFF0F3', borderRadius: 10, padding: '10px 14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="sl-btn"
            style={{
              cursor: busy ? 'wait' : 'pointer',
              border: 0,
              background: '#2B1CF5',
              color: '#FFFFFF',
              fontFamily: 'inherit',
              fontSize: 17,
              fontWeight: 800,
              padding: '16px',
              borderRadius: 14,
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          style={{
            marginTop: 20,
            width: '100%',
            border: 0,
            background: 'transparent',
            fontFamily: 'inherit',
            fontSize: 15,
            fontWeight: 600,
            color: '#2B1CF5',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
