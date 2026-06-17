import { ZONE_LABELS, type ZoneId } from "@/lib/painpoint-data";
import { t, type Lang } from "@/lib/i18n";

const GRID: ZoneId[] = [
  "head",
  "chest",
  "stomach",
  "left-arm",
  "right-arm",
  "upper-back",
  "left-leg",
  "right-leg",
  "hands",
];

type Props = {
  onZoneTap: (z: ZoneId) => void;
  lang: Lang;
};

export function BodyButtonsGrid({ onZoneTap, lang }: Props) {
  const tr = t(lang);
  return (
    <div className="grid grid-cols-3 gap-3">
      {GRID.map((id) => {
        const z = ZONE_LABELS[id];
        const native = tr.zone[id];
        return (
          <button
            key={id}
            onClick={() => onZoneTap(id)}
            className="pp-soft-button group flex h-28 flex-col items-center justify-center gap-1 rounded-2xl border border-border/70 p-2 transition active:border-pp-teal"
          >
            <span className="text-3xl transition-transform group-hover:scale-110">{z.emoji}</span>
            <span className="text-center text-sm font-semibold leading-tight">
              {native}
              {lang !== "en" && (
                <>
                  <br />
                  <span className="text-xs text-muted-foreground">{z.en}</span>
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
