// Original illustration for the auth pages: a glowing document being
// written by an AI "spark", surrounded by orbiting network nodes.

const ORBIT_NODES = [
  { x: 70, y: 120, c: "#a78bfa" },
  { x: 330, y: 95, c: "#38bdf8" },
  { x: 350, y: 290, c: "#f472b6" },
  { x: 60, y: 300, c: "#38bdf8" },
  { x: 200, y: 30, c: "#f472b6" },
  { x: 200, y: 372, c: "#a78bfa" },
] as const;

export function AiWriter({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Glowing document being written by AI, surrounded by network nodes"
    >
      <defs>
        <linearGradient id="aw-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="aw-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id="aw-orb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
        <filter id="aw-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* orbit network */}
      <g fill="none" stroke="url(#aw-stroke)" strokeOpacity="0.35">
        <circle cx="200" cy="200" r="170" strokeDasharray="3 9" />
        <circle cx="200" cy="200" r="130" strokeOpacity="0.2" />
      </g>
      <g stroke="url(#aw-stroke)" strokeWidth="1.2" strokeOpacity="0.45">
        {ORBIT_NODES.map((n, i) => (
          <line key={i} x1="200" y1="200" x2={n.x} y2={n.y} strokeDasharray="2 6" />
        ))}
      </g>
      <g filter="url(#aw-glow)">
        {ORBIT_NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="6" fill={n.c} />
        ))}
      </g>

      {/* document card */}
      <g className="motion-safe:animate-float" style={{ transformBox: "fill-box" }}>
        <rect
          x="120" y="95" width="160" height="210" rx="15"
          fill="url(#aw-card)" stroke="url(#aw-stroke)" strokeWidth="2" filter="url(#aw-glow)"
        />
        {/* heading line */}
        <rect x="142" y="122" width="90" height="10" rx="5" fill="url(#aw-stroke)" />
        {/* text lines */}
        <g fill="#ffffff" fillOpacity="0.55">
          <rect x="142" y="148" width="116" height="6" rx="3" />
          <rect x="142" y="163" width="104" height="6" rx="3" />
          <rect x="142" y="178" width="112" height="6" rx="3" />
          <rect x="142" y="203" width="70" height="8" rx="4" fillOpacity="0.8" />
          <rect x="142" y="222" width="116" height="6" rx="3" />
          <rect x="142" y="237" width="96" height="6" rx="3" />
          <rect x="142" y="252" width="60" height="6" rx="3" />
        </g>
        {/* typing cursor */}
        <rect x="206" y="250" width="3" height="10" rx="1.5" fill="#f472b6" className="motion-safe:animate-pulse" />
      </g>

      {/* AI spark writing on the page */}
      <circle cx="292" cy="250" r="34" fill="url(#aw-orb)" className="motion-safe:animate-pulse-glow" />
      <path
        d="M292 228 C294 243 299 248 314 250 C299 252 294 257 292 272 C290 257 285 252 270 250 C285 248 290 243 292 228 Z"
        fill="#ffffff"
        filter="url(#aw-glow)"
      />
      <path d="M266 256 Q240 262 212 256" fill="none" stroke="url(#aw-stroke)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />

      {/* sparkles */}
      <g fill="#ffffff" filter="url(#aw-glow)">
        <path d="M98 205 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5Z" opacity="0.8" />
        <path d="M300 60 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" opacity="0.7" />
        <path d="M330 345 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" opacity="0.6" />
      </g>
    </svg>
  );
}
