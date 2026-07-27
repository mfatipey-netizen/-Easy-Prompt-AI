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

import { nextQuestion, generatePrompt, publicCategories } from './engine.js';

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

// Determine entitlement (Pro?) from the Authorization: Bearer <code> header.
async function entitlement(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const code = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!code) return { pro: false, code: null };
  if (env.ADMIN_TOKEN && code === env.ADMIN_TOKEN) return { pro: true, code: 'admin' };
  const row = await env.DB.prepare('SELECT * FROM codes WHERE code=?').bind(code).first();
  if (!row || row.revoked) return { pro: false, code: null };
  if (row.type === 'lifetime') return { pro: true, code };
  // subscription: start clock on first use, 90 days
  if (!row.first_used) {
    const exp = now() + 90 * 24 * 3600 * 1000;
    await env.DB.prepare('UPDATE codes SET first_used=?, expires_at=? WHERE code=?').bind(now(), exp, code).run();
    return { pro: true, code };
  }
  if (row.expires_at && now() > row.expires_at) return { pro: false, code: null };
  return { pro: true, code };
}

async function readJson(request) { try { return await request.json(); } catch { return {}; } }

/* --------------------------- payments ------------------------------ */
async function grantCode(env, type, method, payId, amount) {
  const code = type === 'lifetime' ? newLifeCode() : newSubCode();
  const ts = now();
  const expires = type === 'subscription' ? ts + 90 * 24 * 3600 * 1000 : null;
  await env.DB.prepare('INSERT INTO codes (code,type,created_at,first_used,expires_at,revoked,note) VALUES (?,?,?,?,?,0,?)')
    .bind(code, type, ts, type === 'subscription' ? ts : null, expires, method).run();
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
async function runClaude(env, prompt) {
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
      max_tokens: 2048,
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

function extractJson(s){ if(!s) return null; const a=s.indexOf('{'), b=s.lastIndexOf('}'); return (a>=0&&b>a)? s.slice(a,b+1) : null; }

// Translate a question's display strings to `lang` (Persian stays the value key). Cached in D1.
async function cachedTranslate(env, q, lang){
  if(!env.ANTHROPIC_API_KEY) return null;
  const target = LANG_NAMES[lang]; if(!target) return null;
  const key = q.id + '|' + lang;
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
        const prompt = generatePrompt(category, answers, lang, ent.pro);
        return json(env, { prompt, pro: ent.pro });
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
      if (path === '/api/pay/paypal/verify' && request.method === 'POST') {
        const { orderID } = await readJson(request);
        if (!orderID) return json(env, { error: 'orderID_required' }, 400);
        const seen = await env.DB.prepare('SELECT code FROM payments WHERE id=?').bind('paypal:' + orderID).first();
        if (seen) return json(env, { ok: true, code: seen.code, reused: true });
        const v = await verifyPaypal(env, orderID);
        if (!v.ok) return json(env, v, 402);
        const code = await grantCode(env, 'subscription', 'paypal', 'paypal:' + orderID, v.amount);
        return json(env, { ok: true, code });
      }

      // Verify USDT transaction -> grant code
      if (path === '/api/pay/usdt/verify' && request.method === 'POST') {
        const { chain, txid } = await readJson(request);
        if (!chain || !txid) return json(env, { error: 'chain_and_txid_required' }, 400);
        const payId = `usdt-${chain}:${txid}`;
        const seen = await env.DB.prepare('SELECT code FROM payments WHERE id=?').bind(payId).first();
        if (seen) return json(env, { ok: true, code: seen.code, reused: true });
        const v = await verifyUsdt(env, chain, txid);
        if (!v.ok) return json(env, v, 402);
        const code = await grantCode(env, 'subscription', 'usdt-' + chain, payId, v.amount);
        return json(env, { ok: true, code });
      }

      // Admin: generate a code manually (protected)
      if (path === '/api/admin/gen' && request.method === 'POST') {
        const auth = request.headers.get('Authorization') || '';
        if (!env.ADMIN_TOKEN || auth !== 'Bearer ' + env.ADMIN_TOKEN)
          return json(env, { error: 'unauthorized' }, 401);
        const { type = 'subscription' } = await readJson(request);
        const code = type === 'lifetime' ? newLifeCode() : newSubCode();
        const ts = now();
        const expires = type === 'subscription' ? null : null;
        await env.DB.prepare('INSERT INTO codes (code,type,created_at,first_used,expires_at,revoked,note) VALUES (?,?,?,?,?,0,?)')
          .bind(code, type, ts, null, expires, 'admin').run();
        return json(env, { ok: true, code, type });
      }

      // Check current entitlement for a code
      if (path === '/api/me') {
        const ent = await entitlement(request, env);
        return json(env, ent);
      }

      return json(env, { error: 'not_found' }, 404);
    } catch (e) {
      return json(env, { error: 'server_error', detail: String(e && e.message || e) }, 500);
    }
  },
};
