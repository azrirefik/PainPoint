import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ZoneId } from "@/lib/painpoint-data";
import { t, type Lang } from "@/lib/i18n";

type Props = {
  onZoneTap: (zone: ZoneId) => void;
  activity?: Partial<Record<ZoneId, "red" | "yellow">>;
  lang?: Lang;
};

type ZoneDef = {
  id: ZoneId;
  d: string; // outline of the clickable region (matches body curves)
  labelXY: [number, number];
  dotXY?: [number, number];
};

/* viewBox: 0 0 220 360
 * Anatomical-ish silhouette, drawn once below; zones below trace its actual curves.
 * Asymmetry note: anatomical "Left Knee" = patient's left = viewer's right.
 * For pitch clarity we keep visual labels aligned with viewer perspective.
 */

const FRONT: ZoneDef[] = [
  // Head (oval matching the head ellipse)
  {
    id: "head",
    d: "M110,12 C133,12 148,30 148,52 C148,74 133,90 110,90 C87,90 72,74 72,52 C72,30 87,12 110,12 Z",
    labelXY: [110, 56],
  },
  // Neck (between head and shoulders)
  { id: "neck", d: "M96,90 H124 V108 H96 Z", labelXY: [110, 100] },
  // Chest (upper torso, follows shoulder curves)
  {
    id: "chest",
    d: "M68,108 C68,108 88,104 110,104 C132,104 152,108 152,108 L156,150 L64,150 Z",
    labelXY: [110, 130],
    dotXY: [144, 122],
  },
  // Stomach
  {
    id: "stomach",
    d: "M68,150 H152 L150,200 H70 Z",
    labelXY: [110, 178],
  },
  // Left arm — viewer's left (patient's right anatomically; we keep viewer-friendly labels)
  {
    id: "left-arm",
    d: "M40,114 C36,118 34,138 36,170 L52,178 L60,148 L62,118 Z",
    labelXY: [48, 148],
  },
  // Right arm
  {
    id: "right-arm",
    d: "M180,114 C184,118 186,138 184,170 L168,178 L160,148 L158,118 Z",
    labelXY: [172, 148],
  },
  // Hands (both wrists/hands)
  {
    id: "hands",
    d: "M30,170 C28,180 30,194 40,200 L56,196 L52,178 Z M190,170 C192,180 190,194 180,200 L164,196 L168,178 Z",
    labelXY: [110, 196],
  },
  // Left leg (knee region) — viewer left
  {
    id: "left-leg",
    d: "M70,200 L106,200 L108,266 L82,272 Z",
    labelXY: [90, 234],
    dotXY: [102, 224],
  },
  // Right leg (knee region) — viewer right
  {
    id: "right-leg",
    d: "M114,200 L150,200 L138,272 L112,266 Z",
    labelXY: [130, 234],
  },
  // Feet
  {
    id: "feet",
    d: "M76,272 L110,266 L110,326 C110,332 100,338 88,338 C76,338 70,330 72,322 Z M110,266 L144,272 L148,322 C150,330 144,338 132,338 C120,338 110,332 110,326 Z",
    labelXY: [110, 310],
  },
];

const BACK: ZoneDef[] = [
  { id: "head", d: FRONT[0].d, labelXY: FRONT[0].labelXY },
  { id: "neck", d: FRONT[1].d, labelXY: FRONT[1].labelXY },
  // Upper back
  {
    id: "upper-back",
    d: "M68,108 C68,108 88,104 110,104 C132,104 152,108 152,108 L156,150 L64,150 Z",
    labelXY: [110, 130],
  },
  // Lower back
  {
    id: "lower-back",
    d: "M68,150 H152 L150,200 H70 Z",
    labelXY: [110, 178],
  },
  { id: "left-arm", d: FRONT[4].d, labelXY: FRONT[4].labelXY },
  { id: "right-arm", d: FRONT[5].d, labelXY: FRONT[5].labelXY },
  { id: "hands", d: FRONT[6].d, labelXY: FRONT[6].labelXY },
  { id: "left-leg", d: FRONT[7].d, labelXY: FRONT[7].labelXY },
  { id: "right-leg", d: FRONT[8].d, labelXY: FRONT[8].labelXY },
  { id: "feet", d: FRONT[9].d, labelXY: FRONT[9].labelXY },
];

// Single anatomical silhouette path (outline only, no internal seams).
const SILHOUETTE_BODY = `
  M62,114
  C 60,118 58,140 60,170
  C 62,196 70,210 80,210
  L 80,256
  C 80,278 84,304 86,322
  C 88,338 100,348 110,348
  C 120,348 132,338 134,322
  C 136,304 140,278 140,256
  L 140,210
  C 150,210 158,196 160,170
  C 162,140 160,118 158,114
  C 160,108 162,102 152,98
  C 142,94 130,92 122,92
  L 122,86
  C 132,82 138,72 138,58
  C 138,38 126,22 110,22
  C 94,22 82,38 82,58
  C 82,72 88,82 98,86
  L 98,92
  C 90,92 78,94 68,98
  C 58,102 60,108 62,114 Z
`;

export function BodySvg({ onZoneTap, activity = {}, lang = "en" }: Props) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [hovered, setHovered] = useState<ZoneId | null>(null);
  const zones = side === "front" ? FRONT : BACK;
  const tr = t(lang);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {(["front", "back"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
              side === s
                ? "border-pp-teal bg-pp-teal text-white"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {s === "front" ? tr.front : tr.back}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 220 360" className="h-[360px] w-auto select-none" aria-label="Body map">
        <defs>
          <linearGradient id="pp-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.97 0.02 70)" />
            <stop offset="100%" stopColor="oklch(0.93 0.04 70)" />
          </linearGradient>
          <linearGradient id="pp-skin-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.27 0.03 260 / 0)" />
            <stop offset="50%" stopColor="oklch(0.27 0.03 260 / 0.05)" />
            <stop offset="100%" stopColor="oklch(0.27 0.03 260 / 0.12)" />
          </linearGradient>
          <radialGradient id="pp-zone-glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--pp-teal)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--pp-teal)" stopOpacity="0" />
          </radialGradient>
          <filter id="pp-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* shadow under feet */}
        <ellipse cx="110" cy="350" rx="56" ry="6" fill="oklch(0.27 0.03 260 / 0.15)" />

        {/* silhouette base + subtle right-side shading */}
        <g>
          <path
            d={SILHOUETTE_BODY}
            fill="url(#pp-skin)"
            stroke="oklch(0.85 0.02 60)"
            strokeWidth="1.25"
          />
          <path d={SILHOUETTE_BODY} fill="url(#pp-skin-shade)" />
          {/* tiny anatomical hints — collarbone & navel — front only */}
          {side === "front" && (
            <g
              fill="none"
              stroke="oklch(0.27 0.03 260 / 0.18)"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <path d="M88,116 Q110,112 132,116" />
              <circle cx="110" cy="178" r="1.4" fill="oklch(0.27 0.03 260 / 0.25)" stroke="none" />
            </g>
          )}
          {/* spine hint — back only */}
          {side === "back" && (
            <line
              x1="110"
              y1="112"
              x2="110"
              y2="198"
              stroke="oklch(0.27 0.03 260 / 0.15)"
              strokeWidth="1.25"
              strokeDasharray="2 3"
            />
          )}
        </g>

        {/* clickable zones — sit flush over body curves */}
        {zones.map((z) => {
          const isHover = hovered === z.id;
          const dot = activity[z.id];
          const dotPos = z.dotXY ?? [z.labelXY[0] + 22, z.labelXY[1] - 14];
          return (
            <g key={`${side}-${z.id}`}>
              <path
                d={z.d}
                fill={isHover ? "url(#pp-zone-glow)" : "var(--pp-teal)"}
                className={cn(
                  "cursor-pointer transition-opacity",
                  isHover ? "opacity-90 animate-zone-pulse" : "opacity-0 hover:opacity-25",
                )}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onZoneTap(z.id)}
              />
              {dot && (
                <g>
                  <circle
                    cx={dotPos[0]}
                    cy={dotPos[1]}
                    r="6"
                    fill={dot === "red" ? "var(--pp-alert)" : "var(--pp-warning)"}
                    opacity="0.35"
                    filter="url(#pp-soft-shadow)"
                  />
                  <circle
                    cx={dotPos[0]}
                    cy={dotPos[1]}
                    r="3.5"
                    fill={dot === "red" ? "var(--pp-alert)" : "var(--pp-warning)"}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </g>
              )}
              {isHover && (
                <text
                  x={z.labelXY[0]}
                  y={z.labelXY[1]}
                  textAnchor="middle"
                  className="pointer-events-none fill-pp-ink text-[11px] font-bold"
                  style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}
                >
                  {tr.zone[z.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
