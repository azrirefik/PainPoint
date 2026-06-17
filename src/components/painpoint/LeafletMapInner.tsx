// Client-only map renderer. NEVER import this file at module top-level —
// import it via React.lazy / dynamic so SSR doesn't try to run Leaflet.
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Clinic, ClinicKind } from "@/lib/clinics";
import { KIND_LABEL, navigateUrl } from "@/lib/clinics";

const KIND_PIN_CLASS: Record<ClinicKind, string> = {
  da: "pp-pin pp-pin-teal",
  hospital: "pp-pin pp-pin-rose",
  gov: "pp-pin pp-pin-blue",
};

// SVG pin — color comes from CSS class (.pp-pin-teal/rose/blue), so no PNG needed.
const PIN_SVG = `
<svg viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path class="pin-body"
        d="M14 1C7.9 1 3 5.9 3 12c0 7.5 9.6 20.6 10 21.1.5.7 1.5.7 2 0C15.4 32.6 25 19.5 25 12 25 5.9 20.1 1 14 1z"
        stroke-width="1.5"/>
  <circle class="pin-dot" cx="14" cy="12" r="4.2"/>
</svg>
`;

function makePinIcon(kind: ClinicKind): L.DivIcon {
  return L.divIcon({
    className: KIND_PIN_CLASS[kind],
    html: PIN_SVG,
    iconSize: [28, 36],
    iconAnchor: [14, 34], // tip of the pin sits on the coordinate
    popupAnchor: [0, -28],
  });
}

type Props = {
  clinics: Clinic[];
  center: [number, number];
  zoom?: number;
};

export default function LeafletMapInner({ clinics, center, zoom = 13 }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      {clinics.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lng]} icon={makePinIcon(c.kind)}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>{c.name}</p>
              <p style={{ fontSize: 11, color: "oklch(0.55 0.04 257)", marginBottom: 6 }}>
                {KIND_LABEL[c.kind]} · {c.distance}
              </p>
              <a
                href={navigateUrl(c.lat, c.lng)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "var(--pp-teal)",
                  color: "white",
                  textDecoration: "none",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                ↗ Navigate
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
