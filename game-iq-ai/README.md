# Game IQ AI — Prototype

Mobile-first web app prototype for a premium DTC soccer video-analysis product
aimed at parents, coaches, and players.

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```
cd game-iq-ai
python3 -m http.server 8000
```

Then open http://localhost:8000 — use your browser's mobile viewport
(390x844) for the intended experience.

## Screens

| File | Screen |
| --- | --- |
| `index.html` | Landing page |
| `signup.html` | Sign up + 4-step onboarding (role, player profile, goals) |
| `upload.html` | Upload flow (MP4 / YouTube / public URL) with simulated analysis progress |
| `analysis.html` | Full analysis report (sample data) |
| `progress.html` | Season progress tracker |
| `pricing.html` | Pricing / paywall |

## Product decisions baked in

- **Persona-tailored reports**: every analysis is written three ways —
  parent (plain English), coach (tactical depth), player (direct,
  motivating). This is the core differentiator.
- **Confidence score**: each report states how trustworthy it is based on
  footage length, resolution, and player trackability. Builds trust and
  nudges users toward longer/better footage.
- **Subscription structure** (for the $50/month parent offer):
  - Free first analysis, no card — the report itself is the sales pitch.
  - 7-day free trial on paid plans, 30-day money-back guarantee.
  - **Pro Monthly $50/mo** and **Pro Annual $480/yr ($40/mo, save 20%)** —
    annual is the recommended default since development is season-long.
  - 4 full-match analyses per month (credits roll over 60 days) plus
    unlimited short training clips — predictable COGS, feels unlimited.
  - Off-season pause (annual only) instead of cancellation.
  - Sibling add-on at $15/mo to grow family LTV.

## Design system

- Single shared stylesheet (`styles.css`) with CSS variables; dark and
  light themes (`data-theme` on `<html>`, persisted to localStorage,
  defaults to system preference).
- Card-based layout, 52px minimum tap targets, max-width 480px column.
- No external dependencies, fonts, or images — system font stack and
  inline SVG icons only.

All analysis content is realistic sample data for a fictional U13
midfielder ("Jordan").
