# 🌈 Allison's Storybook Maker

A magical picture-storybook app for Allison (age 7). She tells it a story idea — by **talking** 🎤 or typing — and the AI writes a gentle, silly story **and draws an illustration for every page**, which she can flip through like a real book and have read aloud to her.

Everything is one file (`index.html`). No build step, no server, no accounts. Stories are saved on the device in a little bookshelf.

## ✨ What Allison can do

- **Talk her idea** with the microphone button (uses iPad's built-in speech recognition)
- Tap a **suggestion chip** ("A unicorn who loves pancakes" …) if she's stuck
- Watch pages get **drawn live** while the story is being made
- **Swipe** or tap arrows to turn pages
- Tap **🔊 Read to me!** and the iPad reads the page aloud
- Reopen any saved book from **📚 My Storybooks**

## 🔧 One-time setup (grown-ups)

A browser (like Safari on the iPad) can't call Ollama Cloud directly — Ollama Cloud doesn't send the CORS headers a browser requires, so the request gets blocked. The fix is a **tiny free proxy** (a Cloudflare Worker) that sits in the middle: it holds your Ollama key safely on a server, adds the CORS header the iPad needs, and forwards the request. This is the **recommended** path — it also keeps your API key off the kid's device.

### Step by step — Ollama Cloud via a free Cloudflare Worker

**A. Get an Ollama Cloud key**
1. Sign up at [ollama.com](https://ollama.com).
2. Create an API key at **ollama.com/settings/keys** and copy it.

**B. Create the Worker** (free, ~5 minutes)
1. Make a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. In the dashboard: **Workers & Pages → Create → Workers → Create Worker**. Give it a name (e.g. `allison-stories`) and click **Deploy**.
3. Click **Edit code**. Delete the sample code, then paste the entire contents of [`worker.js`](./worker.js) from this repo. Click **Deploy** again.
4. Add your key as a secret: **Settings → Variables and Secrets → Add**.
   - Type **Secret**, name **`OLLAMA_API_KEY`**, value = the key from step A. Save/Deploy.
5. *(Recommended)* Lock it to your app so nobody else can use your Worker:
   - Add another variable (type **Text**), name **`ALLOWED_ORIGIN`**, value = your app's address, e.g. `https://danielleag30.github.io` (no trailing slash, no path). Save/Deploy.
6. Copy your Worker URL — it looks like `https://allison-stories.<your-name>.workers.dev`.

**C. Point the app at the Worker**
1. Open the app, tap **⚙️** (answer the multiplication question).
2. Provider: **Ollama Cloud — via Worker proxy (recommended)**.
3. **API base URL** = your Worker URL from step B6.
4. Leave **API key** blank (the Worker holds it). Pick a model (default `gpt-oss:120b`). **Save**.

That's it — Allison can now make stories.

### Other options (in the ⚙️ menu)

- **ChatGPT (OpenAI API, direct):** create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys), choose this option, paste the key. ⚠️ The OpenAI *API* is billed separately from a ChatGPT Pro subscription — Pro does **not** include API credits. (A 6-page story is a fraction of a cent on `gpt-4o-mini`; $5 of credit makes a *lot* of stories.) This calls the API straight from the browser and may be blocked by CORS depending on OpenAI's current rules — if stories won't load, put a Worker in front of it the same way (point `OLLAMA_URL` in `worker.js` at OpenAI instead).
- **Ollama Cloud (direct):** calls Ollama Cloud straight from the iPad. Usually blocked by the browser — use the Worker option instead.
- **Custom:** any OpenAI-compatible `/chat/completions` endpoint (a proxy, LM Studio, or a home Ollama started with `OLLAMA_ORIGINS='*'`).

Any key you enter is stored **only in the browser's localStorage on that device** and is sent only to the URL you configured. With the Worker option there's no key on the device at all.

## 📱 Getting it on her iPad

The easiest way is GitHub Pages (free):

1. In this repo on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
2. After a minute the app is live at `https://<your-username>.github.io/Kid-ish/`.
3. Open that link in **Safari on the iPad** → tap the **Share** button → **Add to Home Screen**.
4. It now launches full-screen like a real app. Do the ⚙️ setup once on the iPad and you're done.

(Any static host works the same way — Netlify, Vercel, or even AirDropping the file and opening it in Safari.)

## 🛡️ Kid-safety notes

- The system prompt instructs the model to keep stories sweet, age-appropriate, and never scary.
- AI-generated SVG art is sanitized before rendering (scripts, event handlers, and external references are stripped).
- Settings are behind a grown-ups-only arithmetic gate.
- No analytics, no tracking, no data leaves the device except the story request to your chosen API.

## 🧩 How it works (for the curious)

One HTML file. On "Make my story!" it streams a `chat/completions` request to the configured endpoint. The model answers in a simple delimited format (`@@TITLE@@`, `@@PAGE@@` text, `@@ART@@` SVG, `@@END@@`) so pages can be parsed and previewed live as they stream in. Each page's SVG is sanitized with `DOMParser` and rendered inline. Finished books are kept in `localStorage`.
