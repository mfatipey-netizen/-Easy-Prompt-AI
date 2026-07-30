/*!
 * EASY PROMPT AI — Cloudflare Worker API (secure backend)
 * Copyright (c) 2026 MOHIFERI (mfatipey). All Rights Reserved.
 *
 * Keeps the prompt engine and pricing logic server-side so they can never be
 * copied from the browser. The frontend is a thin client that talks to these
 * endpoints only.
 *
 * Bindings / secrets (see wrangler.toml + README):
 *   DB                 D1 database
 *   ALLOWED_ORIGIN     e.g. https://mfatipey-netizen.github.io
 *   ADMIN_TOKEN        secret — admin auth for code generation
 *   ANTHROPIC_API_KEY  secret — for live AI (Claude)
 *   PAYPAL_CLIENT_ID / PAYPAL_SECRET / PAYPAL_ENV   PayPal (env: 'live'|'sandbox')
 *   USDT_TRC20_ADDRESS / USDT_ERC20_ADDRESS         your receiving wallets
 *   PRICE_USDT         subscription price in USDT (e.g. "9")
 *   ETHERSCAN_KEY      secret — for ERC-20 verification (optional)
 */

import { nextQuestion, generatePrompt, publicCategories, recommendedTargets } from './engine.js';

const USDT_TRON_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT on TRON (6 decimals)

// EVM chains supported for on-chain verification (Etherscan V2 multichain API).
const EVM_CHAINS = {
  erc20:    { id: 1,     addrVar: 'USDT_ERC20_ADDRESS' },
  bep20:    { id: 56,    addrVar: 'USDT_BEP20_ADDRESS' },
  arbitrum: { id: 42161, addrVar: 'USDT_ARB_ADDRESS' },
};
// token contract (lowercase) + decimals, per chain id
const TOKENS = {
  usdt: { 1:['0xdac17f958d2ee523a2206206994597c13d831ec7',6], 56:['0x55d398326f99059ff775485246999027b3197955',18], 42161:['0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',6] },
  usdc: { 1:['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',6], 56:['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',18], 42161:['0xaf88d065e77c8cc2239327c5edb3a432268e5831',6] },
};
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

/* ----------------------------- helpers ----------------------------- */
// ALLOWED_ORIGIN may be a comma-separated list; echo back the matching origin.
function pickOrigin(request, env) {
  const list = (env.ALLOWED_ORIGIN || '*').split(',').map(s => s.trim()).filter(Boolean);
  if (list.includes('*')) return '*';
  const o = request.headers.get('Origin') || '';
  return list.includes(o) ? o : (list[0] || '*');
}
function corsFor(origin, extra = {}) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    ...extra,
  };
}
// module-level fallbacks (shadowed per-request inside fetch)
function cors(env, extra = {}) { return corsFor((env.ALLOWED_ORIGIN || '*').split(',')[0].trim() || '*', extra); }
const json = (env, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors(env) } });

const now = () => Date.now();
const rand = (chars, n) => { let s = ''; for (let i = 0; i < n; i++) s += chars[Math.floor(Math.random() * chars.length)]; return s; };
const newSubCode = () => rand('0123456789', 12);
const newLifeCode = () => rand('abcdefghijklmnopqrstuvwxyz0123456789', 12);

/* --------------------------- plans & pricing ------------------------ *
 * Plans customers can buy. `days` is how long a subscription lasts from the
 * moment the code is first used (null = never expires). Prices come from env
 * (PRICE_1MO / PRICE_3MO / PRICE_12MO / PRICE_LIFETIME in USD) so the admin
 * can adjust them from the Cloudflare dashboard without a redeploy.        */
const PLANS = ['1mo', '3mo', '12mo', 'lifetime'];
const PLAN_DAYS = { '1mo': 30, '3mo': 90, '12mo': 365, 'lifetime': null };
function planPricing(env) {
  return {
    '1mo':      Number(env.PRICE_1MO      || 5),
    '3mo':      Number(env.PRICE_3MO      || 12),
    '12mo':     Number(env.PRICE_12MO     || 39),
    'lifetime': Number(env.PRICE_LIFETIME || 99),
  };
}
// Parse the JSON metadata we tuck into `codes.note` (buyer info, plan, method).
function parseNote(s) { try { const o = JSON.parse(s); return (o && typeof o === 'object') ? o : {}; } catch { return {}; } }
function planFromRow(row) { const n = parseNote(row.note); return n.plan || (row.type === 'lifetime' ? 'lifetime' : '3mo'); }

// Determine entitlement (Pro?) from the Authorization: Bearer <code> header.
async function entitlement(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const code = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!code) return { pro: false, code: null };
  if (env.ADMIN_TOKEN && code === env.ADMIN_TOKEN) return { pro: true, code: 'admin' };
  const row = await env.DB.prepare('SELECT * FROM codes WHERE code=?').bind(code).first();
  if (!row || row.revoked) return { pro: false, code: null };
  if (row.type === 'lifetime') return { pro: true, code };
  // Subscription: start the clock on first use. Length comes from the plan
  // stored in `note.plan` (falls back to 3mo for legacy codes).
  if (!row.first_used) {
    const days = PLAN_DAYS[planFromRow(row)] ?? 90;
    const exp = days ? now() + days * 24 * 3600 * 1000 : null;
    await env.DB.prepare('UPDATE codes SET first_used=?, expires_at=? WHERE code=?').bind(now(), exp, code).run();
    return { pro: true, code };
  }
  if (row.expires_at && now() > row.expires_at) return { pro: false, code: null };
  return { pro: true, code };
}

async function readJson(request) { try { return await request.json(); } catch { return {}; } }

// Small helper for admin-authenticated endpoints.
function isAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  return !!env.ADMIN_TOKEN && auth === 'Bearer ' + env.ADMIN_TOKEN;
}

/* --------------------------- payments ------------------------------ */
async function grantCode(env, plan, method, payId, amount, buyer) {
  const isLife = plan === 'lifetime';
  const code = isLife ? newLifeCode() : newSubCode();
  const ts = now();
  const type = isLife ? 'lifetime' : 'subscription';
  const note = JSON.stringify({ plan, method, amount: amount ?? '', ...(buyer || {}) });
  // `expires_at` stays null at creation — filled in on first use so a code
  // that's bought today but activated in 6 months still gives a full period.
  await env.DB.prepare('INSERT INTO codes (code,type,created_at,first_used,expires_at,revoked,note) VALUES (?,?,?,?,?,0,?)')
    .bind(code, type, ts, null, null, note).run();
  await env.DB.prepare('INSERT OR REPLACE INTO payments (id,method,amount,status,code,created_at) VALUES (?,?,?,?,?,?)')
    .bind(payId, method, String(amount ?? ''), 'completed', code, ts).run();
  return code;
}

// Verify a PayPal order server-side, then grant a code.
async function verifyPaypal(env, orderID) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET) return { ok: false, error: 'paypal_not_configured' };
  const base = env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
  const tok = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  }).then(r => r.json());
  if (!tok.access_token) return { ok: false, error: 'paypal_auth_failed' };
  const order = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  }).then(r => r.json());
  if (order.status !== 'COMPLETED' && order.status !== 'APPROVED') return { ok: false, error: 'not_paid', status: order.status };
  // capture if only approved
  if (order.status === 'APPROVED') {
    const cap = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST', headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
    }).then(r => r.json());
    if (cap.status !== 'COMPLETED') return { ok: false, error: 'capture_failed', status: cap.status };
  }
  return { ok: true, amount: order?.purchase_units?.[0]?.amount?.value };
}

// Verify a USDT/USDC transfer on TRON (TRC-20) or any supported EVM chain.
async function verifyUsdt(env, chain, txid, token = 'usdt') {
  const price = parseFloat(env.PRICE_USDT || '9');

  if (chain === 'trc20') {
    const to = (env.USDT_TRC20_ADDRESS || '').trim();
    if (!to) return { ok: false, error: 'trc20_not_configured' };
    const info = await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${encodeURIComponent(txid)}`)
      .then(r => r.json()).catch(() => null);
    if (!info || !info.contractRet) return { ok: false, error: 'tx_not_found' };
    if (info.contractRet !== 'SUCCESS') return { ok: false, error: 'tx_failed' };
    const t = (info.trc20TransferInfo || [])[0] || info.tokenTransferInfo;
    if (!t) return { ok: false, error: 'no_transfer' };
    if ((t.contract_address || t.contractAddress) !== USDT_TRON_CONTRACT) return { ok: false, error: 'not_usdt' };
    if ((t.to_address || t.toAddress) !== to) return { ok: false, error: 'wrong_recipient' };
    const amt = parseFloat(t.amount_str || t.amount || '0') / 1e6;
    if (amt + 1e-6 < price) return { ok: false, error: 'amount_too_low', got: amt, need: price };
    return { ok: true, amount: amt };
  }

  const evm = EVM_CHAINS[chain];
  if (evm) {
    const to = (env[evm.addrVar] || '').trim().toLowerCase();
    if (!to) return { ok: false, error: chain + '_not_configured' };
    if (!env.ETHERSCAN_KEY) return { ok: false, error: 'etherscan_key_missing' };
    const tokenMap = TOKENS[token] || TOKENS.usdt;
    const spec = tokenMap[evm.id];
    if (!spec) return { ok: false, error: 'token_not_supported_on_chain' };
    const [contract, decimals] = spec;
    // Etherscan V2 multichain endpoint (one API key covers ETH, BSC, Arbitrum, …)
    const url = `https://api.etherscan.io/v2/api?chainid=${evm.id}&module=proxy&action=eth_getTransactionReceipt&txhash=${txid}&apikey=${env.ETHERSCAN_KEY}`;
    const r = await fetch(url).then(x => x.json()).catch(() => null);
    const logs = r?.result?.logs || [];
    for (const lg of logs) {
      if ((lg.address || '').toLowerCase() !== contract) continue;
      if ((lg.topics?.[0] || '') !== TRANSFER_TOPIC) continue;
      const toAddr = '0x' + (lg.topics?.[2] || '').slice(26).toLowerCase();
      if (toAddr !== to) continue;
      const amt = parseInt(lg.data, 16) / Math.pow(10, decimals);
      if (amt + 1e-6 >= price) return { ok: true, amount: amt };
      return { ok: false, error: 'amount_too_low', got: amt, need: price };
    }
    return { ok: false, error: 'no_matching_transfer' };
  }
  return { ok: false, error: 'unknown_chain' };
}

/* ------------------------------ AI --------------------------------- */
async function runClaude(env, prompt, opts = {}) {
  if (!env.ANTHROPIC_API_KEY) return { ok: false, error: 'ai_not_configured' };
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.AI_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: opts.max_tokens || 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, error: data?.error?.message || 'ai_error' };
  const text = (data.content || []).map(c => c.text || '').join('');
  return { ok: true, text };
}

/* --------------------- question localization ----------------------- */
const LANG_NAMES = { en:'English', ar:'Arabic', tr:'Turkish', fr:'French', de:'German', es:'Spanish', zh:'Chinese (Simplified)', it:'Italian', ru:'Russian', ja:'Japanese', hi:'Hindi', pt:'Portuguese' };

// Bump when the Persian question wording changes, so cached translations refresh.
const I18N_VERSION = 'v2';

/* --------------------- server-side text-to-speech ------------------- *
 * Browser speech only works when the user's device has a voice for the
 * language (Persian/Arabic/Chinese are often missing). Synthesizing on the
 * server (Azure Neural TTS) gives a real male voice in EVERY language that
 * plays on any device. Each language uses its own NATIVE male voice — the
 * multilingual "one voice" only truly covers a few languages and falls back
 * to a default (often female) voice for the rest, so native voices sound
 * better and stay consistently male. Natural pitch (no distortion). */
const TTS_VOICE = {
  en:'en-US-GuyNeural',  fa:'fa-IR-FaridNeural', ar:'ar-SA-HamedNeural',
  tr:'tr-TR-AhmetNeural', fr:'fr-FR-HenriNeural', de:'de-DE-ConradNeural',
  es:'es-ES-AlvaroNeural', zh:'zh-CN-YunxiNeural', it:'it-IT-DiegoNeural',
  ru:'ru-RU-DmitryNeural', ja:'ja-JP-KeitaNeural', hi:'hi-IN-MadhurNeural',
  pt:'pt-BR-AntonioNeural',
};
const TTS_LOCALE = {
  en:'en-US', fa:'fa-IR', ar:'ar-SA', tr:'tr-TR', fr:'fr-FR', de:'de-DE',
  es:'es-ES', zh:'zh-CN', it:'it-IT', ru:'ru-RU', ja:'ja-JP', hi:'hi-IN', pt:'pt-BR',
};
function xmlEscape(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }

function extractJson(s){ if(!s) return null; const a=s.indexOf('{'), b=s.lastIndexOf('}'); return (a>=0&&b>a)? s.slice(a,b+1) : null; }

// Translate a question's display strings to `lang` (Persian stays the value key). Cached in D1.
async function cachedTranslate(env, q, lang){
  if(!env.ANTHROPIC_API_KEY) return null;
  const target = LANG_NAMES[lang]; if(!target) return null;
  const key = q.id + '|' + lang + '|' + I18N_VERSION;
  try{
    const hit = await env.DB.prepare('SELECT v FROM i18n WHERE k=?').bind(key).first();
    if(hit && hit.v) return JSON.parse(hit.v);
  }catch(e){
    try{ await env.DB.prepare('CREATE TABLE IF NOT EXISTS i18n (k TEXT PRIMARY KEY, v TEXT)').run(); }catch(_){}
  }
  const payload = { text: q.text, hint: q.hint || '', options: q.options || [] };
  const prompt = `Translate the string VALUES in this JSON from Persian to ${target}. Keep translations natural, concise and suitable as questionnaire UI text. Keep the same JSON shape and the options array in the same order and length. Return ONLY the JSON, no explanation.\n\n${JSON.stringify(payload)}`;
  const r = await runClaude(env, prompt);
  if(!r.ok) return null;
  let parsed; try{ parsed = JSON.parse(extractJson(r.text)); }catch(e){ return null; }
  if(!parsed || typeof parsed.text !== 'string') return null;
  try{ await env.DB.prepare('INSERT OR REPLACE INTO i18n (k,v) VALUES (?,?)').bind(key, JSON.stringify(parsed)).run(); }catch(e){}
  return parsed;
}

// Reshape a question for the client: options become {v: fa-value, l: display-label}.
async function localizeQuestion(env, q, lang){
  const baseOpts = (q.options || []).map(o => ({ v:o, l:o }));
  let text = q.text, hint = q.hint || '';
  if(q.type !== 'text' && lang && lang !== 'fa'){
    const tr = await cachedTranslate(env, q, lang);
    if(tr){
      text = tr.text || text; hint = (typeof tr.hint==='string'? tr.hint : hint);
      if(Array.isArray(tr.options) && tr.options.length === baseOpts.length)
        tr.options.forEach((l,i)=>{ if(l) baseOpts[i].l = String(l); });
    }
  } else if(q.type === 'text' && lang && lang !== 'fa'){
    const tr = await cachedTranslate(env, q, lang);
    if(tr){ text = tr.text || text; hint = (typeof tr.hint==='string'? tr.hint : hint); }
  }
  return { id:q.id, type:q.type, text, hint, options: q.type==='text' ? null : baseOpts };
}

// The engine builds prompts from a Persian question bank, so the generated
// prompt can contain Persian labels/answers even when the section headings are
// in the target language. This pass renders the WHOLE prompt consistently in
// the requested language so nothing is mixed. Persian output needs no pass.
async function localizePrompt(env, prompt, lang){
  if(!lang || lang === 'fa') return prompt;            // Persian is the source language
  const target = LANG_NAMES[lang]; if(!target) return prompt;
  if(!env.ANTHROPIC_API_KEY) return prompt;            // graceful: keep structured prompt
  const instruction =
    `You are a professional localizer. Rewrite the AI prompt below entirely in ${target}. ` +
    `Translate EVERYTHING — the markdown headings AND all content, including any Persian or English fragments — ` +
    `so the whole result is consistently in ${target}. ` +
    `Preserve the exact markdown structure: keep the '#' headings, blank lines, '-' and '•' bullets, and line breaks. ` +
    `Do not add, remove, explain, or comment on anything. Do not wrap the result in code fences. ` +
    `Return ONLY the rewritten prompt.\n\n---\n${prompt}`;
  const r = await runClaude(env, instruction, { max_tokens: 4096 });
  if(!r.ok || !r.text) return prompt;                  // graceful fallback on any failure
  return r.text.trim();
}

/* ----------------------------- router ------------------------------ */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    // per-request CORS bound to the caller's origin (shadows the module helpers)
    const _origin = pickOrigin(request, env);
    const cors = (env, extra = {}) => corsFor(_origin, extra);
    const json = (env, data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsFor(_origin) } });
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(env) });

    try {
      if (path === '/' || path === '/api/health')
        return json(env, { ok: true, service: 'easy-prompt-ai', time: now() });

      if (path === '/api/categories')
        return json(env, { categories: publicCategories() });

      if (path === '/api/next' && request.method === 'POST') {
        const { category, answers = {}, lang = 'fa' } = await readJson(request);
        if (!category) return json(env, { error: 'category_required' }, 400);
        const ent = await entitlement(request, env);
        const res = nextQuestion(category, answers, ent.pro);
        if (res.question) res.question = await localizeQuestion(env, res.question, lang);
        return json(env, { ...res, pro: ent.pro });
      }

      if (path === '/api/generate' && request.method === 'POST') {
        const { category, answers = {}, lang = 'en' } = await readJson(request);
        if (!category) return json(env, { error: 'category_required' }, 400);
        const ent = await entitlement(request, env);
        const built = generatePrompt(category, answers, lang, ent.pro);
        const prompt = await localizePrompt(env, built, lang);
        return json(env, { prompt, pro: ent.pro, targets: recommendedTargets(category) });
      }

      // Live AI (Pro only)
      if (path === '/api/ai/run' && request.method === 'POST') {
        const ent = await entitlement(request, env);
        if (!ent.pro) return json(env, { error: 'pro_required' }, 402);
        const { prompt } = await readJson(request);
        if (!prompt) return json(env, { error: 'prompt_required' }, 400);
        return json(env, await runClaude(env, prompt));
      }

      // Payment config (public) — addresses + price for the client to render
      if (path === '/api/pay/config')
        return json(env, {
          price_usdt: env.PRICE_USDT || '9',
          paypal_client_id: env.PAYPAL_CLIENT_ID || null,
          wallets: {
            trc20:    env.USDT_TRC20_ADDRESS || null,
            erc20:    env.USDT_ERC20_ADDRESS || null,
            bep20:    env.USDT_BEP20_ADDRESS || null,
            arbitrum: env.USDT_ARB_ADDRESS || null,
          },
        });

      // Verify PayPal order -> grant code
      // Create a PayPal order server-side (fixed, server-controlled price)
      if (path === '/api/pay/paypal/create' && request.method === 'POST') {
        if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_SECRET) return json(env, { error: 'paypal_not_configured' }, 400);
        const base = env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
        const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
        const tok = await fetch(`${base}/v1/oauth2/token`, {
          method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'grant_type=client_credentials',
        }).then(r => r.json());
        if (!tok.access_token) return json(env, { error: 'paypal_auth_failed' }, 400);
        const order = await fetch(`${base}/v2/checkout/orders`, {
          method: 'POST', headers: { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: String(env.PRICE_USDT || '9') }, description: 'EASY PROMPT AI — Pro (3 months)' }] }),
        }).then(r => r.json());
        if (!order.id) return json(env, { error: 'order_failed' }, 400);
        return json(env, { id: order.id });
      }

      if (path === '/api/pay/paypal/verify' && request.method === 'POST') {
        const { orderID, plan = '3mo', buyer } = await readJson(request);
        if (!orderID) return json(env, { error: 'orderID_required' }, 400);
        if (!PLANS.includes(plan)) return json(env, { error: 'bad_plan' }, 400);
        const seen = await env.DB.prepare('SELECT code FROM payments WHERE id=?').bind('paypal:' + orderID).first();
        if (seen) return json(env, { ok: true, code: seen.code, reused: true });
        const v = await verifyPaypal(env, orderID);
        if (!v.ok) return json(env, v, 402);
        const code = await grantCode(env, plan, 'paypal', 'paypal:' + orderID, v.amount, buyer);
        return json(env, { ok: true, code, plan });
      }

      // Verify USDT transaction -> grant code
      if (path === '/api/pay/usdt/verify' && request.method === 'POST') {
        const { chain, txid, plan = '3mo', buyer } = await readJson(request);
        if (!chain || !txid) return json(env, { error: 'chain_and_txid_required' }, 400);
        if (!PLANS.includes(plan)) return json(env, { error: 'bad_plan' }, 400);
        const payId = `usdt-${chain}:${txid}`;
        const seen = await env.DB.prepare('SELECT code FROM payments WHERE id=?').bind(payId).first();
        if (seen) return json(env, { ok: true, code: seen.code, reused: true });
        const v = await verifyUsdt(env, chain, txid);
        if (!v.ok) return json(env, v, 402);
        const code = await grantCode(env, plan, 'usdt-' + chain, payId, v.amount, buyer);
        return json(env, { ok: true, code, plan });
      }

      // Public: list of plans + prices (for the buy screen).
      if (path === '/api/plans') {
        const price = planPricing(env);
        const items = PLANS.map(k => ({ plan: k, days: PLAN_DAYS[k], price_usd: price[k] }));
        return json(env, { plans: items });
      }

      /* ---------- Admin API (all require ADMIN_TOKEN) ---------- */

      // Generate one or more codes manually. Optional buyer metadata is stored.
      if (path === '/api/admin/gen' && request.method === 'POST') {
        if (!isAdmin(request, env)) return json(env, { error: 'unauthorized' }, 401);
        const { plan = '3mo', quantity = 1, buyer_name = '', buyer_email = '', note = '' } = await readJson(request);
        if (!PLANS.includes(plan)) return json(env, { error: 'bad_plan' }, 400);
        const qty = Math.max(1, Math.min(50, parseInt(quantity, 10) || 1));
        const buyer = { name: buyer_name, email: buyer_email, note };
        const codes = [];
        for (let i = 0; i < qty; i++) {
          codes.push(await grantCode(env, plan, 'manual', 'manual:' + Date.now() + ':' + rand('abcdefghijklmnopqrstuvwxyz0123456789', 6), '', buyer));
        }
        return json(env, { ok: true, codes, plan });
      }

      // List codes with buyer info, status, dates. Newest first.
      if (path === '/api/admin/codes') {
        if (!isAdmin(request, env)) return json(env, { error: 'unauthorized' }, 401);
        const rows = await env.DB.prepare(
          'SELECT c.code, c.type, c.created_at, c.first_used, c.expires_at, c.revoked, c.note, ' +
          '       p.method AS pay_method, p.amount AS pay_amount ' +
          'FROM codes c LEFT JOIN payments p ON p.code = c.code ' +
          'ORDER BY c.created_at DESC LIMIT 500'
        ).all().catch(() => ({ results: [] }));
        const items = (rows.results || []).map(r => {
          const n = parseNote(r.note);
          const plan = n.plan || (r.type === 'lifetime' ? 'lifetime' : '3mo');
          let status = 'active';
          if (r.revoked) status = 'revoked';
          else if (r.type !== 'lifetime' && r.expires_at && now() > r.expires_at) status = 'expired';
          else if (!r.first_used) status = 'unused';
          return {
            code: r.code, plan, type: r.type, status,
            created_at: r.created_at, first_used: r.first_used, expires_at: r.expires_at,
            buyer_name: n.name || '', buyer_email: n.email || '', admin_note: n.note || '',
            method: r.pay_method || n.method || 'manual', amount: r.pay_amount || n.amount || '',
          };
        });
        return json(env, { items });
      }

      // Revoke a code (make it unusable immediately).
      if (path === '/api/admin/revoke' && request.method === 'POST') {
        if (!isAdmin(request, env)) return json(env, { error: 'unauthorized' }, 401);
        const { code } = await readJson(request);
        if (!code) return json(env, { error: 'code_required' }, 400);
        await env.DB.prepare('UPDATE codes SET revoked=1 WHERE code=?').bind(code).run();
        return json(env, { ok: true });
      }

      // Quick sales summary for the dashboard header.
      if (path === '/api/admin/stats') {
        if (!isAdmin(request, env)) return json(env, { error: 'unauthorized' }, 401);
        const total    = await env.DB.prepare('SELECT COUNT(*) AS n FROM codes').first().catch(() => ({ n: 0 }));
        const active   = await env.DB.prepare('SELECT COUNT(*) AS n FROM codes WHERE revoked=0 AND (expires_at IS NULL OR expires_at > ?)').bind(now()).first().catch(() => ({ n: 0 }));
        const revenue  = await env.DB.prepare("SELECT COALESCE(SUM(CAST(amount AS REAL)),0) AS s FROM payments WHERE status='completed'").first().catch(() => ({ s: 0 }));
        const last30   = await env.DB.prepare('SELECT COUNT(*) AS n FROM codes WHERE created_at > ?').bind(now() - 30 * 24 * 3600 * 1000).first().catch(() => ({ n: 0 }));
        return json(env, { total: total.n, active: active.n, revenue: Number(revenue.s || 0), last30: last30.n });
      }

      // Check current entitlement for a code
      if (path === '/api/me') {
        const ent = await entitlement(request, env);
        return json(env, ent);
      }

      // Cloud history (per activation code) — synced across devices for Pro users
      if (path === '/api/history') {
        const code = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/, '').trim();
        if (!code) return json(env, { items: [] });
        try {
          await env.DB.prepare('CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, category TEXT, lang TEXT, prompt TEXT, created_at INTEGER)').run();
        } catch (e) {}
        if (request.method === 'POST') {
          const { category = '', lang = '', prompt = '' } = await readJson(request);
          if (!prompt) return json(env, { error: 'prompt_required' }, 400);
          await env.DB.prepare('INSERT INTO history (code,category,lang,prompt,created_at) VALUES (?,?,?,?,?)')
            .bind(code, String(category), String(lang), String(prompt), now()).run();
          // keep only the latest 50 per code
          await env.DB.prepare('DELETE FROM history WHERE code=? AND id NOT IN (SELECT id FROM history WHERE code=? ORDER BY id DESC LIMIT 50)')
            .bind(code, code).run().catch(() => {});
          return json(env, { ok: true });
        }
        const rows = await env.DB.prepare('SELECT category,lang,prompt,created_at FROM history WHERE code=? ORDER BY id DESC LIMIT 50').bind(code).all().catch(() => ({ results: [] }));
        return json(env, { items: rows.results || [] });
      }

      // User feedback / rating on a generated prompt (anonymous-friendly)
      if (path === '/api/feedback' && request.method === 'POST') {
        const { rating = 0, comment = '', category = '', lang = '' } = await readJson(request);
        const r = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
        if (!r && !String(comment).trim()) return json(env, { error: 'empty_feedback' }, 400);
        const code = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/, '').trim() || null;
        try {
          await env.DB.prepare('CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, rating INTEGER, comment TEXT, category TEXT, lang TEXT, created_at INTEGER)').run();
        } catch (e) {}
        await env.DB.prepare('INSERT INTO feedback (code,rating,comment,category,lang,created_at) VALUES (?,?,?,?,?,?)')
          .bind(code, r, String(comment).slice(0, 2000), String(category), String(lang), now()).run();
        return json(env, { ok: true });
      }

      // Server-side neural text-to-speech (works in every language on any device)
      if (path === '/api/tts' && request.method === 'POST') {
        const key = env.AZURE_TTS_KEY, region = env.AZURE_TTS_REGION;
        if (!key || !region) return json(env, { error: 'tts_not_configured' }, 400);
        const { text = '', lang = 'en' } = await readJson(request);
        const clean = String(text).slice(0, 1500).trim();
        if (!clean) return json(env, { error: 'text_required' }, 400);
        const voice = TTS_VOICE[lang] || TTS_VOICE.en;
        const locale = TTS_LOCALE[lang] || 'en-US';
        // Native voice per language, natural pitch, only a gentle slow-down.
        const ssml = `<speak version='1.0' xml:lang='${locale}'><voice name='${voice}'>` +
          `<prosody rate='-4%'>${xmlEscape(clean)}</prosody></voice></speak>`;
        const az = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
            'User-Agent': 'easypromptai',
          },
          body: ssml,
        });
        if (!az.ok) return json(env, { error: 'tts_failed', status: az.status }, 502);
        const buf = await az.arrayBuffer();
        return new Response(buf, { status: 200, headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400', ...corsFor(_origin) } });
      }

      return json(env, { error: 'not_found' }, 404);
    } catch (e) {
      return json(env, { error: 'server_error', detail: String(e && e.message || e) }, 500);
    }
  },
};
