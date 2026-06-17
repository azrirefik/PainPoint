import { useState } from "react";
import { toast } from "sonner";
import { BodySvg } from "./BodySvg";
import { BodyButtonsGrid } from "./BodyButtonsGrid";
import { SymptomEntrySheet } from "./SymptomEntrySheet";
import { EmergencyScreen } from "./EmergencyScreen";
import { VoiceInputCard } from "./VoiceInputCard";
import { DailyReadingsCard } from "./DailyReadingsCard";
import { CalendarHeatmap } from "../CalendarHeatmap";
import { cn } from "@/lib/utils";
import { LANGS, t, timeOfDayKey, type Lang } from "@/lib/i18n";
import type { ZoneId, SymptomEntry } from "@/lib/painpoint-data";

type Props = {
  onAddSymptom: (entry: Omit<SymptomEntry, "id">) => void;
  symptoms: SymptomEntry[];
};

export function ElderlyDashboard({ onAddSymptom, symptoms }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<"map" | "grid">("map");
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [emergency, setEmergency] = useState(false);

  const tr = t(lang);
  const greeting = tr[timeOfDayKey()];

  return (
    <div
      className="pp-elderly-page min-h-screen pb-24 text-pp-ink"
      lang={lang === "zh" ? "zh" : lang === "bm" ? "ms" : "en"}
    >
      <div className="mx-auto max-w-md space-y-5 px-4 py-6">
        {/* Hero greeting */}
        <div
          className="pp-card relative overflow-hidden rounded-3xl px-5 py-5"
          style={{ animation: "fade-up 360ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-pp-teal/25 to-pp-blue/15 blur-2xl"
          />
          <p className="font-display text-2xl font-medium leading-tight text-muted-foreground">
            {greeting}
          </p>
          <p className="mt-1 flex items-baseline gap-2 text-5xl">
            <span className="font-display-tight bg-gradient-to-br from-pp-teal-deep to-pp-blue bg-clip-text font-semibold tracking-tight text-transparent">
              Ah Kong
            </span>
            <span
              className="inline-block origin-[70%_70%] text-3xl"
              style={{ animation: "wave 2.4s ease-in-out infinite" }}
              aria-hidden
            >
              👋
            </span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {tr.todayLine} · {tr.feelingPrompt}
          </p>
        </div>

        {/* Language selector */}
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={cn(
                "h-14 rounded-2xl text-lg font-bold transition-all duration-200",
                lang === l.id
                  ? "pp-primary-button border-0"
                  : "pp-soft-button border border-border/70 text-foreground",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <p className="-mt-3 text-center text-[11px] font-medium text-muted-foreground">
          {tr.voiceHint}
        </p>

        {/* Body map — centerpiece */}
        <div
          className="pp-card-glow relative overflow-hidden rounded-3xl p-5"
          style={{
            animation: "fade-up 420ms cubic-bezier(0.22,1,0.36,1) both",
            animationDelay: "60ms",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, oklch(0.72 0.11 192 / 0.10), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="font-display mb-1 text-center text-2xl font-medium tracking-tight">
              {tr.whereDoesItHurt}
            </p>
            <p className="mb-4 text-center text-sm text-muted-foreground">{tr.tapAnyArea}</p>

            {mode === "map" ? (
              <BodySvg
                lang={lang}
                onZoneTap={setActiveZone}
                activity={{ chest: "red", "left-leg": "yellow" }}
              />
            ) : (
              <BodyButtonsGrid lang={lang} onZoneTap={setActiveZone} />
            )}

            <button
              onClick={() => setMode(mode === "map" ? "grid" : "map")}
              className="mt-5 w-full text-center text-sm font-semibold text-pp-teal-deep underline underline-offset-4 transition hover:text-pp-blue"
            >
              {mode === "map" ? tr.preferButtons : tr.showBodyMap}
            </button>
          </div>
        </div>

        {/* Voice input — Web Speech API */}
        <VoiceInputCard onAddSymptom={onAddSymptom} onEmergency={() => setEmergency(true)} />

        {/* Calendar heatmap */}
        <div
          style={{
            animation: "fade-up 480ms cubic-bezier(0.22,1,0.36,1) both",
            animationDelay: "120ms",
          }}
        >
          <CalendarHeatmap symptoms={symptoms} lang={lang} />
        </div>

        {/* Daily readings — blood sugar + blood pressure */}
        <DailyReadingsCard symptoms={symptoms} lang={lang} onAddSymptom={onAddSymptom} />

        {/* Medication card — soft amber */}
        <div
          className="pp-amber-card relative overflow-hidden rounded-3xl p-5"
          style={{
            animation: "fade-up 520ms cubic-bezier(0.22,1,0.36,1) both",
            animationDelay: "180ms",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-pp-warning/40 to-transparent blur-2xl"
          />
          <div className="relative">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-2xl shadow-sm backdrop-blur">
                💊
              </span>
              <div>
                <p className="font-display text-2xl font-medium tracking-tight">{tr.medTitle}</p>
                <p className="text-sm text-pp-ink/70">{tr.medSubtitle}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onAddSymptom({
                    when: "Just now",
                    kind: "med",
                    note: "Afternoon medication taken ✅",
                  });
                  toast.success(tr.medToastTitle, { description: tr.medToastDesc });
                }}
                className="pp-success-button font-display h-16 rounded-2xl text-2xl font-semibold tracking-tight"
              >
                {tr.medYes}
              </button>
              <button
                onClick={() => toast(tr.medLaterToast, { description: tr.medLaterDesc })}
                className="pp-soft-button font-display h-16 rounded-2xl border border-border/70 bg-white/80 text-2xl font-semibold tracking-tight"
              >
                {tr.medNot}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SymptomEntrySheet
        zone={activeZone}
        lang={lang}
        onClose={() => setActiveZone(null)}
        onEmergency={() => setEmergency(true)}
        onRecorded={(entry) => {
          onAddSymptom(entry);
          toast.success(tr.symptomRecordedTitle, { description: tr.symptomRecordedDesc });
        }}
      />

      {emergency && <EmergencyScreen lang={lang} onDismiss={() => setEmergency(false)} />}
    </div>
  );
}
