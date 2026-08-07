# CLAUDE.md — Project memory for BestApply.app

> **📍 THIS BRANCH: `project/jobfit` — the Canadian job-fit analyzer PWA (branded BestApply.app).**
>
> Three products live in this repo, one per branch. Switch first, then work:
> - `project/easy-prompt-ai` — multilingual prompt builder (live at easypromptai.net)
> - `project/zoom-live-subtitles` — Windows overlay for real-time Zoom subtitles
> - `project/jobfit` — this one (Canadian job-fit analyzer PWA, brand = BestApply.app)
>
> Never edit files that belong to another project from this branch — the folder
> that matters here is `bestapply/`. `worker/` and root `index.html` belong to
> Easy Prompt AI; leave them alone here unless we're adding a BestApply endpoint
> to the shared Worker (see "Backend" below).
>
> (Historical note: this branch is still named `project/jobfit` because that's
> where the code lives; the product itself was rebranded from JobFit to
> BestApply.app after `jobfit.ca` was lost in auction 2026-07-15. If you want,
> ask the user before renaming the branch to `project/bestapply`.)

> این فایل حافظهٔ دائمی پروژه است. Claude Code آن را در شروع هر سشن خودکار می‌خواند.
> وقتی تصمیم مهمی گرفتیم، همین‌جا اضافه‌اش کن.

## What this is
BestApply.app — an AI-powered Canadian job-fit analyzer. Paste a job posting → get
a fit score, matched strengths, real gaps, and a "should you apply?" recommendation
with a ranked action plan. Persistent bilingual profile (resume, courses, certs,
work memory) stored locally.

Target market: Canada. Marketing angle: *"Tired of applying to jobs that never reply?"*

## 🌐 Domain — REGISTERED: `bestapply.app`
- **Original plan:** `jobfit.ca` — **lost in auction on 2026-07-15.**
- **First replacement:** briefly picked `bestapply.ca`, but the user is on a
  Canadian work permit and **CIRA's Canadian Presence Requirements do not
  accept work-permit holders** as individual registrants (only citizens, PRs,
  Canadian corporations, or trademark holders qualify). Registering `.ca` would
  have risked CIRA revoking the domain on audit.
- **Chosen:** **`bestapply.app`** — no residency requirement, Google-run TLD
  with HTTPS/HSTS enforced by default, natural fit for a product name
  ("bestapply.app"). Trademark cleared at CIPO (search returned 0 hits).
  `.com` was walked away from because it's on GoDaddy Broker at ~C$22,886.
- **Registered:** Namecheap, 2026-08-07. Order #210454195. Auto-renew ON.
  Free Domain Privacy (WhoisGuard) enabled — WHOIS shows Namecheap proxy, not
  the user's Toronto address / gmail.
- **Rebrand applied:** All references in `bestapply/*` and this file were
  renamed from `JobFit` / `jobfit.ca` to `BestApply` / `bestapply.app`. The old
  `localStorage` key `jobfit.v1` is migrated one-time to `bestapply.v1` inside
  `bestapply/index.html` so existing users don't lose data.
- **Still to do:** DNS (point `bestapply.app` at GitHub Pages — see Deploy),
  optional Cloudflare in front for caching, backend endpoints on the shared
  Worker, and later `bestapply.ca` too once the user is a PR (redirect `.ca` → `.app`).

## Status: v0.3 MVP
- ✅ Single-file PWA — Windows, Mac, Linux, iPhone, Android
- ✅ Installable to home screen (Add to Home / Install app)
- ✅ Fully offline app shell (service worker)
- ✅ Home / Analyze / Profile / History tabs
- ✅ Persistent profile in localStorage (courses & certs are appendable)
- ✅ Resume upload
- ✅ NOC / StatCan / CRA-backed dropdowns for Canadian job-code accuracy
- ✅ Multi-language profile (answer language = profile language)
- ✅ Account pill + plan meter, job memory
- ✅ BYOK (bring your own Anthropic key) — free tier during launch
- ⏳ Hosted subscription (**C$7.99 Basic / C$14.99 Pro** — priced in Canadian dollars to lean into the Canada-first positioning) — Worker endpoint pending
- ⏳ PayPal + USDT checkout — reuses Easy Prompt AI Worker
- ⏳ 14-language brochure & install guide

## Architecture
```
Browser (PWA)
  ├── User profile → localStorage
  ├── Job description → typed / pasted
  ├── Analysis → Claude Haiku 4.5 (direct browser call w/ BYOK key)
  └── Result & history → localStorage

Planned:
  ├── /api/jobfit/analyze on shared Cloudflare Worker (proxies Claude, decrements quota)
  ├── /api/jobfit/subscription (PayPal / USDT)
  └── D1 for user credits (reusing Easy Prompt AI schema)
```

## Files (in this branch, only edit these)
- **`bestapply/index.html`** — the entire PWA in one file (UI + analyze flow + profile).
- **`bestapply/data.js`** — NOC codes, StatCan job families, CRA-backed lists for Canadian
  job-code dropdowns.
- **`bestapply/manifest.webmanifest`** — PWA manifest (icons, name, colors, start_url).
- **`bestapply/sw.js`** — service worker (offline app shell).
- **`bestapply/README.md`** — public README; also the marketing text.

## Backend (planned, shared with EPAI Worker)
Reuses `worker/` from the Easy Prompt AI branch — same Cloudflare Worker, same D1.
When we add BestApply endpoints:
1. Add `/api/bestapply/analyze` and `/api/bestapply/subscription` handlers in
   `worker/src/index.js` on the `project/easy-prompt-ai` branch (that's where the
   Worker code lives / gets deployed from), NOT on this branch.
2. Add BestApply credit columns / plan rows to `worker/schema.sql`.
3. Cross-branch note: this branch's `bestapply/index.html` will call
   `https://api.easypromptai.net/api/bestapply/analyze` — the API domain stays shared.

## Deploy flow
- **Option A (current, easy):** GitHub Pages under easypromptai.net — served at
  `easypromptai.net/bestapply/`. Works today, no custom domain needed until we
  buy `bestapply.app`.
- **Option B (once the domain is bought):** add a `CNAME` file containing
  `bestapply.app` inside the `bestapply/` folder, then point A records to GitHub
  Pages IPs (185.199.108.153 / .109.153 / .110.153 / .111.153).
- This branch never merges to `main` (main is Easy Prompt AI). To publish, we
  point the domain / Pages path at this branch OR spin up a dedicated
  `mfatipey-netizen/bestapply` repo if we want strict separation later.

## Conventions
- Single-file PWA style — all UI and logic inline in `bestapply/index.html`. Avoid
  bringing in a build step; match the existing compact style.
- Persian-first strings, then AI-translated where multilingual UI is needed.
- BYOK keys **never** touch our servers — they stay in the user's browser localStorage.
- When we ship paid tiers, all price gating and quota logic goes in the shared Worker,
  not in the browser.

## Testing
- No test suite. Manual QA:
  - `cd bestapply && npx serve .` → open `http://localhost:3000`.
  - Chrome offers "Install app" from the address bar.
- Sanity-check with `node --check bestapply/data.js bestapply/sw.js` before push.

---

## Other projects owned by this user

This user (`mfatipey-netizen`, m.f.atipey@gmail.com) has **multiple active projects**.
Central profile is in Google Drive: **`PROFILE.md`** at
<https://drive.google.com/file/d/1fq7wgV2lsuKDGK4xXN2Q0lqs7xVxiIoM/view>.
Quick-reference command cheat-sheet: **`COMMANDS`** Google Sheet at
<https://docs.google.com/spreadsheets/d/18II5XKRxCtI_whmFwFvTlQSnmIDDMDesO-W8nNhBIsE/edit>.

| # | Project | Where the code lives | Status |
|---|---|---|---|
| 1 | **Easy Prompt AI** | this repo, branch `project/easy-prompt-ai` | live @ easypromptai.net |
| 2 | **Zoom Live Subtitles** | this repo, branch `project/zoom-live-subtitles` | .exe released, `$9.99/month` pricing planned (device-bound license) |
| 3 | **BestApply.app** (this branch, formerly JobFit) | this repo, branch `project/jobfit`, folder `bestapply/` | v0.3 MVP rebranded; domain purchase + backend endpoints pending |
| 4 | **YardPact** | `mfatipey-netizen/yardpact` (private) | landing live @ yardpact.netlify.app |
| 5 | **Crypto Trading Bot** | `mfatipey-netizen/crypto-trading-bot` (private) | dev; Kraken key was leaked → revoked; new keys ONLY in Cloudflare secrets |

## Shared accounts (used across products)

- **Personal Gmail:** `m.f.atipey@gmail.com` — the user's day-to-day account;
  domain registrant contact at Namecheap; GitHub `mfatipey-netizen`.
- **Business Gmail + PayPal Business:** `easypromptai2026@gmail.com` — separate
  account created specifically to hold the **PayPal Business** used across all
  paid products (Easy Prompt AI, BestApply.app, Zoom Live Subtitles). All
  customer payments flow through this PayPal account, and its business
  credentials (client ID / secret) go into Cloudflare Worker Secrets on the
  `project/easy-prompt-ai` branch. When wiring up any new checkout / webhook
  flow, this is the merchant identity — never a personal PayPal.
- Also billed the Namecheap purchase of `bestapply.app` (2026-08-07, order
  #210454195) so the domain lives under the same business email trail.

## Sync convention (do this after every commit)

After a commit lands in any of the above repos:

1. **Update Drive** — upload the changed files to the matching subfolder in
   the master Drive folder <https://drive.google.com/drive/folders/1mAz8W1I5IkVUiXvuZnV56T_0Yds4G1__>.
2. **Bump the profile** — if the commit changed the project's status,
   pricing, architecture, or a "decided" item, edit `PROFILE.md` and re-upload it
   to Drive root.
3. **Add new commands to `COMMANDS`** — if a new frequently-used command showed
   up in the workflow, append a row to `COMMANDS.csv` and re-upload to Drive.

## Golden rules

- **Language for chat with this user: Persian.** Code, commit messages, PR bodies: English.
- **Never commit API keys.** BYOK keys stay in the user's browser localStorage.
- **Never open a PR unless explicitly asked.**
- **Never push straight to `main`.** This project stays on `project/jobfit`;
  it does not squash to `main` (main is Easy Prompt AI territory).
- **Before push, run `node --check` on any JS changed** (Worker files especially,
  when we add JobFit backend endpoints on the EPAI branch).
- **Stay on the branch that matches the project you're working on.** Never edit files
  that belong to another project from this branch.
