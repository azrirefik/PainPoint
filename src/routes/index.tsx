import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ViewToggle } from "@/components/painpoint/ViewToggle";
import { DemoBadge } from "@/components/painpoint/DemoBadge";
import { ElderlyDashboard } from "@/components/painpoint/elderly/ElderlyDashboard";
import { CaregiverDashboard } from "@/components/painpoint/caregiver/CaregiverDashboard";
import { SYMPTOM_FEED, STORAGE_KEY, type SymptomEntry } from "@/lib/painpoint-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PainPoint — Chronic Disease Companion" },
      {
        name: "description",
        content:
          "Dual-dashboard pain tracking for elderly Malaysian patients and their caregivers.",
      },
    ],
  }),
  component: Index,
});

function loadInitial(): SymptomEntry[] {
  if (typeof window === "undefined") return SYMPTOM_FEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SYMPTOM_FEED;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as SymptomEntry[];
    return SYMPTOM_FEED;
  } catch {
    return SYMPTOM_FEED;
  }
}

function Index() {
  const [view, setView] = useState<"elderly" | "caregiver">("elderly");
  // SSR-safe: server renders the seed feed, the effect below hydrates from localStorage on mount.
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>(SYMPTOM_FEED);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    setSymptoms(loadInitial());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symptoms));
    } catch {
      /* quota or disabled — silently ignore */
    }
  }, [symptoms, hydrated]);

  const addSymptom = (entry: Omit<SymptomEntry, "id">) => {
    const newEntry: SymptomEntry = { ...entry, id: crypto.randomUUID() };
    setSymptoms((prev) => [newEntry, ...prev]);
    setLastAddedId(newEntry.id);
    // Clear the highlight after the pulse animation finishes (~3.5s).
    window.setTimeout(() => {
      setLastAddedId((curr) => (curr === newEntry.id ? null : curr));
    }, 3500);
  };

  const resetDemo = () => {
    setSymptoms(SYMPTOM_FEED);
    setLastAddedId(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ViewToggle value={view} onChange={setView} onReset={resetDemo} />
      <div
        // keying on `view` re-runs the entry animation on every toggle
        key={view}
        className="animate-[view-fade_300ms_cubic-bezier(0.22,1,0.36,1)_both]"
      >
        {view === "elderly" ? (
          <ElderlyDashboard symptoms={symptoms} onAddSymptom={addSymptom} />
        ) : (
          <CaregiverDashboard symptoms={symptoms} lastAddedId={lastAddedId} />
        )}
      </div>
      <DemoBadge />
      <Toaster position="top-center" />
    </div>
  );
}
