export type ClinicKind = "da" | "hospital" | "gov";

export type Clinic = {
  id: string;
  name: string;
  kind: ClinicKind;
  lat: number;
  lng: number;
  distance: string; // pre-computed for the demo (no live geo)
};

export const KL_CENTER: [number, number] = [3.1319, 101.6841];

export const CLINICS: Clinic[] = [
  {
    id: "da-bangsar",
    name: "DA Clinic Bangsar",
    kind: "da",
    lat: 3.1295,
    lng: 101.6715,
    distance: "1.2 km",
  },
  {
    id: "pantai-bangsar",
    name: "Hospital Pantai Bangsar",
    kind: "hospital",
    lat: 3.1108,
    lng: 101.6653,
    distance: "2.5 km",
  },
  {
    id: "kk-bangsar",
    name: "Klinik Kesihatan Bangsar",
    kind: "gov",
    lat: 3.125,
    lng: 101.678,
    distance: "3.1 km",
  },
  {
    id: "da-midvalley",
    name: "DA Clinic Mid Valley",
    kind: "da",
    lat: 3.1178,
    lng: 101.6773,
    distance: "4.8 km",
  },
];

export const KIND_LABEL: Record<ClinicKind, string> = {
  da: "DA Partner",
  hospital: "Hospital",
  gov: "Gov Clinic",
};

export function navigateUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
