# BestApply.app

**AI-powered Canadian job fit analysis.** Paste a job posting → get a fit score, matched strengths, real gaps, and a "should you apply?" recommendation with a ranked action plan.

Target market: Canada. Marketing angle: *"Tired of applying to jobs that never reply?"*

## Status: v0.1 MVP

- ✅ Single-file PWA — runs on Windows, Mac, Linux, iPhone, Android
- ✅ Installable to home screen (Add to Home / Install app)
- ✅ Fully offline app shell (service worker)
- ✅ Home / Analyze / Profile / History tabs
- ✅ Persistent profile stored in localStorage (courses & certs are appendable)
- ✅ BYOK (bring your own Anthropic key) — free tier during launch
- ⏳ Hosted subscription (C$7.99 Basic / C$14.99 Pro — priced in Canadian dollars) — worker endpoint pending
- ⏳ PayPal + USDT checkout — reuses Easy Prompt AI worker
- ⏳ 14-language brochure & install guide

## Running locally

Any static file server works:

```bash
cd bestapply
npx serve .
# or: python3 -m http.server 8000
```

Open `http://localhost:3000` (or your server's URL). Chrome will offer *Install app* from the address bar.

## Deploy

**Option A — GitHub Pages under easypromptai.net:** already served — path is `easypromptai.net/bestapply/`.

**Option B — Custom domain `bestapply.app`:** domain is registered at Namecheap (bought 2026-08-07). Add a `CNAME` file containing `bestapply.app` inside the `bestapply/` folder, then in Namecheap's Advanced DNS set the four `@` A records to GitHub Pages IPs (185.199.108.153 / .109.153 / .110.153 / .111.153) plus a `CNAME` for `www` → `mfatipey-netizen.github.io`. GitHub Pages issues a Let's Encrypt cert automatically once the `CNAME` propagates.

## Architecture

```
Browser (PWA)
  ├── User profile → localStorage
  ├── Job description → typed / pasted
  ├── Analysis → Claude Haiku 4.5 (direct browser call w/ BYOK key)
  └── Result & history → localStorage

Future:
  ├── /api/bestapply/analyze on Cloudflare Worker (proxies Claude, decrements quota)
  ├── /api/bestapply/subscription (PayPal / USDT)
  └── D1 for user credits (reusing Easy Prompt AI schema)
```

## What's next

- Worker endpoint that proxies Claude and enforces the C$7.99 / C$14.99 quotas
- Landing/marketing brochure (single-A4 PDF, same style as Zoom Live Subtitles)
- Cover-letter generation for Pro tier
- Interview-prep question packs for Pro tier
