import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { lastReadings, type SymptomEntry } from "@/lib/painpoint-data";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SUGAR_PRESETS = ["4.0", "5.5", "7.0", "8.5", "10.0", "12.0+"] as const;
const BP_PRESETS = ["120/80", "130/85", "135/88", "140/90", "150/95", "160/100"] as const;

type Props = {
  symptoms: SymptomEntry[];
  lang: Lang;
  onAddSymptom: (entry: Omit<SymptomEntry, "id">) => void;
};

export function DailyReadingsCard({ symptoms, lang, onAddSymptom }: Props) {
  const tr = t(lang);
  const [sugarOpen, setSugarOpen] = useState(false);
  const [bpOpen, setBpOpen] = useState(false);

  const { bp, sugar } = lastReadings(symptoms);

  return (
    <div
      className="pp-readings-card relative overflow-hidden rounded-3xl p-5"
      style={{
        animation: "fade-up 500ms cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: "150ms",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-pp-teal/25 to-pp-blue/15 blur-2xl"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-medium tracking-tight text-pp-ink">
              {tr.dailyReadingsTitle}
            </p>
            <p className="text-sm text-pp-ink/65">{tr.dailyReadingsSubtitle}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/70 text-xl shadow-sm backdrop-blur">
            📊
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setSugarOpen(true)}
            className="pp-soft-button group flex h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border border-pp-teal/25 bg-white/80 p-3 backdrop-blur transition active:border-pp-teal"
            aria-label={tr.bloodSugar}
          >
            <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
              🩸
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              {tr.bloodSugar}
            </span>
          </button>

          <button
            onClick={() => setBpOpen(true)}
            className="pp-soft-button group flex h-24 flex-col items-center justify-center gap-1.5 rounded-2xl border border-pp-teal/25 bg-white/80 p-3 backdrop-blur transition active:border-pp-teal"
            aria-label={tr.bloodPressure}
          >
            <span className="text-3xl transition-transform group-hover:scale-110" aria-hidden>
              💓
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              {tr.bloodPressure}
            </span>
          </button>
        </div>

        {/* Trend line — last readings */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-xl bg-white/55 px-3 py-2 text-xs text-pp-ink/75 backdrop-blur">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>💓</span>
            <span className="font-semibold">{tr.lastBpLabel}:</span>
            <span className="tabular-nums font-display">{bp ?? tr.noReadingYet}</span>
          </span>
          <span aria-hidden className="text-pp-ink/30">
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <span aria-hidden>🩸</span>
            <span className="font-semibold">{tr.lastSugarLabel}:</span>
            <span className="tabular-nums font-display">{sugar ?? tr.noReadingYet}</span>
          </span>
        </div>
      </div>

      <BloodSugarSheet
        open={sugarOpen}
        onOpenChange={setSugarOpen}
        lang={lang}
        onSave={(value, timing) => {
          const note = `Blood sugar: ${value} mmol/L (${timing === "before" ? "Before meal" : "After meal"})`;
          onAddSymptom({ when: "Just now", kind: "reading", note });
          toast.success(tr.sugarToastTitle, { description: note });
        }}
      />

      <BloodPressureSheet
        open={bpOpen}
        onOpenChange={setBpOpen}
        lang={lang}
        onSave={(value) => {
          const note = `Blood pressure: ${value} mmHg`;
          onAddSymptom({ when: "Just now", kind: "reading", note });
          toast.success(tr.bpToastTitle, { description: note });
        }}
      />
    </div>
  );
}

/* ─── Blood sugar bottom sheet ─────────────────────────────────────────── */

type SugarSheetProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lang: Lang;
  onSave: (value: string, timing: "before" | "after") => void;
};

function BloodSugarSheet({ open, onOpenChange, lang, onSave }: SugarSheetProps) {
  const tr = t(lang);
  const [value, setValue] = useState<string | null>(null);
  const [timing, setTiming] = useState<"before" | "after">("before");

  // Reset on each fresh open.
  useEffect(() => {
    if (open) {
      setValue(null);
      setTiming("before");
    }
  }, [open]);

  const handleSave = () => {
    if (!value) return;
    onSave(value, timing);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-pp-teal/30 pb-8"
        style={{
          background: "linear-gradient(180deg, oklch(1 0 0) 0%, oklch(0.985 0.01 80) 100%)",
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2 text-2xl font-medium tracking-tight">
            <span className="text-2xl" aria-hidden>
              🩸
            </span>
            {tr.bloodSugarSheetTitle}
          </SheetTitle>
        </SheetHeader>

        {/* Big value display */}
        <div className="mt-5 flex items-baseline justify-center gap-2 rounded-2xl border border-pp-teal/25 bg-gradient-to-br from-pp-teal/8 to-pp-blue/8 px-4 py-6">
          <span className="font-display tabular-nums text-6xl font-semibold tracking-tight text-pp-teal-deep">
            {value ?? "—"}
          </span>
          <span className="text-base font-medium text-muted-foreground">mmol/L</span>
        </div>

        {/* 2x3 preset grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {SUGAR_PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => setValue(v)}
              className={cn(
                "pp-soft-button font-display tabular-nums h-14 rounded-2xl border-2 text-xl font-semibold tracking-tight transition",
                value === v ? "border-pp-teal bg-pp-teal/10" : "border-border/70",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Before / After meal toggle */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["before", "after"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTiming(opt)}
              className={cn(
                "h-14 rounded-2xl border-2 text-base font-semibold transition",
                timing === opt
                  ? "border-pp-teal bg-pp-teal/10 text-pp-teal-deep"
                  : "pp-soft-button border-border/70 text-foreground",
              )}
            >
              {opt === "before" ? tr.beforeMeal : tr.afterMeal}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!value}
          className="pp-primary-button font-display mt-5 h-14 w-full rounded-2xl text-lg font-semibold tracking-tight disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tr.saveReading}
        </button>
      </SheetContent>
    </Sheet>
  );
}

/* ─── Blood pressure bottom sheet ──────────────────────────────────────── */

type BpSheetProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lang: Lang;
  onSave: (value: string) => void;
};

function BloodPressureSheet({ open, onOpenChange, lang, onSave }: BpSheetProps) {
  const tr = t(lang);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (open) setValue(null);
  }, [open]);

  const handleSave = () => {
    if (!value) return;
    onSave(value);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-pp-teal/30 pb-8"
        style={{
          background: "linear-gradient(180deg, oklch(1 0 0) 0%, oklch(0.985 0.01 80) 100%)",
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2 text-2xl font-medium tracking-tight">
            <span className="text-2xl" aria-hidden>
              💓
            </span>
            {tr.bloodPressureSheetTitle}
          </SheetTitle>
        </SheetHeader>

        {/* Big value display */}
        <div className="mt-5 flex items-baseline justify-center gap-2 rounded-2xl border border-pp-teal/25 bg-gradient-to-br from-pp-teal/8 to-pp-blue/8 px-4 py-6">
          <span className="font-display tabular-nums text-5xl font-semibold tracking-tight text-pp-teal-deep">
            {value ?? "—/—"}
          </span>
          <span className="text-base font-medium text-muted-foreground">mmHg</span>
        </div>

        {/* 2x3 preset grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {BP_PRESETS.map((v) => (
            <button
              key={v}
              onClick={() => setValue(v)}
              className={cn(
                "pp-soft-button font-display tabular-nums h-14 rounded-2xl border-2 text-lg font-semibold tracking-tight transition",
                value === v ? "border-pp-teal bg-pp-teal/10" : "border-border/70",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!value}
          className="pp-primary-button font-display mt-5 h-14 w-full rounded-2xl text-lg font-semibold tracking-tight disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tr.saveReading}
        </button>
      </SheetContent>
    </Sheet>
  );
}
