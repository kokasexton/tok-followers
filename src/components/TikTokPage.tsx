import { useState, useRef, useCallback, useMemo } from 'react';
import { AmbientLayer } from './AmbientLayer';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Tickers } from './Tickers';
import { Problem } from './Problem';
import { Report } from './Report';
import { DataPreview } from './DataPreview';
import { Pattern } from './Pattern';
import { Who } from './Who';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { FinalCTA, Footer } from './FinalCTA';
import { PACKS, FOLLOWER_ROWS, VIDEOS, HOOKS } from '@/data/tiktokData';

type Phase = 'idle' | 'loading' | 'done';

interface TikTokPageProps {
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  isLoggedIn: boolean;
  onGoToDashboard: () => void;
}

function cleanHandle(h: string): string {
  const s = (h || '')
    .trim()
    .replace(/^https?:\/\/(www\.)?tiktok\.com\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/^@+/, '');
  return s ? '@' + s : '';
}

export function TikTokPage({ onAuthOpen, isLoggedIn, onGoToDashboard }: TikTokPageProps) {
  const [handle, setHandle] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [pack, setPack] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pull = useCallback(() => {
    if (phase === 'loading') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('loading');
    timerRef.current = setTimeout(() => setPhase('done'), 1700);
  }, [phase]);

  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  }, []);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        pull();
      }
    },
    [pull]
  );

  const shown = phase === 'idle' ? '@glowstudio.skin' : cleanHandle(handle) || '@glowstudio.skin';
  const initials = shown.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || 'GS';
  const statusLine = phase === 'done' ? 'Preview ready: 25 rows free' : phase === 'loading' ? 'Pulling…' : 'Sample report';
  const pillBg = phase === 'done' ? '#7CF5D0' : '#FFE14A';

  const rows = useMemo(
    () =>
      FOLLOWER_ROWS.map((r, k) => ({
        ...r,
        delay: (phase === 'done' ? k * 0.08 : 0) + 's',
      })),
    [phase]
  );

  const packData = PACKS[pack];

  return (
    <div
      id="top"
      style={{
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        color: '#FFFFFF',
        background: '#2B1CF5',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <AmbientLayer />
      <Nav onAuthOpen={onAuthOpen} isLoggedIn={isLoggedIn} onGoToDashboard={onGoToDashboard} />
      <Hero
        handle={handle}
        shown={shown}
        initials={initials}
        statusLine={statusLine}
        pillBg={pillBg}
        isIdle={phase === 'idle'}
        isLoading={phase === 'loading'}
        isDone={phase === 'done'}
        rows={rows}
        onInput={onInput}
        onKey={onKey}
        pull={pull}
      />
      <Tickers />
      <Problem />
      <Report rows={rows} vids={VIDEOS} />
      <DataPreview />
      <Pattern hooks={HOOKS} />
      <Who />
      <Pricing
        pack={pack}
        packCredits={packData.c}
        packPrice={packData.p}
        packFits={packData.fits}
        pickPack={setPack}
        onRequireAuth={() => onAuthOpen('signup')}
      />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
