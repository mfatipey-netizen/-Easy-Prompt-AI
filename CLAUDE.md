# CLAUDE.md — Project memory for Zoom Live Subtitles

> **📍 THIS BRANCH: `project/zoom-live-subtitles` — the Windows overlay app.**
>
> Three products live in this repo, one per branch. Switch first, then work:
> - `project/easy-prompt-ai` — multilingual prompt builder (live at easypromptai.net)
> - `project/zoom-live-subtitles` — this one (Windows overlay for real-time Zoom subtitles)
> - `project/jobfit` — JobFit.ca PWA
>
> Never edit files that belong to another project from this branch — the two folders
> that matter here are `zoom-translator/` and `.github/workflows/build-zoom-translator.yml`.
> `worker/` and `index.html` belong to Easy Prompt AI; leave them alone here.

> این فایل حافظهٔ دائمی پروژه است. Claude Code آن را در شروع هر سشن خودکار می‌خواند.
> وقتی تصمیم مهمی گرفتیم، همین‌جا اضافه‌اش کن.

## What this is
Zoom Live Subtitles — a Windows-only Electron overlay that shows real-time subtitles on
top of Zoom (or any app playing audio) without needing the Zoom host's Live Translation
feature turned on. Captures system-loopback audio, transcribes with Deepgram, translates
with Claude Haiku 4.5.

Market: sold as a standalone Windows installer. Planned pricing: `$9.99/month`
(device-bound license). Marketing angle: "بدون نیاز به فعال بودن ترجمهٔ زمان‌واقعی در حساب
میزبان جلسه — روی هر جلسه‌ای کار می‌کند."

## Architecture
```
Windows loopback (getDisplayMedia + system audio)
  → 48 kHz mono float32
  → downsample به 16 kHz Int16 (linear16)
  → WebSocket به Deepgram Nova-3 (interim + final + utterance_end)
  → روی هر utterance نهایی → Claude Haiku 4.5 برای ترجمه به زبان هدف
  → درج در نوار زیرنویس (RTL برای فارسی/عربی)
```

## Files (in this branch, only edit these)
- **`zoom-translator/main.js`** — Electron main process (window, tray, IPC, click-through).
- **`zoom-translator/preload.js`** — IPC bridge.
- **`zoom-translator/src/overlay.html` / `overlay.js`** — the transparent always-on-top
  subtitle overlay + the audio capture + Deepgram WebSocket + Claude translation.
- **`zoom-translator/src/settings.html`** — settings window (API keys, source/target lang).
- **`zoom-translator/package.json`** — electron-builder config (Windows portable + nsis).
- **`zoom-translator/marketing/`** — bilingual A4 brochure + install guide (HTML + PDF build).
- **`.github/workflows/build-zoom-translator.yml`** — CI: builds Windows installer on push
  and publishes as a **rolling `dev` prerelease** so the installer is always downloadable
  from GitHub Releases without a manual tag.

## Keys the user needs (they enter these in the app's Settings window; NEVER commit them)
- **Deepgram API key** — <https://console.deepgram.com/signup> ($200 free credit)
- **Anthropic API key** — <https://console.anthropic.com/settings/keys>

Both live in `electron-store` on the user's machine only.

## Supported languages (14 source × 14 target)
English · فارسی · 中文 · Русский · العربية · Türkçe · Français · Italiano · Deutsch ·
Español · 日本語 · 한국어 · Português · हिन्दी · Nederlands

## Deploy flow
- CI (`.github/workflows/build-zoom-translator.yml`) builds on every push to this branch
  and publishes a rolling `dev` prerelease with the installer.
- User downloads from: <https://github.com/mfatipey-netizen/-Easy-Prompt-AI/releases>
- Manual release: bump `zoom-translator/package.json` version, tag, push tag.

## Cost model
- Deepgram Nova-3 streaming: ~$0.0077/min → ~$0.46/hour
- Claude Haiku 4.5: ~$0.02/hour translation
- **Total ~$0.5/hour** of meeting

## Conventions
- Windows-only for now (loopback capture uses `getDisplayMedia({audio:true})` which is
  Windows/Chrome-specific behavior). Do NOT try to port to macOS via the same API —
  needs BlackHole / a virtual audio device.
- Overlay must stay **click-through by default** when locked so users can click Zoom
  behind it (implemented via `setIgnoreMouseEvents(true, {forward:true})`; hover on the
  control bar temporarily disables it).
- Persian/Arabic subtitles → RTL text direction. All other languages → LTR.
- Keep the overlay dependency-free of Node modules that need native compilation —
  only pure JS to keep the Windows build fast.

## Testing
- No test suite. Manual QA on Windows:
  - `cd zoom-translator && npm install && npm start`
  - Enter both keys, start a Zoom call, hit Start on the overlay, share screen with
    "Share system audio" enabled.
- Sanity-check with `node --check zoom-translator/src/overlay.js` before push.

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
| 2 | **Zoom Live Subtitles** (this branch) | this repo, branch `project/zoom-live-subtitles` | .exe released, `$9.99/month` pricing planned (device-bound license) |
| 3 | **JobFit** | this repo, branch `project/jobfit` | v0.3 MVP — domain migration pending (jobfit.ca was auctioned off; picking new domain) |
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
- **Never commit API keys.** They live in `electron-store` on the user's machine.
- **Never open a PR unless explicitly asked.**
- **Never push straight to `main`.** This project stays on `project/zoom-live-subtitles`;
  it does not squash to `main` (main is Easy Prompt AI territory).
- **Before push, run `node --check` on any JS changed.**
- **Stay on the branch that matches the project you're working on.** Never edit files
  that belong to another project from this branch.
