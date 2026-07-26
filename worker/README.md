# EASY PROMPT AI — Secure Backend (Cloudflare Worker)

This is the **secure server** for EASY PROMPT AI. It keeps the prompt engine,
question banks, pricing, and payment logic **on the server** so they can never be
copied from the browser. The website becomes a thin client that only talks to
this API.

## What it does
- Serves categories and drives the adaptive interview **one question at a time**
  (the full question bank never reaches the browser).
- Generates the final professional prompt server-side.
- Enforces Free (20 questions) vs **Pro (30 questions + advanced sections)** based
  on a license — the client cannot fake Pro.
- Sells subscriptions automatically via **PayPal** and **USDT (Tether)** on two
  chains (TRC-20 + ERC-20), verified server-side.
- Optional **live AI** (Claude) for Pro users.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | health check |
| GET | `/api/categories` | list categories |
| POST | `/api/next` | `{category, answers}` → next question or `{done}` |
| POST | `/api/generate` | `{category, answers, lang}` → final prompt |
| POST | `/api/ai/run` | `{prompt}` → Claude answer (Pro only) |
| GET | `/api/pay/config` | prices + wallet addresses + PayPal client id |
| POST | `/api/pay/paypal/verify` | `{orderID}` → verifies & returns a Pro code |
| POST | `/api/pay/usdt/verify` | `{chain, txid}` → verifies on-chain & returns a Pro code |
| POST | `/api/admin/gen` | admin: create a code (needs `ADMIN_TOKEN`) |
| GET | `/api/me` | current entitlement for the sent code |

Entitlement is sent as `Authorization: Bearer <code>`.

## Deploy (one-time, ~10 minutes)
Prerequisites: a free [Cloudflare](https://dash.cloudflare.com/sign-up) account and Node installed.

```bash
cd worker
npm install
npx wrangler login                       # opens browser, log into Cloudflare

# 1) create the database, copy the printed database_id into wrangler.toml
npx wrangler d1 create easy-prompt-ai
#    -> paste database_id into wrangler.toml ([[d1_databases]] database_id)

# 2) create the tables (remote)
npm run db:init

# 3) set your secrets (each prompts for the value)
npx wrangler secret put ADMIN_TOKEN          # pick a strong admin password
npx wrangler secret put ANTHROPIC_API_KEY    # optional: live AI (Claude)
npx wrangler secret put PAYPAL_CLIENT_ID     # optional: PayPal
npx wrangler secret put PAYPAL_SECRET        # optional: PayPal
npx wrangler secret put ETHERSCAN_KEY        # optional: USDT ERC-20 checks

# 4) put your public config in wrangler.toml [vars]:
#    USDT_TRC20_ADDRESS, USDT_ERC20_ADDRESS, PRICE_USDT, ALLOWED_ORIGIN, PAYPAL_ENV

# 5) deploy
npm run deploy
```

Wrangler prints your Worker URL, e.g. `https://easy-prompt-ai.<you>.workers.dev`.
Put that URL into the website (the frontend `API_BASE`).

## Local development
```bash
npm run db:init:local
npm run dev        # http://127.0.0.1:8787
```

## Security notes
- **Secrets** (`ANTHROPIC_API_KEY`, PayPal secret, etc.) live only in Cloudflare —
  never in the repo or the browser.
- Payments are verified **server-side** (PayPal capture, on-chain USDT lookup) and
  each transaction/order id is stored once to prevent reuse.
- Set `ALLOWED_ORIGIN` to your exact site origin in production.

_Copyright (c) 2026 MOHIFERI (mfatipey). All Rights Reserved._
