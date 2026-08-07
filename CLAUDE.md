# CLAUDE.md — Project memory for JobFit

> **📍 THIS BRANCH: `project/jobfit` — the Canadian job-fit analyzer PWA.**
>
> Three products live in this repo, one per branch. Switch first, then work:
> - `project/easy-prompt-ai` — multilingual prompt builder (live at easypromptai.net)
> - `project/zoom-live-subtitles` — Windows overlay for real-time Zoom subtitles
> - `project/jobfit` — this one (Canadian job-fit analyzer PWA)
>
> Never edit files that belong to another project from this branch — the folder
> that matters here is `jobfit/`. `worker/` and root `index.html` belong to
> Easy Prompt AI; leave them alone here unless we're adding a JobFit endpoint
> to the shared Worker (see "Backend" below).

> این فایل حافظهٔ دائمی پروژه است. Claude Code آن را در شروع هر سشن خودکار می‌خواند.
> وقتی تصمیم مهمی گرفتیم، همین‌جا اضافه‌اش کن.

## What this is
JobFit — an AI-powered Canadian job-fit analyzer. Paste a job posting → get a fit
score, matched strengths, real gaps, and a "should you apply?" recommendation with
a ranked action plan. Persistent bilingual profile (resume, courses, certs, work
memory) stored locally.

Target market: Canada. Marketing angle: *"Tired of applying to jobs that never reply?"*

## 🌐 Domain — DECIDING
- **Original plan:** `jobfit.ca` — **lost in auction on 2026-07-15.**
- **Frontrunner candidate:** `myjobfit.ca` (available).
- Other options on the table: `jobfit.ai`, `fitjob.ca`, `jobmatch.ca`, `rolefit.ca`.
- **Action item:** pick the domain, then find/replace `jobfit.ca` across:
  - `jobfit/README.md` (marketing copy, deploy instructions)
  - `jobfit/index.html` (all page titles, meta tags, canonical URL)
  - `jobfit/manifest.webmanifest` (name, short_name, start_url)
  - `jobfit/sw.js` (any hard-coded URL)

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
- ⏳ Hosted subscription (**$5.99 Basic / $11.99 Pro**) — Worker endpoint pending
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
- **`jobfit/index.html`** — the entire PWA in one file (UI + analyze flow + profile).
- **`jobfit/data.js`** — NOC codes, StatCan job families, CRA-backed lists for Canadian
  job-code dropdowns.
- **`jobfit/manifest.webmanifest`** — PWA manifest (icons, name, colors, start_url).
- **`jobfit/sw.js`** — service worker (offline app shell).
- **`jobfit/README.md`** — public README; also the marketing text.

## Backend (planned, shared with EPAI Worker)
Reuses `worker/` from the Easy Prompt AI branch — same Cloudflare Worker, same D1.
When we add JobFit endpoints:
1. Add `/api/jobfit/analyze` and `/api/jobfit/subscription` handlers in
   `worker/src/index.js` on the `project/easy-prompt-ai` branch (that's where the
   Worker code lives / gets deployed from), NOT on this branch.
2. Add JobFit credit columns / plan rows to `worker/schema.sql`.
3. Cross-branch note: this branch's `jobfit/index.html` will call
   `https://api.easypromptai.net/api/jobfit/analyze` — the API domain stays shared.

## Deploy flow
- **Option A (current, easy):** GitHub Pages under easypromptai.net — served at
  `easypromptai.net/jobfit/`. No custom domain needed until we pick one.
- **Option B (once we pick the domain):** add `CNAME` file with `<new-domain>` inside
  `jobfit/` folder, point A records to GitHub Pages IPs
  (185.199.108.153 / .109.153 / .110.153 / .111.153).
- This branch never merges to `main` (main is Easy Prompt AI). To publish, we point
  the domain / Pages path at this branch OR at a dedicated `mfatipey-netizen/jobfit`
  repo if we want strict separation later.

## Conventions
- Single-file PWA style — all UI and logic inline in `jobfit/index.html`. Avoid
  bringing in a build step; match the existing compact style.
- Persian-first strings, then AI-translated where multilingual UI is needed.
- BYOK keys **never** touch our servers — they stay in the user's browser localStorage.
- When we ship paid tiers, all price gating and quota logic goes in the shared Worker,
  not in the browser.

## Testing
- No test suite. Manual QA:
  - `cd jobfit && npx serve .` → open `http://localhost:3000`.
  - Chrome offers "Install app" from the address bar.
- Sanity-check with `node --check jobfit/data.js jobfit/sw.js` before push.

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
| 3 | **JobFit** (this branch) | this repo, branch `project/jobfit` | v0.3 MVP — domain migration pending (jobfit.ca was auctioned off; picking new domain) |
| 4 | **YardPact** | `mfatipey-netizen/yardpact` (private) | landing live @ yardpact.netlify.app |
| 5 | **Crypto Trading Bot** | `mfatipey-netizen/crypto-trading-bot` (private) | dev; Kraken key was leaked → revoked; new keys ONLY in Cloudflare secrets |

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
