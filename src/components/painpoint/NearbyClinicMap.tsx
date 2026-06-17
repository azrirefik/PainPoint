import { Suspense, lazy, useEffect, useState } from "react";
import { CLINICS, KIND_LABEL, KL_CENTER, navigateUrl, type Clinic } from "@/lib/clinics";
import { cn } from "@/lib/utils";

// Lazy-load the Leaflet renderer so it never runs during SSR.
const LeafletMapInner = lazy(() => import("./LeafletMapInner"));

type Variant = "full" | "compact";

type Props = {
  /** "compact" = top-2 clinics for the emergency screen; "full" = all 4 + map for caregiver. */
  variant?: Variant;
  /** Limit to N entries; defaults to 2 for compact, 4 for full. */
  limit?: number;
  /** Override the title shown above the location line. */
  title?: string;
  /** Override the location subtitle. */
  locationLabel?: string;
  /** Optional override for the displayed clinic list (defaults to first N of CLINICS). */
  clinics?: Clinic[];
};

const KIND_BADGE: Record<Clinic["kind"], string> = {
  da: "bg-pp-teal/15 text-pp-teal-deep border-pp-teal/30",
  hospital: "bg-pp-alert/15 text-pp-alert border-pp-alert/30",
  gov: "bg-pp-blue/15 text-pp-blue border-pp-blue/30",
};

function MapPlaceholder({ height }: { height: number }) {
  return (
    <div
      className="grid w-full place-items-center rounded-2xl border border-border/60 bg-gradient-to-br from-pp-teal/5 to-pp-blue/5"
      style={{ height }}
      aria-hidden
    >
      <span className="text-xs font-medium text-muted-foreground">Loading map…</span>
    </div>
  );
}

export function NearbyClinicMap({
  variant = "full",
  limit,
  title,
  locationLabel = "Based on Ah Kong's location: Bangsar, KL",
  clinics: clinicsOverride,
}: Props) {
  const isCompact = variant === "compact";
  const effectiveLimit = limit ?? (isCompact ? 2 : 4);
  const clinics = clinicsOverride ?? CLINICS.slice(0, effectiveLimit);
  const mapHeight = isCompact ? 160 : 200;
  const heading = title ?? (isCompact ? "🏥 Nearest Hospital" : "📍 Nearby Clinics");

  // Only render the map after mount — avoids any SSR/hydration mismatch
  // (Leaflet creates DOM nodes that React's hydration would reject).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={cn("space-y-3", isCompact && "text-pp-ink")}>
      <div>
        <p
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            isCompact ? "text-white" : "text-foreground",
          )}
        >
          {heading}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[11px]",
            isCompact ? "text-white/85" : "text-muted-foreground",
          )}
        >
          📍 {locationLabel}
        </p>
      </div>

      {/* Map */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border shadow-sm",
          isCompact ? "border-white/30" : "border-border/60",
        )}
        style={{ height: mapHeight }}
      >
        {mounted ? (
          <Suspense fallback={<MapPlaceholder height={mapHeight} />}>
            <LeafletMapInner clinics={clinics} center={KL_CENTER} zoom={13} />
          </Suspense>
        ) : (
          <MapPlaceholder height={mapHeight} />
        )}
      </div>

      {/* Clinic list */}
      <ul className="space-y-2">
        {clinics.map((c) => (
          <li
            key={c.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition",
              isCompact
                ? "border-white/30 bg-white/15 text-white backdrop-blur"
                : c.kind === "da"
                  ? "pp-card border-pp-teal/30"
                  : "pp-card",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold tracking-tight">{c.name}</p>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    isCompact ? "border-white/40 bg-white/15 text-white" : KIND_BADGE[c.kind],
                  )}
                >
                  {KIND_LABEL[c.kind]}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    isCompact ? "text-white/85" : "text-muted-foreground",
                  )}
                >
                  {c.distance}
                </span>
              </div>
            </div>

            <a
              href={navigateUrl(c.lat, c.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow transition",
                isCompact ? "bg-white text-pp-alert hover:bg-white/90" : "pp-primary-button",
              )}
              aria-label={`Navigate to ${c.name}`}
            >
              <span aria-hidden>📍</span>
              Navigate
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
