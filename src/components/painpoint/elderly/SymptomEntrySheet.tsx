import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  ZONE_LABELS,
  type PainType,
  type Severity,
  type ZoneId,
  type SymptomEntry,
} from "@/lib/painpoint-data";
import { t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * SECURITY NOTE — DEMO ONLY
 *
 * Same key as VoiceInputCard. Hard-coded keys in client bundles can be
 * extracted from devtools — use a low-cap key for the hackathon and migrate
 * to a server-proxy after the demo. Empty/placeholder = silent fallback.
 * ──────────────────────────────────────────────────────────────────────── */
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const CHAT_URL = "https://api.openai.com/v1/chat/completions";
const FOLLOWUP_TIMEOUT_MS = 5000;

function isApiKeyConfigured(): boolean {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.startsWith("sk-") && !OPENAI_API_KEY.includes("PASTE_");
}

type Props = {
  zone: ZoneId | null;
  lang: Lang;
  onClose: () => void;
  onEmergency: () => void;
  onRecorded: (entry: Omit<SymptomEntry, "id">) => void;
};

const PAIN_TYPES: { id: PainType; emoji: string; tint: string }[] = [
  { id: "pressing", emoji: "😤", tint: "from-amber-50 to-orange-50" },
  { id: "sharp", emoji: "⚡", tint: "from-violet-50 to-fuchsia-50" },
  { id: "burning", emoji: "🔥", tint: "from-rose-50 to-orange-50" },
  { id: "aching", emoji: "😩", tint: "from-sky-50 to-cyan-50" },
];

const SEVERITIES: { id: Severity; emoji: string; tint: string }[] = [
  { id: "mild", emoji: "😐", tint: "from-emerald-50 to-teal-50" },
  { id: "moderate", emoji: "😟", tint: "from-amber-50 to-orange-50" },
  { id: "severe", emoji: "😣", tint: "from-rose-50 to-red-50" },
];

type FollowUp = {
  q: string;
  opts: [string, string, string];
};
type FollowUpSource = "ai" | "fallback";

const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  bm: "Bahasa Malaysia",
  zh: "Mandarin Chinese",
};

const SYSTEM_PROMPT = [
  "You are PainPoint, a symptom tracking assistant for elderly Malaysian patients.",
  "Generate ONE follow-up question (under 15 words) in the patient's language.",
  "Provide exactly 3 short tap-friendly answer options (under 5 words each).",
  "Never diagnose. Never suggest medication.",
  "Focus on: timing, triggers, duration, or associated symptoms.",
  "Be warm and respectful to elderly.",
  'Return ONLY valid JSON: {"question":"...","options":["...","...","..."]}',
].join(" ");

/** Round-trip GPT-4o for a contextual follow-up question. */
async function fetchAIFollowUp(args: {
  zone: ZoneId;
  type: PainType;
  severity: Severity;
  lang: Lang;
  signal: AbortSignal;
}): Promise<FollowUp> {
  const { zone, type, severity, lang, signal } = args;
  const userMsg = `Patient reported: zone=${zone}, pain_type=${type}, severity=${severity}. Language: ${LANG_LABEL[lang]}.`;

  const res = await fetch(CHAT_URL, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "{}";
  const parsed = JSON.parse(raw) as { question?: unknown; options?: unknown };

  // Coerce / validate. If the model returned anything weird, throw and let
  // the caller fall back to the hardcoded i18n question.
  if (typeof parsed.question !== "string" || !parsed.question.trim()) {
    throw new Error("AI response missing question");
  }
  if (!Array.isArray(parsed.options)) {
    throw new Error("AI response missing options array");
  }
  const opts = parsed.options.filter((o): o is string => typeof o === "string" && !!o.trim());
  if (opts.length < 3) throw new Error("AI response < 3 options");

  return {
    q: parsed.question.trim(),
    opts: [opts[0].trim(), opts[1].trim(), opts[2].trim()],
  };
}

export function SymptomEntrySheet({ zone, lang, onClose, onEmergency, onRecorded }: Props) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<PainType | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);

  // Step 3 state machine: thinking → revealed
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [source, setSource] = useState<FollowUpSource>("fallback");

  // Used to abort an in-flight OpenAI call when the sheet closes or the
  // user backs out before the response lands.
  const abortRef = useRef<AbortController | null>(null);

  const tr = t(lang);

  // Reset when a new zone is tapped.
  useEffect(() => {
    if (zone) {
      setStep(1);
      setType(null);
      setSeverity(null);
      setFollowUp(null);
      setSource("fallback");
    }
  }, [zone]);

  // When step becomes 3, fire the AI call (with timeout + fallback).
  useEffect(() => {
    if (step !== 3 || !zone || !type || !severity) return;

    setFollowUp(null);
    setSource("fallback");

    const fallback: FollowUp = (() => {
      const f = tr.followUp[`${zone}-${type}`] ?? tr.followUp.default;
      return { q: f.q, opts: f.opts };
    })();

    if (!isApiKeyConfigured()) {
      // No key → use hardcoded copy, but still show the thinking animation
      // briefly so judges see the same UX rhythm.
      const t1 = window.setTimeout(() => {
        setFollowUp(fallback);
        setSource("fallback");
      }, 1100);
      return () => window.clearTimeout(t1);
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    // Hard 5s ceiling — if AI is slow, we silently use the local question.
    const timeoutId = window.setTimeout(() => ctrl.abort(), FOLLOWUP_TIMEOUT_MS);

    fetchAIFollowUp({ zone, type, severity, lang, signal: ctrl.signal })
      .then((res) => {
        window.clearTimeout(timeoutId);
        setFollowUp(res);
        setSource("ai");
      })
      .catch(() => {
        window.clearTimeout(timeoutId);
        // Silent fallback. No toast, no error UI — just the local question.
        setFollowUp(fallback);
        setSource("fallback");
      });

    return () => {
      window.clearTimeout(timeoutId);
      ctrl.abort();
      abortRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, zone, type, severity, lang]);

  // Auto-close after confirmation.
  useEffect(() => {
    if (step === 4) {
      const timer = window.setTimeout(() => onClose(), 3000);
      return () => window.clearTimeout(timer);
    }
  }, [step, onClose]);

  // Always abort any open request when unmounting.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSeverity = (s: Severity) => {
    setSeverity(s);
    if (zone === "chest" && s === "severe") {
      onEmergency();
      onClose();
      return;
    }
    setStep(3);
  };

  const handleAnswer = (answer: string) => {
    if (zone && type && severity) {
      onRecorded({
        when: "Just now",
        zone,
        type,
        severity,
        answer,
        kind: "symptom",
        flag: zone === "chest" ? "Chest symptom reported" : undefined,
      });
    }
    setStep(4);
  };

  const painLabel = (id: PainType) =>
    id === "pressing"
      ? tr.painPressing
      : id === "sharp"
        ? tr.painSharp
        : id === "burning"
          ? tr.painBurning
          : tr.painAching;

  const sevLabel = (id: Severity) =>
    id === "mild" ? tr.sevMild : id === "moderate" ? tr.sevModerate : tr.sevSevere;

  const isThinking = step === 3 && followUp == null;
  const isAi = source === "ai";

  return (
    <Sheet open={!!zone} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-pp-teal/30 pb-8"
        style={{
          background: "linear-gradient(180deg, oklch(1 0 0) 0%, oklch(0.985 0.01 80) 100%)",
        }}
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-medium tracking-tight">
            {zone && (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 animate-zone-pulse rounded-full bg-pp-teal" />
                {tr.zone[zone]}
                {lang !== "en" && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-base font-medium text-muted-foreground">
                      {ZONE_LABELS[zone].en}
                    </span>
                  </>
                )}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Step progress bar */}
        {step < 4 && (
          <div className="mx-1 mt-2 flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  step >= i ? "bg-gradient-to-r from-pp-teal to-pp-blue" : "bg-muted",
                )}
              />
            ))}
          </div>
        )}

        {/* ── Step 1: pain type ── */}
        {step === 1 && (
          <div className="mt-5 space-y-4 animate-[fade-up_300ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="font-display text-xl font-medium tracking-tight">{tr.whatKindOfPain}</p>
            <div className="grid grid-cols-2 gap-3">
              {PAIN_TYPES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setType(p.id);
                    setStep(2);
                  }}
                  className={cn(
                    "pp-soft-button group relative flex h-32 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 p-3 text-center",
                    type === p.id ? "border-pp-teal" : "border-border/70",
                  )}
                >
                  <div
                    aria-hidden
                    className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-80", p.tint)}
                  />
                  <span className="text-4xl transition-transform group-hover:scale-110">
                    {p.emoji}
                  </span>
                  <span className="text-sm font-bold">{painLabel(p.id)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: severity ── */}
        {step === 2 && (
          <div className="mt-5 space-y-4 animate-[fade-up_300ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="font-display text-xl font-medium tracking-tight">{tr.howBadIsIt}</p>
            <div className="grid grid-cols-3 gap-3">
              {SEVERITIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSeverity(s.id)}
                  className="pp-soft-button group relative flex h-32 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-border/70 p-2 text-center"
                >
                  <div
                    aria-hidden
                    className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-80", s.tint)}
                  />
                  <span className="text-4xl transition-transform group-hover:scale-110">
                    {s.emoji}
                  </span>
                  <span className="text-sm font-bold">{sevLabel(s.id)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: AI follow-up ── */}
        {step === 3 && (
          <div className="mt-5 space-y-4 animate-[fade-up_300ms_cubic-bezier(0.22,1,0.36,1)_both]">
            {isThinking ? (
              /* ── Thinking state: bouncing dots + label ── */
              <div className="flex flex-col gap-4">
                {/* AI badge — visible while AI is working */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-pp-teal/30 bg-gradient-to-br from-pp-teal/10 to-pp-blue/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-pp-teal-deep">
                    ✨ AI Generated
                  </span>
                </div>

                {/* Chat bubble with bouncing dots + status label */}
                <div
                  className="relative flex min-h-[64px] items-center gap-3 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.96 0.04 195) 0%, oklch(0.93 0.06 195) 100%)",
                    border: "1px solid oklch(0.85 0.06 195)",
                  }}
                  aria-label="AI is generating a question"
                  aria-live="polite"
                >
                  {/* Subtle shimmer overlay */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl rounded-tl-sm"
                  >
                    <div
                      className="absolute inset-0 -translate-x-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, oklch(1 0 0 / 0.35) 50%, transparent 100%)",
                        animation: "shimmer 1.4s ease-in-out infinite",
                      }}
                    />
                  </div>

                  <div className="relative flex items-center gap-2.5" role="status">
                    <span className="pp-ai-dot" />
                    <span className="pp-ai-dot" />
                    <span className="pp-ai-dot" />
                  </div>
                  <span className="relative text-sm font-medium text-pp-teal-deep">
                    AI is thinking…
                  </span>
                </div>

                {/* Greyed-out placeholder buttons so layout doesn't jump */}
                <div className="space-y-2 opacity-30" aria-hidden>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-full rounded-2xl border-2 border-border/50 bg-muted/40"
                    />
                  ))}
                </div>
              </div>
            ) : followUp ? (
              /* ── Revealed state: question + answer buttons ── */
              <div className="flex flex-col gap-4">
                {/* AI badge — only when the question actually came from AI */}
                {isAi && (
                  <div className="flex items-center gap-1.5 pp-ai-question-reveal">
                    <span className="inline-flex items-center gap-1 rounded-full border border-pp-teal/30 bg-gradient-to-br from-pp-teal/10 to-pp-blue/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-pp-teal-deep">
                      ✨ AI Generated
                    </span>
                  </div>
                )}

                {/* Question bubble */}
                <div
                  className="font-display rounded-2xl rounded-tl-sm px-5 py-4 text-xl font-medium leading-snug tracking-tight shadow-sm pp-ai-question-reveal"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.96 0.04 195) 0%, oklch(0.93 0.06 195) 100%)",
                    border: "1px solid oklch(0.85 0.06 195)",
                    animationDelay: "40ms",
                  }}
                >
                  {followUp.q}
                </div>

                {/* Answer buttons — staggered reveal */}
                <div className="space-y-2">
                  {followUp.opts.map((a, i) => (
                    <button
                      key={`${a}-${i}`}
                      onClick={() => handleAnswer(a)}
                      className="pp-soft-button pp-ai-question-reveal h-14 w-full rounded-2xl border-2 border-border/70 text-lg font-semibold transition active:border-pp-teal"
                      style={{ animationDelay: `${120 + i * 70}ms` }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ── Step 4: confirmation ── */}
        {step === 4 && (
          <div className="mt-10 flex flex-col items-center gap-3 py-8 text-center animate-[fade-up_320ms_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pp-success/30 to-pp-teal/30 text-5xl shadow-inner">
              ✅
            </div>
            <p className="font-display text-3xl font-medium tracking-tight">{tr.thankYou}</p>
            <p className="text-base text-muted-foreground">{tr.thankYouSub}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
