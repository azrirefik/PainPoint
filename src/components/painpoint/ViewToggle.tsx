import { cn } from "@/lib/utils";

type View = "elderly" | "caregiver";

type Props = {
  value: View;
  onChange: (v: View) => void;
  onReset?: () => void;
};

const TRACK_CHIPS = [
  { label: "Discover", icon: "🔍" },
  { label: "Book", icon: "📅" },
  { label: "Follow Up", icon: "🔁" },
];

export function ViewToggle({ value, onChange, onReset }: Props) {
  return (
    <div className="sticky top-0 z-40 bg-background/70 px-3 pt-3 pb-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pp-teal to-pp-blue text-base text-white shadow-md">
            ❤️‍🩹
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-semibold tracking-tight text-foreground">
              PainPoint
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Doctor Anywhere · Demo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex gap-1 rounded-full border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur">
            {(["elderly", "caregiver"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onChange(v)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                  value === v
                    ? "bg-gradient-to-br from-pp-teal to-pp-blue text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "elderly" ? "Elderly" : "Caregiver"}
              </button>
            ))}
          </div>
          {onReset && (
            <button
              onClick={onReset}
              title="Reset demo data"
              aria-label="Reset demo data"
              className="grid h-8 w-8 place-items-center rounded-full border border-border/60 bg-card/80 text-xs text-muted-foreground shadow-sm backdrop-blur transition hover:text-foreground"
            >
              ↺
            </button>
          )}
        </div>
      </div>

      {/* Track 1: Discover · Book · Follow Up — visible rubric anchor */}
      <div className="mx-auto mt-2 flex max-w-md items-center justify-center gap-1.5">
        {TRACK_CHIPS.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-pp-teal/25 bg-gradient-to-br from-pp-teal/10 to-pp-blue/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-pp-teal-deep backdrop-blur">
              <span aria-hidden>{c.icon}</span>
              {c.label}
            </span>
            {i < TRACK_CHIPS.length - 1 && (
              <span className="text-[10px] text-muted-foreground" aria-hidden>
                →
              </span>
            )}
          </span>
        ))}
      </div>

      {/* thin teal→blue gradient divider */}
      <div className="pp-divider-glow mx-auto mt-3 h-px w-full max-w-md" />
    </div>
  );
}
