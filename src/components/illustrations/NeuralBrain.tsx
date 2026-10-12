// Original illustration: an abstract "AI brain" made of a glowing neural
// network inside orbit rings, using the brand violet → pink → blue gradient.

const CORE = { x: 260, y: 255 } as const;

const NODES = [
  { x: 260, y: 140 }, // 0  top
  { x: 205, y: 155 },
  { x: 160, y: 195 },
  { x: 140, y: 250 },
  { x: 155, y: 305 },
  { x: 195, y: 345 }, // 5
  { x: 245, y: 362 },
  { x: 315, y: 155 },
  { x: 360, y: 195 },
  { x: 380, y: 250 },
  { x: 365, y: 305 }, // 10
  { x: 325, y: 345 },
  { x: 275, y: 362 },
  { x: 210, y: 220 }, // 13 inner
  { x: 200, y: 288 },
  { x: 310, y: 220 }, // 15
  { x: 320, y: 288 },
  { x: 260, y: 312 },
  { x: 260, y: 196 },
] as const;

const EDGES: ReadonlyArray<readonly [number, number]> = [
  // outer shell
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 12],
  [12, 11], [11, 10], [10, 9], [9, 8], [8, 7], [7, 0],
  // left lobe
  [1, 13], [2, 13], [3, 13], [13, 14], [3, 14], [4, 14], [5, 14], [14, 17], [6, 17],
  // right lobe
  [12, 17], [17, 16], [11, 16], [10, 16], [16, 15], [9, 15], [8, 15], [15, 18], [7, 18],
  [0, 18], [18, 13],
];

const CORE_LINKS = [13, 14, 15, 16, 17, 18];

// Larger, brighter nodes for visual rhythm.
const HIGHLIGHT_NODES = new Set([0, 3, 9, 6, 12, 13, 16]);

export function NeuralBrain({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label="Abstract glowing AI brain made of a neural network"
    >
      <defs>
        <linearGradient id="nb-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="nb-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c026d3" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#6d28d9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nb-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f0abfc" />
          <stop offset="70%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter id="nb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft aura */}
      <circle cx="260" cy="260" r="250" fill="url(#nb-aura)" className="motion-safe:animate-pulse-glow" />

      {/* orbit rings (slowly rotating) */}
      <g
        className="motion-safe:animate-spin-slow"
        style={{ transformOrigin: "260px 260px" }}
        fill="none"
        stroke="url(#nb-stroke)"
      >
        <ellipse cx="260" cy="260" rx="225" ry="90" strokeOpacity="0.35" strokeWidth="1.5" transform="rotate(-25 260 260)" />
        <ellipse cx="260" cy="260" rx="225" ry="90" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 10" transform="rotate(35 260 260)" />
        <circle cx="260" cy="260" r="200" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="56" cy="166" r="5" fill="#f472b6" stroke="none" filter="url(#nb-glow)" />
        <circle cx="470" cy="340" r="4" fill="#38bdf8" stroke="none" filter="url(#nb-glow)" />
        <circle cx="400" cy="80" r="3.5" fill="#a78bfa" stroke="none" filter="url(#nb-glow)" />
      </g>

      {/* neural network */}
      <g stroke="url(#nb-stroke)" strokeLinecap="round" filter="url(#nb-glow)">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            strokeWidth="1.6"
            strokeOpacity="0.75"
          />
        ))}
        {CORE_LINKS.map((n) => (
          <line
            key={`core-${n}`}
            x1={CORE.x}
            y1={CORE.y}
            x2={NODES[n].x}
            y2={NODES[n].y}
            strokeWidth="2"
            strokeOpacity="0.9"
          />
        ))}
      </g>

      <g filter="url(#nb-glow)">
        {NODES.map((node, i) => {
          const big = HIGHLIGHT_NODES.has(i);
          return (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={big ? 7 : 4.5}
              fill={big ? "#ffffff" : "#e9d5ff"}
              stroke="url(#nb-stroke)"
              strokeWidth={big ? 3 : 2}
            />
          );
        })}
      </g>

      {/* glowing core with a sparkle */}
      <circle cx={CORE.x} cy={CORE.y} r="46" fill="url(#nb-core)" className="motion-safe:animate-pulse-glow" />
      <path
        d="M260 225 C263 245 270 252 290 255 C270 258 263 265 260 285 C257 265 250 258 230 255 C250 252 257 245 260 225 Z"
        fill="#ffffff"
        filter="url(#nb-glow)"
      />

      {/* small floating sparkles */}
      <g fill="#ffffff" filter="url(#nb-glow)">
        <path d="M110 110 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3Z" opacity="0.8" />
        <path d="M425 430 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5Z" opacity="0.7" />
        <path d="M440 150 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" opacity="0.6" />
      </g>
    </svg>
  );
}
