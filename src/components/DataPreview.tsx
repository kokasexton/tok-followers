import { FOLLOWER_FIELDS, VIDEO_FIELDS, FollowerField } from '@/data/tiktokData';

const FIELD_COLORS: Record<string, string> = {
  username: '#2B1CF5',
  nickName: '#FF7AC6',
  profileUrl: '#5EE7FF',
  fans: '#FFE14A',
  video: '#7CF5D0',
  verified: '#FFB38A',
  avatar: '#C4BCFF',
  id: '#8B5CFF',
  text: '#2B1CF5',
  playCount: '#FFE14A',
  diggCount: '#FF7AC6',
  commentCount: '#5EE7FF',
  shareCount: '#7CF5D0',
  collectCount: '#FFB38A',
  musicMeta: '#C4BCFF',
  'videoMeta.duration': '#8B5CFF',
  createTimeISO: '#2B1CF5',
  hashtags: '#FF7AC6',
};

function FieldRow({ field, isLast }: { field: FollowerField; isLast: boolean }) {
  const tagColor = FIELD_COLORS[field.field] || '#2B1CF5';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 24px',
        borderBottom: isLast ? 'none' : '1px solid #F3F2FD',
        fontSize: 15,
      }}
    >
      <span
        style={{
          flex: '0 0 8px',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: tagColor,
          boxShadow: `0 0 10px ${tagColor}`,
        }}
      />
      <div style={{ flex: '0 0 160px', minWidth: 0 }}>
        <span style={{ fontFamily: "'Instrument Sans', monospace", fontSize: 12, fontWeight: 600, color: '#8F88C9' }}>
          {field.field}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0, fontWeight: 700, color: '#170E8F' }}>{field.label}</div>
      <div
        style={{
          flex: '0 0 auto',
          maxWidth: 220,
          fontSize: 13,
          color: '#5D57A0',
          fontFamily: "'Instrument Sans', monospace",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {field.sample}
      </div>
    </div>
  );
}

export function DataPreview() {
  return (
    <section id="whats-included" style={{ background: '#170E8F' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <h2
            className="sl-reveal"
            style={{
              margin: 0,
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(48px, 6.4vw, 96px)',
              lineHeight: 0.86,
              maxWidth: 800,
            }}
          >
            Every field you get, down to the column.
          </h2>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: '#DCD8FF', maxWidth: 420 }}>
            No surprises. Here's exactly what's in each file — the raw column name, what it means, and a sample value.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {/* Followers file */}
          <div
            className="sl-lift"
            style={{
              flex: '1 1 480px',
              minWidth: 0,
              background: '#FFFFFF',
              color: '#170E8F',
              borderRadius: 26,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '22px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                flexWrap: 'wrap',
                borderBottom: '2px solid #F3F2FD',
              }}
            >
              <h3 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 34 }}>
                Followers file
              </h3>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: '#F3F2FD',
                  color: '#2B1CF5',
                }}
              >
                {FOLLOWER_FIELDS.length} columns
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 480 }}>
                {FOLLOWER_FIELDS.map((f, i) => (
                  <FieldRow key={f.field} field={f} isLast={i === FOLLOWER_FIELDS.length - 1} />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: '16px 24px',
                fontSize: 14,
                color: '#5D57A0',
                background: '#F3F2FD',
                borderTop: '1px solid #ECEAFB',
              }}
            >
              Delivered as CSV. One row per follower. Ready for Google Sheets or Excel.
            </div>
          </div>

          {/* Videos file */}
          <div
            className="sl-lift"
            style={{
              flex: '1 1 480px',
              minWidth: 0,
              background: '#FFE14A',
              color: '#170E8F',
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 0 80px -30px rgba(255,225,74,0.7)',
            }}
          >
            <div
              style={{
                padding: '22px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 12,
                flexWrap: 'wrap',
                borderBottom: '2px solid #F0D02A',
              }}
            >
              <h3 style={{ margin: 0, fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, fontSize: 34 }}>
                Videos file
              </h3>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: '#F5D52E',
                  color: '#170E8F',
                }}
              >
                {VIDEO_FIELDS.length} columns
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 480 }}>
                {VIDEO_FIELDS.map((f, i) => (
                  <FieldRow key={f.field} field={f} isLast={i === VIDEO_FIELDS.length - 1} />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: '16px 24px',
                fontSize: 14,
                color: '#4A4490',
                background: '#F5D52E',
                borderTop: '1px solid #F0D02A',
              }}
            >
              Delivered as CSV. One row per video from the last 30 days. Sorted by views.
            </div>
          </div>
        </div>

        {/* Bottom callout */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 40px',
            padding: '24px 30px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.18)',
            alignItems: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFE14A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: '0 0 24px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: '#DCD8FF', flex: '1 1 400px', minWidth: 0 }}>
            Both files come with every pull. The followers file is included with every credit pack; the 30-day videos file is an add-on.
          </p>
          <a
            href="#pricing"
            className="sl-btn"
            style={{
              textDecoration: 'none',
              background: '#FFE14A',
              color: '#170E8F',
              fontWeight: 800,
              fontSize: 16,
              padding: '12px 22px',
              borderRadius: 999,
              flex: '0 0 auto',
            }}
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  );
}
