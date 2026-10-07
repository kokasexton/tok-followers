// Small inline SVG icon set used across the TikTok landing page.
// Kept inline to match the .dc.html source exactly.

export function PlayIcon({ size = 24, fill = '#FFE14A' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" fill={fill} />
    </svg>
  );
}

export function MusicIcon({ size = 22, stroke = '#FF7AC6' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V6l11-2v12" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="7" cy="18" r="2.6" fill={stroke} />
      <circle cx="18" cy="16" r="2.6" fill={stroke} />
    </svg>
  );
}

export function HeartIcon({ size = 26, fill = '#FF7AC6' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2 0 3.6 1.1 4.4 2.6h2C13.8 6.1 15.4 5 17.4 5 21 5 23 8.6 21.6 11.8 19.5 16.4 12 21 12 21z" fill={fill} />
    </svg>
  );
}

export function SparkleIcon({ size = 24, fill = '#2B1CF5' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" fill={fill} />
    </svg>
  );
}

export function CheckIcon({ size = 20, stroke = '#2B1CF5' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function ShieldIcon({ size = 28, stroke = '#FFE14A' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function UploadIcon({ size = 16, stroke = '#170E8F' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v7h16v-7M12 3v12M7 8l5-5 5 5" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="32" height="32" rx="10" fill="#FFE14A" />
      <circle cx="17" cy="17" r="8" stroke="#2B1CF5" strokeWidth="3" />
      <circle cx="23.5" cy="10.5" r="2.5" fill="#FF7AC6" />
    </svg>
  );
}
