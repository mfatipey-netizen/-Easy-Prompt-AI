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

CREATE INDEX IF NOT EXISTS idx_codes_expires ON codes(expires_at);
