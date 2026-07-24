# Phantom Royale

<p align="center">
  <img src="docs/hero-banner.png" alt="A stormy navy-and-gold lobby screen with a locker of collected cosmetics" width="700">
</p>

<p align="center">
  <strong>Every skin, every season, every chapter of the story — in one place, offline-friendly.</strong>
</p>

<p align="center">
  <em>A Fortnite companion app: cosmetics browser, locker, item shop, and a fully-researched lore timeline spanning 6 chapters.</em>
</p>

<p align="center">
  <a href="https://phantom-royale.vercel.app"><strong>Live →</strong></a>
</p>

---

## What it does

- **Cosmetics browser & search** — pulls the full item catalog live from [fortnite-api.com](https://fortnite-api.com), no key required
- **Locker** — mark items owned or favorited; stored locally, no account needed
- **Item shop** — today's shop, pulled the same way
- **Storyline mode** — a chapter-by-chapter, season-by-season lore recap, from Chapter 1 through Chapter 6
- **Daily random** — a random pick from the catalog
- **Offline-aware** — a banner surfaces when the network drops, and an onboarding overlay walks through the app on first launch
- **Installable PWA** — `vite-plugin-pwa` precaches assets for offline use

## The lore isn't guessed — it's researched and reviewed

`storyline` covers **34 entries across Chapters 1–6**, and the research behind it is checked in alongside the code:

- [`src/data/STORY_AGENT_REPORT.md`](./src/data/STORY_AGENT_REPORT.md) — a research pass that cites its sources (Fandom wiki, official Epic posts, esports/gaming press) and explicitly flags **low-** and **medium-confidence** entries where the sourcing was thin, rather than presenting everything with false certainty
- [`src/data/OVERSEER_REPORT.md`](./src/data/OVERSEER_REPORT.md) — a review pass over that research

Where a detail couldn't be confirmed (an uncertain trailer ID, a slogan with two possible names), the report says so explicitly instead of silently picking one. That discipline — write it, flag what's shaky, get it reviewed — is the same pattern this portfolio's other AI-heavy project ([Policy Navigator](https://github.com/danielleag30/policy-navigator-app)) applies to government documents instead of game lore.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Data | [fortnite-api.com](https://fortnite-api.com) (public, unauthenticated) |
| Local storage | Browser storage for owned/favorited items |
| PWA | `vite-plugin-pwa` |

## Project structure

```
phantom-royale/
├── src/
│   ├── context/AppContext.jsx     # Cosmetics fetch + owned/favorited state
│   ├── pages/
│   │   ├── DiscoverTab.jsx, SearchTab.jsx, CosmeticsBrowser.jsx
│   │   ├── LockerTab.jsx, ItemShop.jsx, DailyRandom.jsx
│   │   ├── Storyline.jsx, ChapterDetail.jsx
│   │   └── ModeMapDetail.jsx      # Reload / Blitz map detail
│   ├── data/
│   │   ├── lore.json               # 34 researched chapter/season entries
│   │   ├── STORY_AGENT_REPORT.md   # Research pass, sources + confidence flags
│   │   └── OVERSEER_REPORT.md      # Review pass
│   └── utils/api.js                 # fortnite-api.com client
└── public/maps/                       # Chapter/season map imagery
```

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Deployment note

This app lives inside the [Kid-ish](../README.md) monorepo but deploys as its **own** Vercel project (own build step, own URL) rather than as part of Kid-ish's single static-site deploy — see Kid-ish's README for why. `vercel.json` here just adds the SPA rewrite React Router needs (`/*` → `/index.html`) so deep links and refreshes don't 404.

## Status

Live. Storyline coverage runs through Chapter 6; the map-detail pages (Reload/Blitz) and daily-random pull from `blitz_maps.json`/`reload_maps.json`.
