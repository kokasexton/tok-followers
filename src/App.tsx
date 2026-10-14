import { useState, useCallback, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { TikTokPage } from '@/components/TikTokPage';
import { Dashboard } from '@/components/Dashboard';
import { AuthModal } from '@/components/AuthModal';

function AppContent() {
  const { user, loading, refreshProfile } = useAuth();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Returning from Stripe Checkout: refresh credits and jump to the dashboard.
  useEffect(() => {
    if (loading || !user) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') !== 'success') return;
    refreshProfile();
    setView('dashboard');
    const clean = new URL(window.location.href);
    clean.searchParams.delete('checkout');
    window.history.replaceState({}, '', clean.toString());
  }, [loading, user, refreshProfile]);

  const openAuth = useCallback((mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const goToDashboard = useCallback(() => {
    setAuthOpen(false);
    setView('dashboard');
  }, []);

  const goToLanding = useCallback(() => setView('landing'), []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#2B1CF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DCD8FF', fontFamily: "'Instrument Sans', system-ui, sans-serif", fontSize: 18 }}>
        Loading…
      </div>
    );
  }

  if (view === 'dashboard' && user) {
    return <Dashboard onSignOut={() => setView('landing')} onBackToLanding={goToLanding} />;
  }

  return (
    <>
      <TikTokPage onAuthOpen={openAuth} isLoggedIn={!!user} onGoToDashboard={goToDashboard} />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onSuccess={goToDashboard}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
