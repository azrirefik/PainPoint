import { useState } from "react";
import { CalendarHeatmap } from "../CalendarHeatmap";
import { DoctorExport } from "./DoctorExport";
import { DABookingModal } from "./DABookingModal";
import { NearbyClinicMap } from "../NearbyClinicMap";
import { PATIENT, ZONE_LABELS, classifyReading, type SymptomEntry } from "@/lib/painpoint-data";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "report";

type Props = {
  symptoms: SymptomEntry[];
  lastAddedId?: string | null;
};

export function CaregiverDashboard({ symptoms, lastAddedId }: Props) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [clinicsOpen, setClinicsOpen] = useState(true);

  // Dynamic metrics calculated from symptoms array
  const symptomEntries = symptoms.filter((s) => s.kind === "symptom");
  const medEntries = symptoms.filter((s) => s.kind === "med");
  const chestCount = symptomEntries.filter((s) => s.zone === "chest").length;
  const uniqueDays = new Set(symptoms.map((s) => s.when.split(",")[0])).size;
  const adherence =
    medEntries.length > 0 ? Math.round((medEntries.length / (medEntries.length + 2)) * 100) : 85;

  const METRICS = [
    { label: "Active days", value: `${Math.min(uniqueDays, 7)}/7`, sub: "this week" },
    { label: "Symptoms", value: String(symptomEntries.length), sub: "logged" },
    { label: "Meds taken", value: `${adherence}%`, sub: "adherence" },
    { label: "Alerts", value: chestCount >= 3 ? "1" : "0", sub: "pattern" },
  ];

  return (
    <div className="pp-caregiver-page min-h-screen pb-20">
      <div className="mx-auto max-w-md space-y-4 px-4 py-5">
        {/* Tab strip */}
        <div className="flex gap-1 rounded-2xl border border-border/60 bg-card/80 p-1 shadow-sm backdrop-blur">
          {(["dashboard", "report"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-xl px-3 py-2 text-sm font-semibold capitalize transition-all",
                tab === t
                  ? "bg-gradient-to-br from-pp-teal to-pp-blue text-white shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "dashboard" ? "Dashboard" : "Doctor Report"}
            </button>
          ))}
        </div>

        {tab === "dashboard" && (
          <>
            {/* Metric cards with gradient border */}
            <div className="grid grid-cols-2 gap-2.5">
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  className="pp-metric-card rounded-2xl p-3.5"
                  style={{
                    animation: "slide-in 360ms cubic-bezier(0.22,1,0.36,1) both",
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="font-display tabular-nums mt-1 bg-gradient-to-br from-pp-teal-deep to-pp-blue bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
                    {m.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Patient card with AK avatar */}
            <div
              className="pp-card rounded-2xl p-4"
              style={{
                animation: "slide-in 380ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "200ms",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-pp-teal to-pp-blue text-base font-bold text-white shadow-md">
                    AK
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-pp-success shadow" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display truncate text-lg font-semibold tracking-tight">
                      {PATIENT.name}, {PATIENT.age}
                    </p>
                    <span className="shrink-0 rounded-full bg-pp-teal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-pp-teal-deep">
                      {PATIENT.language}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last active: {PATIENT.lastActive}</p>
                  <div className="mt-2.5 space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Conditions:</span>{" "}
                      <span className="text-muted-foreground">{PATIENT.conditions.join(", ")}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Meds:</span>{" "}
                      <span className="text-muted-foreground">
                        {PATIENT.medications.join(", ")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern alert with pulsing amber glow */}
            {chestCount >= 3 && (
              <div
                className="pp-amber-card relative overflow-hidden rounded-2xl p-4"
                style={{
                  animation:
                    "amber-glow 2.6s ease-in-out infinite, slide-in 400ms cubic-bezier(0.22,1,0.36,1) both",
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/70 text-xl shadow-sm backdrop-blur">
                    ⚠️
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-snug">
                      Chest pressing reported {chestCount} times this week.
                    </p>
                    <p className="mt-0.5 text-xs text-pp-ink/70">Consider booking a consult.</p>
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="pp-primary-button mt-3 h-10 w-full rounded-xl text-sm font-bold"
                    >
                      Book with Doctor Anywhere
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar heatmap */}
            <div
              style={{
                animation: "slide-in 420ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "260ms",
              }}
            >
              <CalendarHeatmap symptoms={symptoms} />
            </div>

            {/* Nearby clinics — collapsible */}
            <div
              className="pp-card overflow-hidden rounded-2xl"
              style={{
                animation: "slide-in 460ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "300ms",
              }}
            >
              <button
                onClick={() => setClinicsOpen((o) => !o)}
                aria-expanded={clinicsOpen}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-muted/40"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    📍 Nearby Clinics
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    DA partners, hospitals, and government clinics near Ah Kong
                  </p>
                </div>
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-card text-xs text-muted-foreground transition-transform",
                    clinicsOpen ? "rotate-180" : "rotate-0",
                  )}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {clinicsOpen && (
                <div className="border-t border-border/60 p-4">
                  <NearbyClinicMap variant="full" />
                </div>
              )}
            </div>

            {/* Live feed */}
            <div
              className="pp-card rounded-2xl p-4"
              style={{
                animation: "slide-in 440ms cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: "320ms",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    Live Symptom Feed
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Real-time updates from Ah Kong
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-pp-success/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pp-success opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-pp-success" />
                  </span>
                  Live
                </span>
              </div>
              <ul className="space-y-2">
                {symptoms.map((e, idx) => {
                  const isNew = lastAddedId === e.id;
                  return (
                    <li
                      key={e.id}
                      className={cn(
                        "relative rounded-xl border-l-2 px-3 py-2.5 transition",
                        isNew
                          ? "border-pp-teal bg-gradient-to-r from-pp-teal/15 via-pp-blue/8 to-transparent ring-2 ring-pp-teal/40 ring-offset-2 ring-offset-card"
                          : idx === 0
                            ? "border-pp-teal bg-gradient-to-r from-pp-teal/8 to-transparent"
                            : idx % 2 === 1
                              ? "border-border/70 bg-muted/30"
                              : "border-border/50 bg-transparent",
                      )}
                      style={{
                        animation: isNew
                          ? "amber-glow 1.6s ease-in-out 2, slide-in 320ms cubic-bezier(0.22,1,0.36,1) both"
                          : "slide-in 320ms cubic-bezier(0.22,1,0.36,1) both",
                        animationDelay: isNew ? "0ms" : `${Math.min(idx * 40, 400)}ms`,
                      }}
                    >
                      {isNew && (
                        <span className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-pp-teal to-pp-blue px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                          NEW
                        </span>
                      )}
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {e.when}
                      </p>
                      {e.kind === "symptom" && e.zone ? (
                        <div className="text-sm">
                          <p className="font-semibold">
                            📍 {ZONE_LABELS[e.zone].en} — {cap(e.type)}, {cap(e.severity)}
                          </p>
                          {e.answer && <p className="text-muted-foreground">🗣️ "{e.answer}"</p>}
                          {e.flag && (
                            <p className="mt-0.5 text-xs font-semibold text-pp-alert">
                              ⚠️ {e.flag}
                            </p>
                          )}
                        </div>
                      ) : e.kind === "reading" ? (
                        <p className="text-sm">
                          {readingIcon(e.note)} {e.note}
                        </p>
                      ) : (
                        <p className="text-sm">💊 {e.note}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}

        {tab === "report" && <DoctorExport symptoms={symptoms} />}
      </div>

      <DABookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}

function cap(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function readingIcon(note?: string): string {
  const k = classifyReading(note);
  if (k === "bp") return "💓";
  if (k === "sugar") return "🩸";
  return "📊";
}
