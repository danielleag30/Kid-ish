# Kid-ish

A hub of interactive web apps, one landing page linking out to each — story-making, reference charts, and a game companion, all built for actual daily use by an actual kid.

**Live:** [kid-ish.vercel.app](https://kid-ish.vercel.app)

---

## What's inside

| App | What it does | Route |
|---|---|---|
| 🌈 Allison's Storybook | AI writes and illustrates a picture book from a spoken or typed idea | `/allison-storybook` |
| 🌌 Galaxy Flowchart | Every Star Wars film/series, connected in chronological order | `/star-wars-flowchart` |
| 🐾 Warriors Character Charts | Cats, clans, and arcs across the novels | `/warriors-novels` |
| 📖 Warriors Comics | The graphic novel series, same treatment | `/warriors-gn` |
| 🌍 Warriors World Guide | Warrior Code, the Clans, a cat-dictionary, and a medicine-cat herb guide | `/warriors-guide` |
| 🎲 Warriors Fun & Games | Quizzes and a warrior name generator | `/warriors-fun` |
| ⚡ Phantom Royale | Fortnite cosmetics browser, locker, and a fully-researched lore timeline | [phantom-royale.vercel.app](https://phantom-royale.vercel.app) (separate deploy, see below) |

Six of these are single self-contained HTML files with no build step, routed by `vercel.json`. Phantom Royale is the exception — it's a real React app with its own build — see [Why Phantom Royale is different](#why-phantom-royale-is-different) below.

---

## 🌈 Allison's Storybook Maker

She tells it a story idea — by **talking** or typing — and the same model that writes the story draws it too: one hand-crafted SVG illustration per page, generated live as part of the same response.

- **Talk or type** an idea, or tap a suggestion chip
- **The model illustrates its own story** — no separate image-gen call. AI-generated SVG art is sanitized (scripts, event handlers, and external references stripped) before it's rendered
- **Swipe or tap** to turn pages, **🔊 Read to me!** to have it read aloud
- **On-device bookshelf** — stories persist in `localStorage`, no account
- **Four configurable model backends** — a Cloudflare Worker proxy (recommended), direct OpenAI, direct Ollama Cloud, or any OpenAI-compatible endpoint — picked from a parent-gated settings panel (a randomized multiplication question stands between the home screen and the API config)

### One-time setup (grown-ups) — Ollama Cloud via a free Cloudflare Worker

A browser can't call Ollama Cloud directly (no CORS headers) — the fix is a tiny free proxy that holds the key server-side and forwards the request. This is the recommended path; it also keeps the API key off the kid's device entirely.

1. **Get a key:** sign up at [ollama.com](https://ollama.com), create one at **ollama.com/settings/keys**.
2. **Create the Worker** (free, ~5 min): [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Workers → Create Worker**. Edit code, paste in [`worker.js`](./worker.js), deploy.
3. **Add the secret:** Settings → Variables and Secrets → type **Secret**, name `OLLAMA_API_KEY`, value = your key.
4. *(Recommended)* Lock it down: add a Text variable `ALLOWED_ORIGIN` set to your app's URL, so nobody else can ride your Worker.
5. **Point the app at it:** open the app → ⚙️ (answer the math question) → Provider: *Ollama Cloud — via Worker proxy* → paste your Worker URL → leave the API key blank → Save.

Other provider options (direct OpenAI, direct Ollama, or any custom OpenAI-compatible endpoint) are in the same settings panel — see the ⚙️ menu in-app.

---

## 🌌 Galaxy Flowchart

Every Star Wars film, live-action series, and animated series, laid out left to right across 7 color-coded eras — High Republic → Fall of the Republic → The Clone Wars → Imperial Era → Galactic Civil War → New Republic → Rise of the First Order. Hover any card for a plot summary; cross-era badges show real connections (Andor → Rogue One, Rebels → Ahsoka); a character web at the bottom traces 12 key characters across the whole saga. Pure HTML/CSS/JS, animated starfield, no build step.

## 🐾 Warriors — Character Charts, Comics, World Guide & Fun

Four pages covering the *Warriors* series in as much depth as the Star Wars flowchart covers its universe:

- **Character Charts** (`warriors-novels`) — cats, clans, and story arcs across the novels, filterable by Clan (ThunderClan, ShadowClan, WindClan, RiverClan, SkyClan, StarClan, and loners)
- **Comics** (`warriors-gn`) — the same treatment for the graphic novel adaptations
- **World Guide** (`warriors-guide`) — the Warrior Code, the five Clans plus StarClan, a cat-dictionary, and a medicine-cat herb guide
- **Fun & Games** (`warriors-fun`) — comprehension quizzes and a warrior-name generator

All four are age-banded for 6–12 and, like the Star Wars flowchart, are single static HTML files.

## ⚡ Phantom Royale

A Fortnite companion app: browse every cosmetic and the current item shop, track your locker (owned/favorited items, stored locally), and read a fully-researched storyline mode covering **34 lore entries across Chapters 1–6** — built by a two-stage agent pipeline (a research pass that cites its sources, a review pass that flags low-confidence entries rather than silently guessing).

**Live:** [phantom-royale.vercel.app](https://phantom-royale.vercel.app) · **Source:** [`/phantom-royale`](./phantom-royale)

### Why Phantom Royale is different

Every other app in this repo is a single HTML file with zero build step. Phantom Royale is a real React 19 + Vite + Tailwind 4 app with client-side routing (lobby, item shop, locker, storyline, chapter/map detail pages) and a PWA build — that doesn't fit the "just open the file" model the rest of this repo uses. Rather than force a framework build into the same static deploy as six no-build HTML pages, its source lives in this repo under `/phantom-royale` but **deploys as its own separate Vercel project**, with its own build step and its own URL. The landing page just links out to it.

```bash
cd phantom-royale
npm install
npm run dev      # local dev, http://localhost:5173
npm run build    # production build → dist/
```

---

## 🛡️ Kid-safety notes

- Storybook system prompt keeps stories sweet, age-appropriate, never scary.
- AI-generated SVG art is sanitized before rendering — scripts, event handlers, and external references stripped.
- Storybook settings are behind a grown-ups-only arithmetic gate.
- No analytics, no tracking. The only network calls are: the storybook's model request (to whichever endpoint you configure), and Phantom Royale's public cosmetics/shop data fetch (no key required).

## Deployment

The whole hub (everything except Phantom Royale) is one static site with clean URLs handled by [`vercel.json`](./vercel.json) rewrites — `/allison-storybook` → `allison-storybook.html`, and so on. Live at [kid-ish.vercel.app](https://kid-ish.vercel.app).

Any static host works the same way (Netlify, GitHub Pages, or even opening a file directly in Safari) — just note that GitHub Pages doesn't apply `vercel.json` rewrites, so the clean URLs (`/allison-storybook` etc.) would need an equivalent redirect rule, or you'd link to the `.html` files directly.

Phantom Royale deploys independently — see [above](#why-phantom-royale-is-different).

## 🧩 How the storybook works (for the curious)

One HTML file. On "Make my story!" it streams a `chat/completions` request to the configured endpoint. The model answers in a simple delimited format (`@@TITLE@@`, `@@PAGE@@` text, `@@ART@@` SVG, `@@END@@`) so pages can be parsed and previewed live as they stream in. Each page's SVG is sanitized with `DOMParser` and rendered inline. Finished books are kept in `localStorage`.
