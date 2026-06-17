import { t, type Lang } from "@/lib/i18n";
import { NearbyClinicMap } from "../NearbyClinicMap";
import { CLINICS } from "@/lib/clinics";

type Props = {
  onDismiss: () => void;
  lang?: Lang;
};

// On the emergency screen we want hospitals first, not DA clinics —
// pull Hospital Pantai + Klinik Kesihatan in that order.
const EMERGENCY_CLINICS = [
  CLINICS.find((c) => c.id === "pantai-bangsar")!,
  CLINICS.find((c) => c.id === "kk-bangsar")!,
];

export function EmergencyScreen({ onDismiss, lang = "en" }: Props) {
  const tr = t(lang);
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto px-6 pt-10 pb-8 text-white"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, oklch(0.78 0.2 25) 0%, oklch(0.6 0.2 25) 100%)",
        animation: "view-fade 220ms ease-out both",
      }}
    >
      <div className="text-center">
        <div
          className="grid h-20 w-20 place-items-center rounded-full bg-white/15 text-5xl shadow-inner backdrop-blur"
          style={{ margin: "0 auto" }}
        >
          ⚠️
        </div>
        <h1 className="font-display mt-4 text-4xl font-medium tracking-tight">
          {tr.emergencyTitle}
        </h1>
        <p className="mt-3 text-xl font-medium leading-snug">{tr.emergencyMessage}</p>
      </div>

      <div className="mt-6 w-full space-y-4">
        <a
          href="tel:999"
          className="pp-success-button font-display flex h-20 items-center justify-center rounded-2xl text-3xl font-semibold tracking-tight"
        >
          {tr.emergencyCall999}
        </a>

        {/* Compact map of nearest hospitals */}
        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
          <NearbyClinicMap variant="compact" clinics={EMERGENCY_CLINICS} />
        </div>

        <div className="rounded-xl bg-white/20 px-4 py-3 text-center text-base font-semibold backdrop-blur">
          {tr.emergencyAlertSent}
        </div>
        <button
          onClick={onDismiss}
          className="h-14 w-full rounded-2xl border-2 border-white/70 bg-white/5 text-lg font-bold backdrop-blur transition hover:bg-white/15"
        >
          {tr.emergencyDismiss}
        </button>
      </div>
    </div>
  );
}
