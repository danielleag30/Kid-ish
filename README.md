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

The app talks directly to an AI service from the browser — you bring an API key. Tap the **⚙️ gear** (it's guarded by a multiplication question so little fingers stay out) and pick one:

### Option A — ChatGPT (OpenAI API)
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and create an API key.
2. In the app settings choose **ChatGPT (OpenAI API)**, paste the key, keep the default model (`gpt-4o`) or pick another.

> ⚠️ **Heads up:** the OpenAI *API* is billed separately from a ChatGPT Pro subscription — a Pro plan does not include API credits. The good news: a 6-page story costs only a fraction of a cent on `gpt-4o-mini`, and a few cents on `gpt-4o`. Putting $5 of credit on an API account will make a *lot* of storybooks.

### Option B — Ollama Cloud
1. Sign up at [ollama.com](https://ollama.com) and create an API key at **ollama.com/settings/keys**.
2. In the app settings choose **Ollama Cloud**, paste the key. Default model is `gpt-oss:120b`.

### Option C — Custom
Any OpenAI-compatible `/v1/chat/completions` endpoint works: LM Studio, a home server running Ollama (start it with `OLLAMA_ORIGINS='*'` so the browser may call it), or your own proxy.

The key is stored **only in the browser's localStorage on that device** and is sent only to the API you configured.

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
