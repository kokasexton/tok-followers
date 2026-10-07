export function FAQ() {
  const items = [
    { q: 'Will the account know?', a: 'No. You never connect a TikTok account and nobody is notified.' },
    { q: 'What about private accounts?', a: 'We only collect publicly visible data. Private accounts can\u2019t be pulled, and TikTok sometimes hides part of a very large follower list. Either way, you only spend credits on rows we actually deliver.' },
    { q: 'How fast is the full file?', a: 'The preview takes seconds. The full file runs in the background, and we email you the moment it\u2019s ready. Bigger accounts take longer.' },
    { q: 'Can I re-run an account next month?', a: 'Yes. Re-pull any account and we\u2019ll mark who\u2019s new since last time.' },
  ];
  return (
    <section id="faq" style={{ background: '#170E8F' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(44px, 5vw, 72px)',
            lineHeight: 0.9,
          }}
        >
          Quick answers
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '2px solid #3A31B8' }}>
          {items.map((item, i) => (
            <details key={i} style={{ borderBottom: '2px solid #3A31B8', padding: '24px 0' }}>
              <summary style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 20, fontWeight: 700 }}>
                {item.q}
                <span className="faq-plus" style={{ fontSize: 30, lineHeight: 0.8, color: '#FFE14A', transition: 'transform 0.2s' }}>+</span>
              </summary>
              <p style={{ margin: '14px 0 0', fontSize: 18, lineHeight: 1.55, color: '#DCD8FF' }}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
