# PainPoint

Built at the Lovable x AWS Hackathon 2026 (Healthcare Track). Malaysia has 130+ languages and dialects. Elderly patients show up to clinics speaking Hokkien, Cantonese, Tamil, or BM, but their doctors don't. When they're in pain, they can't explain what's wrong.

PainPoint is a dialect-aware health companion. Elderly users tap a body map to report pain, speak symptoms in their dialect (Hokkien, Cantonese, Mandarin, BM, English), and the app translates everything into structured medical context for caregivers and doctors.

## What it does

- **Elderly dashboard** - tap a body map for pain location/severity/type. Voice input via Web Speech API with OpenAI Whisper fallback. Medication logging. Daily readings.
- **Caregiver dashboard** - symptom history, doctor appointment booking, nearby clinic map (Leaflet), export.

## Stack

| | |
|---|---|
| Framework | TanStack Start (React 19 + Cloudflare) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Maps | Leaflet + React-Leaflet |
| AI | Web Speech API + OpenAI Whisper + GPT-4o |

## Running locally

```bash
bun install
cp .env.example .env   # add your OpenAI key
bun run dev
```

## What I learned

- Web Speech API recognition quality varies wildly across browsers and dialects. The Whisper fallback isn't optional, it's necessary.
- Building a multi-language UI with reactive i18n (not framework-based) is messier than it sounds. State management for 5 languages + RTL-ish layout + elderly-friendly font sizes.
- SSR-safe localStorage hydration in TanStack Start caught me off guard. Hydration mismatches everywhere until I deferred client state to useEffect.
- Designing for elderly users is a different discipline. Big tap targets, high contrast, no nested menus, no swipe gestures.
