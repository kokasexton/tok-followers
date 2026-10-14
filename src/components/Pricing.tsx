import { useState } from 'react';
import { CheckIcon, ShieldIcon } from './icons';
import { PACKS } from '@/data/tiktokData';
import { useAuth } from '@/lib/auth-context';
import { createCheckout } from '@/lib/api';

interface PricingProps {
  pack: number;
  packCredits: string;
  packPrice: string;
  packFits: string;
  pickPack: (i: number) => void;
  onRequireAuth: () => void;
}

export function Pricing({ pack, packCredits, packPrice, packFits, pickPack, onRequireAuth }: PricingProps) {
  const { user } = useAuth();
  const [buying, setBuying] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const buy = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    const priceId = PACKS[pack]?.stripePriceId;
    if (!priceId) {
      setErr('Checkout is not configured yet.');
      return;
    }
    setBuying(true);
    setErr(null);
    try {
      const { url } = await createCheckout(priceId);
      window.location.href = url;
    } catch (e) {
      setErr((e as Error).message);
      setBuying(false);
    }
  };
  return (
    <section id="pricing" style={{ maxWidth: 1180, margin: '0 auto', padding: '112px 24px', display: 'flex', flexWrap: 'wrap', gap: 56, alignItems: 'center' }}>
      <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(48px, 6vw, 88px)',
            lineHeight: 0.86,
          }}
        >
          Buy credits. Pull on demand.
        </h2>
        <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: '#DCD8FF' }}>
          One credit pulls one follower or video. $10 buys 1,000. Spend them on any account, any time, and top up when you run low.
        </p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 20, borderRadius: 18, background: '#170E8F' }}>
          <ShieldIcon size={28} stroke="#FFE14A" />
          <div style={{ fontSize: 16, lineHeight: 1.5, color: '#FFFFFF' }}>
            <strong>Only pay for rows you get.</strong> Credits come off as rows are delivered. Private accounts, or followers TikTok hides, never use a credit.
          </div>
        </div>
      </div>

      <div
        style={{
          flex: '1 1 440px',
          minWidth: 0,
          background: '#FFFFFF',
          color: '#170E8F',
          borderRadius: 30,
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxShadow: '16px 16px 0 #FFE14A',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Refill your credits</h3>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#5D57A0' }}>$10 per 1,000 credits</span>
        </div>
        <div role="group" aria-label="Credit refill" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          {PACKS.map((k, i) => {
            const on = pack === i;
            return (
              <button
                key={i}
                type="button"
                className="sl-btn"
                aria-pressed={on}
                onClick={() => pickPack(i)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  color: '#170E8F',
                  padding: '16px 18px',
                  borderRadius: 18,
                  border: `2px solid ${on ? '#2B1CF5' : '#E2E0F7'}`,
                  background: on ? '#FFE14A' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 34, lineHeight: 0.9 }}>{k.c}</span>
                <span style={{ fontSize: 13, color: '#5D57A0' }}>credits</span>
                <span style={{ fontWeight: 800, fontSize: 19, marginTop: 8 }}>{k.p}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding: '16px 18px', borderRadius: 16, background: '#F3F2FD', fontSize: 16, lineHeight: 1.5 }}>{packFits}</div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 17 }}>
          <li style={{ display: 'flex', gap: 10 }}>
            <CheckIcon size={20} />
            1 credit = 1 follower or video pulled
          </li>
          <li style={{ display: 'flex', gap: 10 }}>
            <CheckIcon size={20} />
            Bio, follower count, video count and verified flag on every follower
          </li>
          <li style={{ display: 'flex', gap: 10 }}>
            <CheckIcon size={20} />
            Credits never expire. Top up any time.
          </li>
        </ul>
        <button
          type="button"
          onClick={buy}
          disabled={buying}
          className="sl-btn sl-shine"
          style={{
            textDecoration: 'none',
            textAlign: 'center',
            background: '#2B1CF5',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 18,
            padding: 19,
            borderRadius: 18,
            border: 0,
            fontFamily: 'inherit',
            cursor: buying ? 'wait' : 'pointer',
            opacity: buying ? 0.7 : 1,
          }}
        >
          {buying ? 'Opening checkout…' : `Refill ${packCredits} credits for ${packPrice}`}
        </button>
        {err && <p style={{ margin: '-8px 0 0', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#C0274B' }}>{err}</p>}
        <p style={{ margin: '-6px 0 0', textAlign: 'center', fontSize: 14, color: '#5D57A0' }}>
          Pay by card via Stripe. Credits land in your account instantly. Not sure yet? Preview 25 followers of any account free first.
        </p>
      </div>
    </section>
  );
}
