export type Severity = "mild" | "moderate" | "severe";
export type PainType = "pressing" | "sharp" | "burning" | "aching";
export type ZoneId =
  | "head"
  | "neck"
  | "chest"
  | "stomach"
  | "left-arm"
  | "right-arm"
  | "upper-back"
  | "lower-back"
  | "left-leg"
  | "right-leg"
  | "hands"
  | "feet";

export const ZONE_LABELS: Record<ZoneId, { en: string; bm: string; emoji: string }> = {
  head: { en: "Head", bm: "Kepala", emoji: "🧠" },
  neck: { en: "Neck", bm: "Leher", emoji: "🦒" },
  chest: { en: "Chest", bm: "Dada", emoji: "🫁" },
  stomach: { en: "Stomach", bm: "Perut", emoji: "🫃" },
  "left-arm": { en: "Left Arm", bm: "Lengan Kiri", emoji: "💪" },
  "right-arm": { en: "Right Arm", bm: "Lengan Kanan", emoji: "💪" },
  "upper-back": { en: "Upper Back", bm: "Belakang Atas", emoji: "🦴" },
  "lower-back": { en: "Lower Back", bm: "Belakang Bawah", emoji: "🦴" },
  "left-leg": { en: "Left Knee", bm: "Lutut Kiri", emoji: "🦵" },
  "right-leg": { en: "Right Knee", bm: "Lutut Kanan", emoji: "🦵" },
  hands: { en: "Hands", bm: "Tangan", emoji: "✋" },
  feet: { en: "Feet", bm: "Kaki", emoji: "🦶" },
};

export const PATIENT = {
  name: "Lim Ah Kong",
  age: 72,
  conditions: ["Type 2 Diabetes", "Hypertension"],
  medications: ["Metformin 500mg BD", "Amlodipine 5mg OD", "Aspirin 100mg OD"],
  language: "English / BM",
  caregiver: "Wei Ming",
  lastActive: "Today, 2:15 PM",
};

export type SymptomEntry = {
  id: string;
  when: string;
  zone?: ZoneId;
  type?: PainType;
  severity?: Severity;
  answer?: string;
  kind: "symptom" | "med" | "reading";
  note?: string;
  flag?: string;
};

/* ──────────────────────────────────────────────────────────────────────────
 * Calendar reference: "today" in this demo is Sun 24 May 2026.
 * May 1 is a Friday. Day-of-week labels are pre-computed below so the
 * seed feed can use phrases like "Mon 12 May, 8:00 AM" for past entries.
 * ──────────────────────────────────────────────────────────────────────── */

export const TODAY_DAY = 24;

const DOW: Record<number, string> = {
  1: "Fri",
  2: "Sat",
  3: "Sun",
  4: "Mon",
  5: "Tue",
  6: "Wed",
  7: "Thu",
  8: "Fri",
  9: "Sat",
  10: "Sun",
  11: "Mon",
  12: "Tue",
  13: "Wed",
  14: "Thu",
  15: "Fri",
  16: "Sat",
  17: "Sun",
  18: "Mon",
  19: "Tue",
  20: "Wed",
  21: "Thu",
  22: "Fri",
  23: "Sat", // "Yesterday"
  24: "Sun", // "Today"
};

/** Format a "when" string. day=24 → "Today, …", day=23 → "Yesterday, …",
 *  otherwise → "Mon 12 May, …".  Time is the second arg, no leading zero. */
function w(day: number, time: string): string {
  if (day === TODAY_DAY) return `Today, ${time}`;
  if (day === TODAY_DAY - 1) return `Yesterday, ${time}`;
  return `${DOW[day]} ${day} May, ${time}`;
}

let _id = 0;
function id(prefix: string): string {
  _id += 1;
  return `${prefix}${_id}`;
}

/* ──────────────────────────────────────────────────────────────────────────
 * SYMPTOM_FEED — a believable 24-day chronic-care narrative for Ah Kong.
 *
 * Story arc:
 *   May 1–8   : stable baseline (good days, normal-ish BP/sugar, occasional
 *               mild ache, near-perfect medication adherence)
 *   May 9–14  : borderline week (a few moderate days — knee acting up,
 *               mild morning headaches, BP creeping up)
 *   May 15–18 : warning signs (one missed med dose, fasting sugar trending
 *               higher, occasional mild chest tightness)
 *   May 19–22 : worsening pattern (recurrent moderate chest pressing,
 *               BP consistently borderline, knee + head co-occurring)
 *   May 23–24 : present-day red days (third + fourth chest symptom in 7d)
 *
 * The calendar heatmap derives its colors directly from this feed via
 * dayStatusFor() below — no hardcoded color array.
 * Entries are written newest-first so the live feed reads correctly.
 * ──────────────────────────────────────────────────────────────────────── */

export const SYMPTOM_FEED: SymptomEntry[] = [
  // ─── Today (May 24, Sun) ── 4th chest symptom this week ───────────────
  {
    id: id("s"),
    when: w(24, "2:15 PM"),
    zone: "chest",
    type: "pressing",
    severity: "moderate",
    answer: "Constant",
    kind: "symptom",
    flag: "4th chest symptom this week",
  },
  { id: id("m"), when: w(24, "8:02 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(24, "7:15 AM"), kind: "reading", note: "Blood pressure: 138/88 mmHg" },
  {
    id: id("r"),
    when: w(24, "7:00 AM"),
    kind: "reading",
    note: "Blood sugar: 6.8 mmol/L (Before meal)",
  },

  // ─── Yesterday (May 23, Sat) ─ chest + post-dinner sugar spike ────────
  {
    id: id("s"),
    when: w(23, "3:40 PM"),
    zone: "chest",
    type: "pressing",
    severity: "moderate",
    answer: "During activity",
    kind: "symptom",
  },
  {
    id: id("r"),
    when: w(23, "8:00 PM"),
    kind: "reading",
    note: "Blood sugar: 9.1 mmol/L (After meal)",
  },
  { id: id("m"), when: w(23, "8:15 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(23, "7:00 AM"), kind: "reading", note: "Blood pressure: 142/90 mmHg" },
  {
    id: id("r"),
    when: w(23, "6:55 AM"),
    kind: "reading",
    note: "Blood sugar: 7.2 mmol/L (Before meal)",
  },

  // ─── Fri 22 May ── moderate (knee + BP borderline) ────────────────────
  {
    id: id("s"),
    when: w(22, "5:10 PM"),
    zone: "left-leg",
    type: "aching",
    severity: "moderate",
    answer: "After standing long",
    kind: "symptom",
  },
  { id: id("r"), when: w(22, "8:30 AM"), kind: "reading", note: "Blood pressure: 140/90 mmHg" },
  { id: id("m"), when: w(22, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("r"),
    when: w(22, "7:00 AM"),
    kind: "reading",
    note: "Blood sugar: 7.5 mmol/L (Before meal)",
  },

  // ─── Thu 21 May ── 1st chest symptom (the one that started the pattern)
  {
    id: id("s"),
    when: w(21, "11:20 AM"),
    zone: "chest",
    type: "pressing",
    severity: "moderate",
    answer: "Constant",
    kind: "symptom",
    flag: "Chest symptom reported",
  },
  { id: id("m"), when: w(21, "8:05 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(21, "7:30 AM"), kind: "reading", note: "Blood pressure: 136/86 mmHg" },

  // ─── Wed 20 May ── moderate (mild headache + ok readings) ─────────────
  {
    id: id("s"),
    when: w(20, "9:45 AM"),
    zone: "head",
    type: "aching",
    severity: "moderate",
    answer: "Morning after waking",
    kind: "symptom",
  },
  { id: id("m"), when: w(20, "8:10 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("r"),
    when: w(20, "7:10 AM"),
    kind: "reading",
    note: "Blood sugar: 7.0 mmol/L (Before meal)",
  },

  // ─── Tue 19 May ── moderate knee day ──────────────────────────────────
  {
    id: id("s"),
    when: w(19, "4:30 PM"),
    zone: "left-leg",
    type: "aching",
    severity: "moderate",
    answer: "Going up stairs",
    kind: "symptom",
  },
  { id: id("r"), when: w(19, "8:00 AM"), kind: "reading", note: "Blood pressure: 134/84 mmHg" },
  { id: id("m"), when: w(19, "7:50 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Mon 18 May ── borderline (missed evening dose, sugar high) ───────
  {
    id: id("r"),
    when: w(18, "9:00 PM"),
    kind: "reading",
    note: "Blood sugar: 9.4 mmol/L (After meal)",
  },
  { id: id("m"), when: w(18, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("s"),
    when: w(18, "7:30 AM"),
    zone: "head",
    type: "aching",
    severity: "mild",
    answer: "Morning after waking",
    kind: "symptom",
  },

  // ─── Sun 17 May ── good (just routine logs) ──────────────────────────
  { id: id("r"), when: w(17, "8:00 AM"), kind: "reading", note: "Blood pressure: 132/82 mmHg" },
  { id: id("m"), when: w(17, "7:55 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("r"),
    when: w(17, "7:00 AM"),
    kind: "reading",
    note: "Blood sugar: 6.5 mmol/L (Before meal)",
  },

  // ─── Sat 16 May ── moderate (knee aching after market run) ───────────
  {
    id: id("s"),
    when: w(16, "11:00 AM"),
    zone: "left-leg",
    type: "aching",
    severity: "mild",
    answer: "After walking",
    kind: "symptom",
  },
  { id: id("m"), when: w(16, "8:10 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(16, "7:30 AM"), kind: "reading", note: "Blood pressure: 130/82 mmHg" },

  // ─── Fri 15 May ── good ──────────────────────────────────────────────
  { id: id("m"), when: w(15, "8:05 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("r"),
    when: w(15, "7:10 AM"),
    kind: "reading",
    note: "Blood sugar: 6.7 mmol/L (Before meal)",
  },

  // ─── Thu 14 May ── moderate (mild headache) ───────────────────────────
  {
    id: id("s"),
    when: w(14, "8:30 AM"),
    zone: "head",
    type: "aching",
    severity: "mild",
    answer: "Morning",
    kind: "symptom",
  },
  { id: id("m"), when: w(14, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(14, "7:30 AM"), kind: "reading", note: "Blood pressure: 134/86 mmHg" },

  // ─── Wed 13 May ── good ──────────────────────────────────────────────
  {
    id: id("r"),
    when: w(13, "7:10 AM"),
    kind: "reading",
    note: "Blood sugar: 6.4 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(13, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Tue 12 May ── good ──────────────────────────────────────────────
  { id: id("r"), when: w(12, "8:00 AM"), kind: "reading", note: "Blood pressure: 128/80 mmHg" },
  { id: id("m"), when: w(12, "7:55 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Mon 11 May ── moderate (knee acting up after gardening) ─────────
  {
    id: id("s"),
    when: w(11, "5:45 PM"),
    zone: "left-leg",
    type: "aching",
    severity: "mild",
    answer: "After gardening",
    kind: "symptom",
  },
  { id: id("m"), when: w(11, "8:10 AM"), kind: "med", note: "Morning medication taken ✅" },
  {
    id: id("r"),
    when: w(11, "7:00 AM"),
    kind: "reading",
    note: "Blood sugar: 6.6 mmol/L (Before meal)",
  },

  // ─── Sun 10 May ── good ──────────────────────────────────────────────
  { id: id("m"), when: w(10, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(10, "7:30 AM"), kind: "reading", note: "Blood pressure: 130/82 mmHg" },

  // ─── Sat 9 May ── good ───────────────────────────────────────────────
  {
    id: id("r"),
    when: w(9, "7:10 AM"),
    kind: "reading",
    note: "Blood sugar: 6.3 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(9, "7:50 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Fri 8 May ── good ───────────────────────────────────────────────
  { id: id("m"), when: w(8, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(8, "7:00 AM"), kind: "reading", note: "Blood pressure: 126/80 mmHg" },

  // ─── Thu 7 May ── good ───────────────────────────────────────────────
  {
    id: id("r"),
    when: w(7, "7:15 AM"),
    kind: "reading",
    note: "Blood sugar: 6.2 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(7, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Wed 6 May ── good ───────────────────────────────────────────────
  { id: id("m"), when: w(6, "8:05 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(6, "7:30 AM"), kind: "reading", note: "Blood pressure: 128/82 mmHg" },

  // ─── Tue 5 May ── good ───────────────────────────────────────────────
  {
    id: id("r"),
    when: w(5, "7:00 AM"),
    kind: "reading",
    note: "Blood sugar: 6.1 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(5, "7:55 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Mon 4 May ── good ───────────────────────────────────────────────
  { id: id("m"), when: w(4, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(4, "7:30 AM"), kind: "reading", note: "Blood pressure: 130/82 mmHg" },

  // ─── Sun 3 May ── good ───────────────────────────────────────────────
  {
    id: id("r"),
    when: w(3, "7:10 AM"),
    kind: "reading",
    note: "Blood sugar: 6.0 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(3, "7:50 AM"), kind: "med", note: "Morning medication taken ✅" },

  // ─── Sat 2 May ── good ───────────────────────────────────────────────
  { id: id("m"), when: w(2, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
  { id: id("r"), when: w(2, "7:30 AM"), kind: "reading", note: "Blood pressure: 128/80 mmHg" },

  // ─── Fri 1 May ── good (start of the month) ──────────────────────────
  {
    id: id("r"),
    when: w(1, "7:15 AM"),
    kind: "reading",
    note: "Blood sugar: 5.9 mmol/L (Before meal)",
  },
  { id: id("m"), when: w(1, "8:00 AM"), kind: "med", note: "Morning medication taken ✅" },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Calendar heatmap status
 * ──────────────────────────────────────────────────────────────────────── */

export type DayStatus = "good" | "moderate" | "severe" | "none";

/** Compute the day's heatmap status from its entries.
 *  Worst severity wins. A symptom always trumps a reading; a reading only
 *  contributes "moderate" if outside healthy thresholds. Days with only
 *  medication and normal readings stay "good". No entries → "none". */
export function dayStatusFor(entries: SymptomEntry[]): DayStatus {
  if (entries.length === 0) return "none";

  let worst: DayStatus = "good";
  const bump = (next: DayStatus) => {
    const order: Record<DayStatus, number> = { none: 0, good: 1, moderate: 2, severe: 3 };
    if (order[next] > order[worst]) worst = next;
  };

  for (const e of entries) {
    if (e.kind === "symptom" && e.severity) {
      if (e.severity === "severe") bump("severe");
      else if (e.severity === "moderate") bump("moderate");
      else bump("good"); // mild symptom alone — still a logged day, count as good
    } else if (e.kind === "reading") {
      // Bump to moderate if reading is outside the healthy zone.
      if (e.note) {
        const bp = e.note.match(/(\d{2,3})\/(\d{2,3})\s*mmHg/i);
        if (bp) {
          const sys = parseInt(bp[1], 10);
          const dia = parseInt(bp[2], 10);
          if (sys >= 140 || dia >= 90) bump("moderate");
        }
        const sugar = e.note.match(/(\d+(?:\.\d+)?)\s*mmol\/L/i);
        if (sugar) {
          const v = parseFloat(sugar[1]);
          // After-meal threshold ≥ 9.0 / before-meal ≥ 7.0 (rough Asian CPG cutoffs).
          const isAfter = /after meal/i.test(e.note);
          if ((isAfter && v >= 9.0) || (!isAfter && v >= 7.0)) bump("moderate");
        }
      }
    } else {
      // Med taken → counts as logged data → "good".
      bump("good");
    }
  }

  return worst;
}

/** Group entries by day-of-month and compute a status array indexed by day. */
export function calendarStatusFromFeed(entries: SymptomEntry[]): DayStatus[] {
  const byDay: Record<number, SymptomEntry[]> = {};
  for (const e of entries) {
    const d = whenToDay(e.when);
    if (d == null) continue;
    (byDay[d] ||= []).push(e);
  }
  const out: DayStatus[] = [];
  for (let d = 1; d <= 31; d++) {
    out.push(dayStatusFor(byDay[d] ?? []));
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────────────
 * AI-generated daily reports — May 1 → May 23
 *
 * Pre-written narrative summaries for past days, surfaced at the top of the
 * calendar day-detail dialog. May 24 (today) is intentionally omitted: today
 * gets the live feed without a static report so judges can see the dashboard
 * "filling in" as they tap through symptoms during the demo.
 *
 * Tone: warm caregiver-facing prose (the audience is Wei Ming, not Ah Kong).
 * No diagnosis, no medication advice — just observation + soft suggestions.
 * ──────────────────────────────────────────────────────────────────────── */

export type DailyReport = {
  /** Day of the month, 1–24. May 24 is excluded by design. */
  day: number;
  /** One-line headline that fits on a card. */
  headline: string;
  /** 1–3 sentence narrative shown below the headline. */
  summary: string;
  /** Optional bullet highlights — vital changes, notable events, etc. */
  highlights?: string[];
};

export const DAILY_REPORTS: Record<number, DailyReport> = {
  1: {
    day: 1,
    headline: "Stable start to the month",
    summary:
      "Ah Kong started May with a calm baseline — fasting sugar 5.9 mmol/L and morning meds taken on time. No symptoms reported today.",
    highlights: ["Fasting sugar 5.9 mmol/L", "Morning meds adherence 100%"],
  },
  2: {
    day: 2,
    headline: "Routine day, BP in target",
    summary:
      "Blood pressure measured at 128/80 mmHg this morning — well within target. Medication adherence on track. No pain symptoms logged.",
    highlights: ["BP 128/80 mmHg", "Meds taken on time"],
  },
  3: {
    day: 3,
    headline: "Steady morning numbers",
    summary:
      "Fasting sugar 6.0 mmol/L and morning medication taken. A quiet day with no flagged symptoms.",
    highlights: ["Fasting sugar 6.0 mmol/L"],
  },
  4: {
    day: 4,
    headline: "On-target BP, smooth day",
    summary:
      "Morning BP at 130/82 mmHg — slight uptick but still within Ah Kong's normal range. Medication routine maintained.",
    highlights: ["BP 130/82 mmHg"],
  },
  5: {
    day: 5,
    headline: "Best fasting sugar this week",
    summary:
      "Fasting glucose dropped to 6.1 mmol/L — Ah Kong's lowest reading recently. Suggests last week's diet adjustments are helping.",
    highlights: ["Fasting sugar 6.1 mmol/L ↓"],
  },
  6: {
    day: 6,
    headline: "Stable mid-week",
    summary:
      "Routine BP check at 128/82 mmHg, no pain or unusual symptoms reported. Medication adherence on schedule.",
    highlights: ["BP 128/82 mmHg"],
  },
  7: {
    day: 7,
    headline: "Quiet, comfortable day",
    summary:
      "Fasting sugar 6.2 mmol/L and morning meds taken. Nothing notable to flag — pattern remains in the safe zone.",
  },
  8: {
    day: 8,
    headline: "Excellent BP reading",
    summary:
      "Morning BP at 126/80 mmHg — the best reading this month so far. Medication taken on time.",
    highlights: ["BP 126/80 mmHg ↓"],
  },
  9: {
    day: 9,
    headline: "Weekend baseline maintained",
    summary:
      "Fasting glucose 6.3 mmol/L. Ah Kong stayed on his medication routine through the weekend.",
  },
  10: {
    day: 10,
    headline: "Stable Sunday",
    summary: "Routine BP at 130/82 mmHg, morning meds taken. No symptoms logged today.",
    highlights: ["BP 130/82 mmHg"],
  },
  11: {
    day: 11,
    headline: "Mild knee discomfort after gardening",
    summary:
      "Ah Kong reported a mild aching in his left knee after spending the afternoon gardening. Brief and self-limiting — no follow-up needed yet.",
    highlights: ["Knee ache, mild · after gardening"],
  },
  12: {
    day: 12,
    headline: "Back to baseline",
    summary: "Morning BP 128/80 mmHg. Knee from yesterday hasn't returned. Routine day overall.",
    highlights: ["BP 128/80 mmHg"],
  },
  13: {
    day: 13,
    headline: "Lowest sugar this fortnight",
    summary: "Fasting glucose 6.4 mmol/L. Steady control continues. Morning medication taken.",
  },
  14: {
    day: 14,
    headline: "Mild morning headache noted",
    summary:
      "Ah Kong reported a brief mild headache shortly after waking. BP this morning was 134/86 mmHg — slightly elevated but not concerning on its own.",
    highlights: ["Morning headache, mild", "BP 134/86 mmHg ↑"],
  },
  15: {
    day: 15,
    headline: "Quiet day after yesterday's headache",
    summary:
      "Fasting sugar 6.7 mmol/L and morning meds taken. Headache from yesterday did not recur.",
  },
  16: {
    day: 16,
    headline: "Knee ache after market run",
    summary:
      "Mild left knee aching after Ah Kong's morning market trip. Resolved without intervention. BP 130/82 mmHg.",
    highlights: ["Knee ache, mild · after walking"],
  },
  17: {
    day: 17,
    headline: "Restful Sunday",
    summary: "BP 132/82 mmHg, fasting sugar 6.5 mmol/L. Medication routine on track. No symptoms.",
  },
  18: {
    day: 18,
    headline: "Post-dinner sugar spike",
    summary:
      "Mild morning headache and a noticeably high post-meal sugar reading of 9.4 mmol/L this evening. Worth keeping an eye on diet over the next few days.",
    highlights: ["Mild headache", "Post-meal sugar 9.4 mmol/L ↑"],
  },
  19: {
    day: 19,
    headline: "Knee pain on stairs",
    summary:
      "Moderate aching in Ah Kong's left knee while climbing stairs in the afternoon. Pattern is consistent — knee acts up with strain. BP 134/84 mmHg.",
    highlights: ["Left knee, moderate · stairs"],
  },
  20: {
    day: 20,
    headline: "Morning headache, slight uptick",
    summary:
      "Moderate headache after waking. Fasting sugar 7.0 mmol/L — at the borderline threshold. Worth a casual check-in if it continues.",
    highlights: ["Morning headache, moderate", "Fasting sugar 7.0 mmol/L"],
  },
  21: {
    day: 21,
    headline: "First chest symptom this week",
    summary:
      "Ah Kong reported a constant pressing sensation in his chest, moderate intensity. This is the first chest-related symptom logged in over a month — worth monitoring closely.",
    highlights: ["Chest, pressing, moderate · constant", "BP 136/86 mmHg"],
  },
  22: {
    day: 22,
    headline: "BP at threshold + knee ache",
    summary:
      "BP 140/90 mmHg — at the hypertension threshold. Moderate knee ache after standing for long. Pattern this week is trending in the wrong direction.",
    highlights: ["BP 140/90 mmHg ↑", "Left knee, moderate · standing"],
  },
  23: {
    day: 23,
    headline: "Second chest symptom + sugar spike",
    summary:
      "Second chest pressing episode this week, this time during activity. Post-meal sugar reached 9.1 mmol/L. BP 142/90 mmHg. Recommended: book a GP teleconsult to discuss the recurring chest pattern before symptoms escalate.",
    highlights: [
      "Chest, pressing, moderate · during activity",
      "BP 142/90 mmHg ↑",
      "Post-meal sugar 9.1 mmol/L ↑",
    ],
  },
};

/** Get the AI-generated narrative for a past day, if one exists.
 *  May 24 (today) intentionally returns null so the live feed shows up
 *  without a stale pre-written summary in front of it. */
export function getDailyReport(day: number): DailyReport | null {
  return DAILY_REPORTS[day] ?? null;
}

export const DA_SLOTS = [
  { id: "s1", label: "Today 4:00 PM — DA Virtual Clinic" },
  { id: "s2", label: "Tomorrow 9:30 AM — DA Virtual Clinic" },
  { id: "s3", label: "Tomorrow 2:00 PM — DA House Call (Penang)" },
];

// Storage key for localStorage persistence
export const STORAGE_KEY = "painpoint.symptoms.v1";

// Map a feed entry's `when` string to a day-of-month in May 2026.
// Today = May 24, Yesterday = May 23, otherwise parse "Mon 19 May" / "Wed 21 May".
export function whenToDay(when: string): number | null {
  if (when.startsWith("Today")) return TODAY_DAY;
  if (when.startsWith("Yesterday")) return TODAY_DAY - 1;
  const m = when.match(/\b(\d{1,2})\s*May/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

/**
 * Classify a reading-entry note string. Returns "bp" for blood pressure,
 * "sugar" for blood glucose, "other" otherwise.
 */
export type ReadingKind = "bp" | "sugar" | "other";

export function classifyReading(note: string | undefined): ReadingKind {
  if (!note) return "other";
  const lower = note.toLowerCase();
  if (lower.includes("blood pressure") || /\d{2,3}\/\d{2,3}\s*mmhg/i.test(note)) return "bp";
  if (lower.includes("blood sugar") || lower.includes("mmol/l")) return "sugar";
  return "other";
}

/**
 * Pull the most recent BP and Sugar values out of a feed for the
 * "Last BP / Last Sugar" trend line on the elderly card.
 */
export function lastReadings(entries: SymptomEntry[]): {
  bp: string | null;
  sugar: string | null;
} {
  let bp: string | null = null;
  let sugar: string | null = null;
  for (const e of entries) {
    if (e.kind !== "reading" || !e.note) continue;
    const kind = classifyReading(e.note);
    if (kind === "bp" && !bp) {
      // "Blood pressure: 138/88 mmHg" → "138/88"
      const m = e.note.match(/(\d{2,3}\/\d{2,3})/);
      bp = m ? m[1] : null;
    }
    if (kind === "sugar" && !sugar) {
      // "Blood sugar: 6.8 mmol/L (Before meal)" → "6.8"
      const m = e.note.match(/(\d+(?:\.\d+)?)\s*mmol/i);
      sugar = m ? m[1] : null;
    }
    if (bp && sugar) break;
  }
  return { bp, sugar };
}
