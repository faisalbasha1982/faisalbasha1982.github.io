# Faisal AI Assistant

A drop-in AI chatbot for **faisalbinbasha.com** that answers visitor questions about your background, skills, certifications and services.

Three pieces:

1. **`chat-widget.js`** — floating chat button injected into your site
2. **`worker.js`** — Cloudflare Worker proxy that holds your API key and calls Claude
3. **`wrangler.toml`** — Worker config

The chatbot has all your professional details baked into the system prompt — no vector database or document indexing needed because everything fits.

---

## Why a backend proxy?

Anthropic's API key must never go in client-side code (anyone could read it and rack up charges on your account). The Worker holds the key and forwards conversations to Claude. Cloudflare Workers free tier covers ~100k requests/day, which is far more than a personal site will see.

---

## Setup (15 minutes)

### 1. Get an Anthropic API key

Sign up at https://console.anthropic.com → API Keys → Create. Add a few dollars of credit.

### 2. Deploy the Cloudflare Worker

```bash
# install wrangler if needed
npm install -g wrangler

# log in
wrangler login

# from this directory
wrangler secret put ANTHROPIC_API_KEY
# paste the key when prompted

wrangler deploy
```

You'll get a URL like `https://faisal-ai-assistant.your-subdomain.workers.dev`. Test it:

```bash
curl -X POST https://faisal-ai-assistant.your-subdomain.workers.dev/chat \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://faisalbinbasha.com' \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'
```

You should see SSE events stream back.

### 3. Wire the widget into your site

In `chat-widget.js`, replace the `ENDPOINT` constant with your Worker URL:

```javascript
const ENDPOINT = 'https://faisal-ai-assistant.your-subdomain.workers.dev/chat';
```

Upload `chat-widget.js` to your site's static files, then add this single line before `</body>` in your HTML:

```html
<script src="/chat-widget.js" defer></script>
```

That's it. Reload the site and you'll see a floating chat button bottom-right.

---

## Cost estimate

With **Claude Haiku 4.5** (set as the default in `worker.js`):

- ~$1 per ~1,000 typical chat exchanges
- Cloudflare Worker: free up to 100k requests/day
- A personal site is unlikely to spend more than a few dollars a month even with steady traffic

If you want higher-quality responses, change `MODEL` in `worker.js` to `'claude-sonnet-4-6'` — about 8× the cost but noticeably better reasoning.

---

## Updating the bot's knowledge

Whenever your CV, certifications, or services change, edit the `SYSTEM_PROMPT` constant in `worker.js` and redeploy:

```bash
wrangler deploy
```

No retraining, no embeddings to rebuild — the prompt is plain text.

---

## Customising

- **Look and feel** — the CSS is at the top of `chat-widget.js`. Background colours, accent (`#d4f0ff`), positioning are all there.
- **Greeting and suggestions** — edit `GREETING` and `SUGGESTIONS` in `chat-widget.js`.
- **Allowed origins** — `ALLOWED_ORIGINS` in `worker.js`. Add `http://localhost:8000` etc. for testing.
- **Conversation length cap** — `MAX_HISTORY_MSGS` (default 20) limits how long a single conversation can grow before old messages get trimmed.

---

## Hardening (optional, for later)

The current setup is fine for a personal site. If you start getting abuse:

1. **Rate limit** — Cloudflare's dashboard → your Worker → Settings → Rate Limiting. 30 req/min/IP is plenty.
2. **Turnstile** — add Cloudflare Turnstile (CAPTCHA replacement) to the widget. Free.
3. **Daily spend cap** — set a usage limit in the Anthropic Console.

---

## AWS Lambda alternative

If you'd rather keep it inside AWS (you're AWS-certified, after all), the same `worker.js` logic ports almost 1:1 to a Lambda + Function URL. The main differences:

- Read the API key from `process.env.ANTHROPIC_API_KEY` (Lambda environment variable, encrypted with KMS)
- Return a `ReadableStream` response with `awslambda.streamifyResponse` to get streaming
- Function URL has built-in CORS config

Worker is simpler and free for your scale, but Lambda + CloudFront keeps everything inside one cloud account.
