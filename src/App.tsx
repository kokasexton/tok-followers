import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { TikTokPage } from '@/components/TikTokPage';
import { Dashboard } from '@/components/Dashboard';
import { AuthModal } from '@/components/AuthModal';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

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
