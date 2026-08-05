# CLAUDE.md — Project memory for Easy Prompt AI

> این فایل حافظهٔ دائمی پروژه است. Claude Code آن را در شروع هر سشن خودکار می‌خواند،
> پس لازم نیست هر بار همه‌چیز را یادآوری کنی. وقتی تصمیم مهمی گرفتیم، همین‌جا اضافه‌اش کن.

## What this is
Easy Prompt AI — a multilingual "professional prompt builder." The user answers ~20
adaptive questions for a chosen topic and gets a structured, ready-to-use prompt in any
of 13 languages. Persian is the primary language (the question bank is authored in
Persian; other languages are AI-translated and cached).

Live: frontend at **easypromptai.net**, API at **api.easypromptai.net**.

## Architecture
- **`index.html`** — the entire frontend in one file (UI + thin API client). No build step.
- **`worker/src/index.js`** — Cloudflare Worker backend (all API endpoints, pricing,
  entitlement, AI calls, TTS). Secrets/logic live here so they can't be read from the browser.
- **`worker/src/engine.js`** — the prompt engine (`nextQuestion`, `generatePrompt`, categories).
- **`worker/wrangler.toml`** — Worker config + D1 binding. Root dir for builds is `worker/`.
- **D1 database** (binding `DB`) — stores codes, payments, feedback, history, and the
  `i18n` translation cache.

## Deploy flow (important)
- Cloudflare **Workers Builds** is connected to this GitHub repo. **Any push to `main`
  auto-deploys** the Worker (build: `npm install`, deploy: `npx wrangler deploy`, root: `worker`).
- So the workflow is: develop on the feature branch → open PR → **squash-merge to `main`**
  → Cloudflare deploys within ~1–2 min. Check Worker → **Deployments** for the green build.
- Adding/editing a secret in the dashboard also creates a new active version (on top of the
  currently deployed code) — it does NOT deploy new code by itself.
- Frontend (`index.html`) is served separately (GitHub Pages / custom domain easypromptai.net).

## Branch & git convention
- Develop on branch **`claude/ai-prompt-generator-app-sxpbno`**, PR into `main`, squash-merge.
- Because we squash-merge, the feature branch diverges from `main` after each merge. Next
  change: `git fetch origin main && git merge origin/main`, resolve the TTS block conflicts
  by keeping the newest version, then continue.

## Secrets / env (set in Cloudflare → Settings → Variables and secrets — NEVER commit values)
- `ADMIN_TOKEN`, `ANTHROPIC_API_KEY` (Claude), `AI_MODEL`, `ALLOWED_ORIGIN` (CSV of origins)
- `PAYPAL_CLIENT_ID` / `PAYPAL_SECRET` / `PAYPAL_ENV=live`, `PRICE_USDT`
- `USDT_TRC20_ADDRESS` / `USDT_ERC20_ADDRESS` / `USDT_BEP20_ADDRESS` / `USDT_ARB_ADDRESS`
- **`AZURE_TTS_KEY`** (secret) + **`AZURE_TTS_REGION`** = `canadacentral` — for voice.

## Voice / TTS (current state)
- Endpoint **`POST /api/tts`** in `worker/src/index.js` → Azure Neural TTS → returns MP3.
  Works in every language on any device (server-generated, not dependent on browser voices).
- Frontend tries server TTS first; falls back to browser `speechSynthesis` if the Azure key
  is missing. **Read-aloud is ON by default** (`epai_voice`).
- Each language uses its **native male voice** (map `TTS_VOICE`); natural pitch, only a
  gentle `rate='-4%'` slow-down. Do NOT re-add a pitch shift — it garbled Persian.
- We tried one shared multilingual voice (Andrew) — rejected: it only truly covers a few
  languages and fell back to a default (female) voice for Persian and others.
- **Open item:** Azure's only male Persian voice (`fa-IR-FaridNeural`) is mediocre. If the
  user wants more natural Persian, connect Google Chirp3-HD or ElevenLabs **for `fa` only**
  (keep other languages on Azure) via the per-language override in `TTS_VOICE`.

## Conventions
- Match the surrounding code style; both source files favor compact, single-file code.
- Question bank is Persian-first; UI strings and questions for other languages are
  AI-translated and cached in D1 under `I18N_VERSION` (bump it when Persian wording changes).
- Keep changes server-side when they involve secrets or logic that shouldn't be in the browser.

## Testing
- No committed test suite. Sanity-check the Worker with `node --check worker/src/index.js`
  and `worker/src/engine.js` before pushing. (A throwaway mocked-D1 harness has been used
  ad hoc in the session scratchpad.)

---

## Other projects owned by this user

This user (`mfatipey-netizen`, m.f.atipey@gmail.com) has **4 active projects**.
Central profile is in Google Drive: **`PROFILE.md`** at
<https://drive.google.com/file/d/1fq7wgV2lsuKDGK4xXN2Q0lqs7xVxiIoM/view>.
Quick-reference command cheat-sheet: **`COMMANDS`** Google Sheet at
<https://docs.google.com/spreadsheets/d/18II5XKRxCtI_whmFwFvTlQSnmIDDMDesO-W8nNhBIsE/edit>.

| # | Project | Where the code lives | Status |
|---|---|---|---|
| 1 | **Easy Prompt AI** | this repo | live @ easypromptai.net |
| 1a | **Zoom Live Subtitles** | this repo, `zoom-translator/` sub-folder | .exe released, `$9.99/month` pricing planned (device-bound license) |
| 2 | **JobFit.ca** | `mfatipey-netizen/jobfit` (private) | v0.1 MVP, BYOK works, paid tiers pending |
| 3 | **YardPact** | `mfatipey-netizen/yardpact` (private) | landing live @ yardpact.netlify.app |
| 4 | **Crypto Trading Bot** | `mfatipey-netizen/crypto-trading-bot` (private) | dev; Kraken key was leaked → revoked; new keys ONLY in Cloudflare secrets |

## Sync convention (do this after every commit)

After a commit lands in any of the above repos:

1. **Update Drive** — upload the changed files to the matching subfolder in
   the master Drive folder <https://drive.google.com/drive/folders/1mAz8W1I5IkVUiXvuZnV56T_0Yds4G1__>.
   (Drive is a backup, not source of truth; my tool only has `create_file`, so each
   update stacks a new revision alongside the old one — periodic manual cleanup.)
2. **Bump the profile** — if the commit changed the project's status,
   pricing, architecture, or a "decided" item, edit `PROFILE.md` and re-upload it
   to Drive root.
3. **Add new commands to `COMMANDS`** — if a new frequently-used command showed
   up in the workflow, append a row to `COMMANDS.csv` (in this repo) and re-upload
   to Drive.

## Golden rules

- **Language for chat with this user: Persian.** Code, commit messages, PR bodies: English.
- **Never commit secrets.** They live in Cloudflare Worker Secrets only.
- **Never open a PR unless explicitly asked.**
- **Never push straight to `main`.** Feature branch → PR → squash-merge.
- **Before push, run `node --check` on any JS changed** (Worker files especially).
