import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  TODAY_DAY,
  ZONE_LABELS,
  calendarStatusFromFeed,
  classifyReading,
  getDailyReport,
  whenToDay,
  type DayStatus,
  type SymptomEntry,
} from "@/lib/painpoint-data";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const COLORS: Record<DayStatus, string> = {
  good: "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white",
  moderate: "bg-gradient-to-br from-amber-300 to-amber-500 text-white",
  severe: "bg-gradient-to-br from-rose-400 to-rose-600 text-white",
  none: "bg-muted text-muted-foreground",
};

type Props = {
  symptoms?: SymptomEntry[];
  lang?: Lang;
};

export function CalendarHeatmap({ symptoms = [], lang = "en" }: Props) {
  // Derive the per-day status array directly from the live feed so the
  // heatmap and the day-detail dialog can never disagree.
  const statusByDay = useMemo(() => calendarStatusFromFeed(symptoms), [symptoms]);

  // May 1, 2026 = Friday. Mon=0 ... Sun=6 → Friday index = 4
  const firstOffset = 4;
  const cells: ({ day: number; status: DayStatus } | null)[] = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  statusByDay.forEach((status, i) => cells.push({ day: i + 1, status }));

  const tr = t(lang);
  const [openDay, setOpenDay] = useState<number | null>(null);

  // Group symptoms by day-of-month using whenToDay() helper.
  const byDay = symptoms.reduce<Record<number, SymptomEntry[]>>((acc, s) => {
    const d = whenToDay(s.when);
    if (d == null) return acc;
    (acc[d] ||= []).push(s);
    return acc;
  }, {});

  const LEGEND: { dot: string; label: string }[] = [
    {
      dot: "bg-gradient-to-br from-emerald-300 to-emerald-500",
      label: tr.good,
    },
    {
      dot: "bg-gradient-to-br from-amber-300 to-amber-500",
      label: tr.moderate,
    },
    {
      dot: "bg-gradient-to-br from-rose-400 to-rose-600",
      label: tr.needsAttention,
    },
    { dot: "bg-muted", label: tr.noData },
  ];

  const dayEntries = openDay != null ? (byDay[openDay] ?? []) : [];
  const openStatus: DayStatus = openDay != null ? (statusByDay[openDay - 1] ?? "none") : "none";

  return (
    <div className="pp-card rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium tracking-tight">May 2026</h3>
          <p className="text-[11px] text-muted-foreground">Tap a day to see details</p>
        </div>
        <span className="rounded-full bg-pp-teal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-pp-teal-deep">
          Today · {TODAY_DAY}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-muted-foreground">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
        {cells.map((c, i) =>
          c ? (
            <button
              key={i}
              onClick={() => setOpenDay(c.day)}
              className={cn(
                "pp-heat-cell flex aspect-square items-center justify-center rounded-lg text-[11px] font-semibold transition hover:scale-105 active:scale-95",
                COLORS[c.status],
                c.day === TODAY_DAY && "ring-2 ring-pp-teal ring-offset-2 ring-offset-card",
              )}
              aria-label={`May ${c.day}: ${c.status === "none" ? tr.noData : c.status === "good" ? tr.good : c.status === "moderate" ? tr.moderate : tr.needsAttention}`}
            >
              {c.day}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className={cn("inline-block h-2.5 w-2.5 rounded-sm shadow-sm", l.dot)} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Day detail dialog */}
      <Dialog open={openDay != null} onOpenChange={(o) => !o && setOpenDay(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl border border-border/60 bg-gradient-to-b from-white to-[oklch(0.99_0.005_240)] p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white shadow",
                  openStatus === "severe"
                    ? "bg-gradient-to-br from-rose-400 to-rose-600"
                    : openStatus === "moderate"
                      ? "bg-gradient-to-br from-amber-300 to-amber-500"
                      : openStatus === "good"
                        ? "bg-gradient-to-br from-emerald-300 to-emerald-500"
                        : "bg-muted text-muted-foreground",
                )}
              >
                {openDay}
              </span>
              <div className="leading-tight">
                <p className="font-display text-base font-semibold tracking-tight">
                  May {openDay}, 2026
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {tr.dayDetailSubtitle}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {dayEntries.length === 0 ? (
            <p className="rounded-xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
              {tr.noReports}
            </p>
          ) : (
            <div className="space-y-3">
              {/* AI-generated narrative for past days. May 24 (today) has no
                  static report — the live feed below tells the current story. */}
              {openDay != null &&
                openDay !== TODAY_DAY &&
                (() => {
                  const report = getDailyReport(openDay);
                  if (!report) return null;
                  return (
                    <div className="pp-card-glow rounded-2xl p-3.5">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-pp-teal/30 bg-gradient-to-br from-pp-teal/10 to-pp-blue/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-pp-teal-deep">
                          ✨ AI Daily Report
                        </span>
                      </div>
                      <p className="font-display text-base font-semibold leading-snug tracking-tight">
                        {report.headline}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">
                        {report.summary}
                      </p>
                      {report.highlights && report.highlights.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {report.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-pp-teal/8 px-2 py-0.5 text-[11px] font-medium text-pp-teal-deep"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

              {/* Underlying entries that produced the day's status. */}
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {openDay === TODAY_DAY ? "Live entries" : "Underlying data"}
                </p>
                <ul className="space-y-2">
                  {dayEntries.map((e) => (
                    <li
                      key={e.id}
                      className={cn(
                        "rounded-xl border-l-2 px-3 py-2.5",
                        e.kind === "symptom"
                          ? "border-pp-alert bg-pp-alert/5"
                          : e.kind === "reading"
                            ? "border-pp-teal bg-pp-teal/5"
                            : "border-pp-success bg-pp-success/5",
                      )}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {e.when}
                      </p>
                      {e.kind === "symptom" && e.zone ? (
                        <div className="text-sm">
                          <p className="font-semibold">
                            📍 {ZONE_LABELS[e.zone].en} — {cap(e.type)}, {cap(e.severity)}
                          </p>
                          {e.answer && <p className="text-muted-foreground">🗣️ "{e.answer}"</p>}
                        </div>
                      ) : e.kind === "reading" ? (
                        <p className="text-sm">
                          {classifyReading(e.note) === "bp" ? "💓" : "🩸"} {e.note}
                        </p>
                      ) : (
                        <p className="text-sm">💊 {e.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cap(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}
