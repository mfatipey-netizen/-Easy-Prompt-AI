-- EASY PROMPT AI — D1 (SQLite) schema
-- Copyright (c) 2026 MOHIFERI. All Rights Reserved.

-- Activation / license codes (also created automatically after a successful payment)
CREATE TABLE IF NOT EXISTS codes (
  code        TEXT PRIMARY KEY,
  type        TEXT NOT NULL,               -- 'lifetime' | 'subscription'
  created_at  INTEGER NOT NULL,
  first_used  INTEGER,                      -- ms epoch of first activation (subscription clock start)
  expires_at  INTEGER,                      -- ms epoch; NULL = never (lifetime)
  revoked     INTEGER NOT NULL DEFAULT 0,
  note        TEXT
);

-- Payments received (PayPal + USDT), used to prevent double-spend / reuse
CREATE TABLE IF NOT EXISTS payments (
  id          TEXT PRIMARY KEY,            -- paypal orderID, or chain:txid for crypto
  method      TEXT NOT NULL,               -- 'paypal' | 'usdt-trc20' | 'usdt-erc20'
  amount      TEXT,
  status      TEXT NOT NULL,               -- 'completed'
  code        TEXT,                         -- the code granted for this payment
  created_at  INTEGER NOT NULL
);

-- Cache of AI-translated question strings (key = "questionId|lang")
CREATE TABLE IF NOT EXISTS i18n (
  k TEXT PRIMARY KEY,
  v TEXT
);

-- Per-user prompt history (keyed by activation code), synced across devices
CREATE TABLE IF NOT EXISTS history (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  code       TEXT,
  category   TEXT,
  lang       TEXT,
  prompt     TEXT,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_history_code ON history(code, id);

CREATE INDEX IF NOT EXISTS idx_codes_expires ON codes(expires_at);

-- User feedback / ratings on generated prompts
CREATE TABLE IF NOT EXISTS feedback (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  code       TEXT,                            -- activation code if the user has one (else NULL)
  rating     INTEGER,                          -- 1..5 stars (0 = none)
  comment    TEXT,
  category   TEXT,
  lang       TEXT,
  created_at INTEGER
);
