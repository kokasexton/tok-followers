import { PlayIcon, MusicIcon, HeartIcon } from './icons';

export function AmbientLayer() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1500,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -120,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: '#FF4FB8',
          filter: 'blur(110px)',
          opacity: 0.55,
          animation: 'sl-drift1 19s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 520,
          right: 220,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: '#5EE7FF',
          filter: 'blur(110px)',
          opacity: 0.4,
          animation: 'sl-drift2 23s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 160,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: '#8B5CFF',
          filter: 'blur(100px)',
          opacity: 0.7,
          animation: 'sl-drift2 27s ease-in-out infinite reverse',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 900,
          left: '30%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: '#FFE14A',
          filter: 'blur(110px)',
          opacity: 0.3,
          animation: 'sl-drift1 21s ease-in-out infinite reverse',
        }}
      />
      <svg width="30" height="30" viewBox="0 0 24 24" style={{ position: 'absolute', left: '4%', top: 1300, animation: 'sl-up 11s linear infinite' }}>
        <PlayIcon size={30} fill="#FFE14A" />
      </svg>
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ position: 'absolute', left: '20%', top: 1320, animation: 'sl-up 13s linear 3s infinite' }}>
        <MusicIcon size={22} stroke="#FF7AC6" />
      </svg>
      <svg width="38" height="38" viewBox="0 0 24 24" style={{ position: 'absolute', left: '40%', top: 1340, animation: 'sl-up 12s linear 6s infinite' }}>
        <PlayIcon size={38} fill="#5EE7FF" />
      </svg>
      <svg width="26" height="26" viewBox="0 0 24 24" style={{ position: 'absolute', left: '58%', top: 1300, animation: 'sl-up 10s linear 1.5s infinite' }}>
        <HeartIcon size={26} fill="#FF7AC6" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: 'absolute', left: '92%', top: 1330, animation: 'sl-up 14s linear 4.5s infinite' }}>
        <PlayIcon size={20} fill="#FFFFFF" />
      </svg>
    </div>
  );
}
