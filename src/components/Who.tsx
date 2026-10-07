export function Who() {
  const rows = [
    { title: 'TikTok Shop sellers', body: "Pull a competitor's shop account. The creators following it are your affiliate shortlist, and they already know the category." },
    { title: 'Creators', body: 'Pull the account one size bigger than you in your niche. Steal their hook formats and posting rhythm, and vet collab partners before you DM.' },
    { title: 'Brands and agencies', body: 'Walk into the content meeting with a competitor teardown: their audience, their top 10 videos and why they worked.' },
  ];
  return (
    <section style={{ background: '#FFFFFF', color: '#170E8F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(48px, 6.4vw, 96px)',
            lineHeight: 0.86,
            maxWidth: 900,
          }}
        >
          Who pulls what, and what they do next.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 40px',
                padding: '30px 0',
                borderTop: i === 0 ? '2px solid #170E8F' : 'none',
                borderBottom: '2px solid #170E8F',
              }}
            >
              <h3 style={{ flex: '0 0 300px', margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 38, lineHeight: 0.95 }}>{r.title}</h3>
              <p style={{ flex: '1 1 420px', margin: 0, fontSize: 19, lineHeight: 1.5, color: '#4A4490' }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
