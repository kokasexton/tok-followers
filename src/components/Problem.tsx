export function Problem() {
  const cards = [
    { border: '#2B1CF5', title: 'You only see what went viral', body: 'The flops never reach you, so you copy the one video that worked instead of the system that made it.' },
    { border: '#FF7AC6', title: "You can't see who's watching", body: 'Their follower list is a scroll with no sorting, no bios, no counts. The creators and buyers inside it stay hidden.' },
    { border: '#FFE14A', title: "So you're posting on a hunch", body: 'Wrong hook, wrong length, wrong time, and another week of 300 views while they hit 300,000.' },
  ];
  return (
    <section style={{ background: '#FFFFFF', color: '#170E8F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 56 }}>
        <h2
          className="sl-reveal"
          style={{
            margin: 0,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(48px, 6.4vw, 96px)',
            lineHeight: 0.86,
            maxWidth: 1000,
          }}
        >
          Your For You page shows you their hits. It doesn't show you the pattern.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ borderTop: `6px solid ${c.border}`, paddingTop: 22 }}>
              <h3 style={{ margin: 0, fontSize: 23, fontWeight: 700 }}>{c.title}</h3>
              <p style={{ margin: '10px 0 0', fontSize: 18, lineHeight: 1.55, color: '#4A4490' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
