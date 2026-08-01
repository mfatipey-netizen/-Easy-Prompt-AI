#!/usr/bin/env python3
"""Easy Trading Bot — a friendly desktop window (Tkinter, no extra install).

Double-click `Run-TradingBot.bat` (Windows) or run `python app.py`.

What it does, step by step, in one window:
  1) Connect to your exchange (Kraken / Coinbase) with your API keys and read
     your balance.
  2) Recommend how much to start with — a conservative slice of your balance —
     and warn you when fees / small size would eat the account.
  3) Let you set the *engaged capital* by hand.
  4) Run a backtest on YOUR exchange's real data and show the report.

It does NOT place live orders. This is a research + sizing + backtest cockpit;
going live stays a separate, deliberate step (see README → "Going live").
"""

from __future__ import annotations

import os
import queue
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

from tbot import data as datamod
from tbot import live
from tbot.backtest import run_backtest
from tbot.recommend import DEFAULT_TAKER_FEE, recommend_sizing
from tbot.risk import RiskConfig, RiskManager
from tbot.strategy import ConfluenceStrategy, Spike2LegsStrategy

DISCLAIMER = (
    "⚠  No bot can guarantee profit — a fixed “+X% per day” is not achievable. "
    "This is a research & sizing tool. Only risk money you can afford to lose."
)


class App:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.q: "queue.Queue" = queue.Queue()
        self.client = None
        self.balance = 0.0
        self.taker = 0.0
        self.risk_per_trade = 0.01

        root.title("Easy Trading Bot")
        root.geometry("760x760")
        root.minsize(680, 640)

        self._build_header()
        self._build_connect()
        self._build_recommendation()
        self._build_capital()
        self._build_backtest()
        self._poll_queue()

    # ---------- UI construction ----------
    def _build_header(self) -> None:
        bar = tk.Label(self.root, text=DISCLAIMER, bg="#5b1a1a", fg="white",
                       wraplength=740, justify="center", padx=10, pady=8)
        bar.pack(fill="x")

    def _section(self, title: str) -> tk.Frame:
        lf = ttk.LabelFrame(self.root, text=title)
        lf.pack(fill="x", padx=12, pady=7)
        return lf

    def _build_connect(self) -> None:
        f = self._section("1) Connect to your exchange")
        self.exchange_var = tk.StringVar(value="kraken")
        self.symbol_var = tk.StringVar(value="BTC/USD")
        self.key_var = tk.StringVar()
        self.secret_var = tk.StringVar()
        self.password_var = tk.StringVar()

        grid = tk.Frame(f)
        grid.pack(fill="x", padx=8, pady=6)
        tk.Label(grid, text="Exchange:").grid(row=0, column=0, sticky="w", pady=2)
        ttk.OptionMenu(grid, self.exchange_var, "kraken", "kraken", "coinbase").grid(
            row=0, column=1, sticky="w")
        tk.Label(grid, text="Symbol:").grid(row=0, column=2, sticky="w", padx=(16, 4))
        tk.Entry(grid, textvariable=self.symbol_var, width=12).grid(row=0, column=3, sticky="w")

        tk.Label(grid, text="API key:").grid(row=1, column=0, sticky="w", pady=2)
        tk.Entry(grid, textvariable=self.key_var, width=52).grid(
            row=1, column=1, columnspan=3, sticky="w")
        tk.Label(grid, text="API secret:").grid(row=2, column=0, sticky="w", pady=2)
        tk.Entry(grid, textvariable=self.secret_var, width=52, show="•").grid(
            row=2, column=1, columnspan=3, sticky="w")
        tk.Label(grid, text="Passphrase:").grid(row=3, column=0, sticky="w", pady=2)
        tk.Entry(grid, textvariable=self.password_var, width=52, show="•").grid(
            row=3, column=1, columnspan=3, sticky="w")
        tk.Label(grid, text="(Coinbase only — leave empty for Kraken)",
                 fg="#666").grid(row=4, column=1, columnspan=3, sticky="w")

        self.connect_btn = tk.Button(f, text="Connect & get balance",
                                     command=self.on_connect, bg="#1f6f43", fg="white")
        self.connect_btn.pack(anchor="w", padx=8, pady=(2, 4))
        self.connect_status = tk.Label(f, text="Not connected.", fg="#666")
        self.connect_status.pack(anchor="w", padx=8, pady=(0, 6))

    def _build_recommendation(self) -> None:
        f = self._section("2) Suggested starting capital")
        self.reco_text = tk.Text(f, height=9, wrap="word", state="disabled", bg="#f7f7f7")
        self.reco_text.pack(fill="x", padx=8, pady=6)

    def _build_capital(self) -> None:
        f = self._section("3) Engaged capital (you can change this)")
        row = tk.Frame(f)
        row.pack(fill="x", padx=8, pady=6)
        tk.Label(row, text="Amount to trade with:").pack(side="left")
        self.capital_var = tk.StringVar(value="0")
        tk.Entry(row, textvariable=self.capital_var, width=14).pack(side="left", padx=6)
        tk.Button(row, text="Apply", command=self.on_apply_capital).pack(side="left")
        self.capital_note = tk.Label(f, text="Connect first to get a suggestion.", fg="#666")
        self.capital_note.pack(anchor="w", padx=8, pady=(0, 6))

    def _build_backtest(self) -> None:
        f = self._section("4) Backtest on your exchange's real data")
        row = tk.Frame(f)
        row.pack(fill="x", padx=8, pady=6)
        tk.Label(row, text="Strategy:").pack(side="left")
        self.strat_var = tk.StringVar(value="SP2L (Spike-2-Leg)")
        ttk.OptionMenu(row, self.strat_var, "SP2L (Spike-2-Leg)",
                       "SP2L (Spike-2-Leg)", "Confluence").pack(side="left", padx=6)
        tk.Label(row, text="Timeframe:").pack(side="left", padx=(12, 2))
        self.tf_var = tk.StringVar(value="1h")
        ttk.OptionMenu(row, self.tf_var, "1h", "5m", "15m", "1h", "4h", "1d").pack(side="left", padx=6)
        tk.Label(row, text="Bars:").pack(side="left", padx=(12, 2))
        self.bars_var = tk.StringVar(value="1000")
        tk.Entry(row, textvariable=self.bars_var, width=7).pack(side="left")

        row2 = tk.Frame(f)
        row2.pack(fill="x", padx=8, pady=(0, 4))
        tk.Label(row2, text="Min order (USD):").pack(side="left")
        self.minorder_var = tk.StringVar(value="10")
        tk.Entry(row2, textvariable=self.minorder_var, width=7).pack(side="left", padx=6)
        tk.Label(row2, text="Fee %/side:").pack(side="left", padx=(12, 2))
        self.fee_var = tk.StringVar(value="0.16")  # crypto taker ~0.16%; forex ~0.01-0.03%
        tk.Entry(row2, textvariable=self.fee_var, width=6).pack(side="left")
        tk.Label(row2, text="Reward:Risk (1:x):").pack(side="left", padx=(12, 2))
        self.rr_var = tk.StringVar(value="1.0")  # SP2L default 1:1 — raise to hunt for profit
        tk.Entry(row2, textvariable=self.rr_var, width=5).pack(side="left")
        self.oos_var = tk.BooleanVar(value=False)
        tk.Checkbutton(row2, text="Out-of-sample test (70/30)", variable=self.oos_var).pack(
            side="left", padx=(12, 0))

        row3 = tk.Frame(f)
        row3.pack(fill="x", padx=8, pady=(0, 4))
        self.backtest_btn = tk.Button(row3, text="Run backtest (exchange)", command=self.on_backtest,
                                      bg="#1f4f7f", fg="white")
        self.backtest_btn.pack(side="left")
        self.csv_btn = tk.Button(row3, text="Backtest a CSV file… (forex / any market)",
                                 command=self.on_backtest_csv, bg="#3a3f5a", fg="white")
        self.csv_btn.pack(side="left", padx=10)

        self.report = tk.Text(f, height=16, wrap="word", state="disabled",
                              bg="#0f1720", fg="#d6e2ea", font=("Consolas", 10))
        self.report.pack(fill="both", expand=True, padx=8, pady=6)

    # ---------- helpers ----------
    def _set_text(self, widget: tk.Text, content: str) -> None:
        widget.configure(state="normal")
        widget.delete("1.0", "end")
        widget.insert("1.0", content)
        widget.configure(state="disabled")

    def _append_report(self, content: str) -> None:
        self.report.configure(state="normal")
        self.report.insert("end", content + "\n")
        self.report.see("end")
        self.report.configure(state="disabled")

    def _poll_queue(self) -> None:
        try:
            while True:
                fn = self.q.get_nowait()
                fn()
        except queue.Empty:
            pass
        self.root.after(100, self._poll_queue)

    # ---------- actions (network work runs off the UI thread) ----------
    def on_connect(self) -> None:
        self.connect_btn.config(state="disabled")
        self.connect_status.config(text="Connecting…", fg="#333")
        exchange = self.exchange_var.get()
        symbol = self.symbol_var.get().strip()
        key = self.key_var.get()
        secret = self.secret_var.get()
        password = self.password_var.get()

        def work() -> None:
            try:
                client = live.make_client(exchange, key, secret, password)
                total, cash = live.account_cash(client)
                fee = live.taker_fee(client, symbol, DEFAULT_TAKER_FEE.get(exchange, 0.006))
                self.q.put(lambda: self._connected(client, total, cash, fee, exchange))
            except Exception as exc:  # surface any failure gently
                self.q.put(lambda e=exc: self._connect_failed(e))

        threading.Thread(target=work, daemon=True).start()

    def _connected(self, client, total, cash, fee, exchange) -> None:
        self.client = client
        self.balance = total
        self.taker = fee
        self.connect_btn.config(state="normal")
        detail = ", ".join(f"{k} {v:,.2f}" for k, v in cash.items()) or "no fiat/stablecoin found"
        self.connect_status.config(
            text=f"Connected to {exchange}. Cash balance: {total:,.2f}  ({detail})", fg="#1f6f43")
        self.fee_var.set(f"{fee * 100:.2f}")  # prefill backtest fee with the real taker fee
        self._show_recommendation()

    def _connect_failed(self, exc: Exception) -> None:
        self.connect_btn.config(state="normal")
        self.connect_status.config(text="Connection failed.", fg="#a11")
        messagebox.showerror("Connection failed", str(exc))

    def _show_recommendation(self) -> None:
        reco = recommend_sizing(self.balance, self.taker, risk_per_trade=self.risk_per_trade)
        lines = list(reco.notes)
        if reco.warnings:
            lines.append("")
            lines.extend("⚠ " + w for w in reco.warnings)
        self._set_text(self.reco_text, "\n".join(lines))
        self.capital_var.set(f"{reco.engage_amount:.2f}")
        self.on_apply_capital()

    def on_apply_capital(self) -> None:
        try:
            amount = float(self.capital_var.get())
            if amount < 0:
                raise ValueError
        except ValueError:
            messagebox.showwarning("Invalid amount", "Enter a non-negative number.")
            return
        risk_amt = amount * self.risk_per_trade
        pct = (amount / self.balance * 100.0) if self.balance else 0.0
        self.capital_note.config(
            text=(f"Engaged: {amount:,.2f}  ({pct:.1f}% of balance)   |   "
                  f"Risk per trade ({self.risk_per_trade*100:.1f}%): {risk_amt:,.2f}"),
            fg="#333")

    def _read_backtest_params(self):
        """Common numeric fields; returns dict or None (after warning) on bad input."""
        try:
            return {
                "capital": float(self.capital_var.get()),
                "min_order": max(0.0, float(self.minorder_var.get())),
                "fee": max(0.0, float(self.fee_var.get())) / 100.0,  # % -> fraction
                "reward_risk": max(0.1, float(self.rr_var.get())),
                "bars": max(200, int(self.bars_var.get())),
                "oos": bool(self.oos_var.get()),
            }
        except ValueError:
            messagebox.showwarning("Invalid input", "Check the capital, min-order, fee, R:R and bars fields.")
            return None

    def _make_engine(self, strat_name, reward_risk, capital, fee, min_order, interval):
        strat = (Spike2LegsStrategy(reward_risk=reward_risk) if strat_name.startswith("SP2L")
                 else ConfluenceStrategy(reward_risk=reward_risk))
        risk = RiskManager(RiskConfig(risk_per_trade=self.risk_per_trade,
                                      min_reward_risk=min(1.5, reward_risk)))
        return lambda candles: run_backtest(
            candles, strat, risk, symbol="ASSET",
            start_cash=capital, fee_rate=fee,
            bars_per_day=max(1, 86400 // interval),
            min_order_quote=min_order)

    def _run_backtest(self, candles_fn, header: str) -> None:
        """Shared runner: fetch/load candles off-thread, backtest, show report."""
        params = self._read_backtest_params()
        if params is None:
            return
        strat_name = self.strat_var.get()
        self.backtest_btn.config(state="disabled")
        self.csv_btn.config(state="disabled")
        self._set_text(self.report, "")
        self._append_report("Loading data and running backtest…")

        def work() -> None:
            try:
                candles = candles_fn(params["bars"])
                if len(candles) < 220:
                    raise RuntimeError(
                        f"Only {len(candles)} bars available — not enough to backtest. "
                        f"Use more bars / a longer history.")
                interval = _infer_interval(candles)
                engine = self._make_engine(strat_name, params["reward_risk"],
                                           params["capital"], params["fee"],
                                           params["min_order"], interval)
                base = f"{strat_name} 1:{params['reward_risk']:g} | {header}"
                if params["oos"]:
                    cut = int(len(candles) * 0.7)
                    train, test = candles[:cut], candles[cut:]
                    payload = [("In-sample (train)", engine(train), len(train)),
                               ("Out-of-sample (test)", engine(test), len(test))]
                    self.q.put(lambda: self._backtest_done_multi(payload, base))
                else:
                    result = engine(candles)
                    self.q.put(lambda: self._backtest_done(result, f"{base} | {len(candles)} bars"))
            except Exception as exc:
                self.q.put(lambda e=exc: self._backtest_failed(e))

        threading.Thread(target=work, daemon=True).start()

    def on_backtest(self) -> None:
        if self.client is None:
            messagebox.showinfo("Connect first", "Connect to your exchange, or use “Backtest a CSV file”.")
            return
        symbol = self.symbol_var.get().strip()
        tf = self.tf_var.get()
        self._run_backtest(
            lambda bars: live.fetch_candles(self.client, symbol, tf, bars),
            header=f"{symbol} {tf}")

    def on_backtest_csv(self) -> None:
        path = filedialog.askopenfilename(
            title="Choose an OHLCV CSV (ts,open,high,low,close[,volume])",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")])
        if not path:
            return
        name = os.path.basename(path)
        self._run_backtest(lambda _bars: datamod.load_csv(path), header=f"CSV {name}")

    def _print_block(self, result, title) -> None:
        r = result.report
        self._append_report(f"--- {title} ---")
        for line in r.as_lines():
            self._append_report("  " + line)
        if result.skipped_min_order:
            self._append_report(
                f"  ⚠ {result.skipped_min_order} trade(s) skipped — position below min order "
                f"size (raise capital).")
        verdict = ("PROFITABLE (edge > costs)" if r.profit_factor > 1.0
                   else "not profitable yet — profit factor must be > 1.0")
        self._append_report(f"  Verdict: {verdict}")
        self._append_report("")

    def _backtest_done(self, result, header) -> None:
        self.backtest_btn.config(state="normal")
        self.csv_btn.config(state="normal")
        self._set_text(self.report, "")
        self._append_report(f"=== {header} ===")
        self._print_block(result, "Full sample")
        self._append_report("Tip: profit factor > 1.0 = an edge. If it's just under 1.0, try a")
        self._append_report("higher Reward:Risk (e.g. 1.5 or 2.0) — bigger winners can flip it")
        self._append_report("positive even if the win rate drops. Always confirm with the")
        self._append_report("out-of-sample checkbox before believing any result.")

    def _backtest_done_multi(self, payload, base) -> None:
        self.backtest_btn.config(state="normal")
        self.csv_btn.config(state="normal")
        self._set_text(self.report, "")
        self._append_report(f"=== {base} ===")
        for title, result, n in payload:
            self._print_block(result, f"{title} ({n} bars)")
        self._append_report("Judge the strategy on the OUT-OF-SAMPLE block. If it is much worse")
        self._append_report("than in-sample, the settings are over-fit and won't hold live.")

    def _backtest_failed(self, exc: Exception) -> None:
        self.backtest_btn.config(state="normal")
        self.csv_btn.config(state="normal")
        self._set_text(self.report, "")
        self._append_report("Backtest failed: " + str(exc))
        messagebox.showerror("Backtest failed", str(exc))


def _infer_interval(candles) -> int:
    """Best-effort bar interval (seconds) from candle timestamps (median gap)."""
    if len(candles) < 3:
        return 3600
    gaps = sorted(candles[i + 1].ts - candles[i].ts for i in range(min(50, len(candles) - 1)))
    mid = gaps[len(gaps) // 2]
    return mid if mid > 0 else 3600


def main() -> None:
    root = tk.Tk()
    App(root)
    root.mainloop()


if __name__ == "__main__":
    main()
