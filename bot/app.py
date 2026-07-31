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

import queue
import threading
import tkinter as tk
from tkinter import messagebox, ttk

from tbot import live
from tbot.backtest import run_backtest
from tbot.recommend import DEFAULT_TAKER_FEE, recommend_sizing
from tbot.risk import RiskConfig, RiskManager
from tbot.strategy import ConfluenceStrategy

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
        tk.Label(row, text="Timeframe:").pack(side="left")
        self.tf_var = tk.StringVar(value="1h")
        ttk.OptionMenu(row, self.tf_var, "1h", "15m", "1h", "4h", "1d").pack(side="left", padx=6)
        tk.Label(row, text="Bars:").pack(side="left", padx=(12, 2))
        self.bars_var = tk.StringVar(value="1000")
        tk.Entry(row, textvariable=self.bars_var, width=8).pack(side="left")
        self.backtest_btn = tk.Button(row, text="Run backtest", command=self.on_backtest,
                                      bg="#1f4f7f", fg="white")
        self.backtest_btn.pack(side="left", padx=12)

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

    def on_backtest(self) -> None:
        if self.client is None:
            messagebox.showinfo("Connect first", "Connect to your exchange before backtesting.")
            return
        try:
            bars = max(200, int(self.bars_var.get()))
            capital = float(self.capital_var.get())
        except ValueError:
            messagebox.showwarning("Invalid input", "Check the bars and capital fields.")
            return
        self.backtest_btn.config(state="disabled")
        self._set_text(self.report, "")
        self._append_report("Fetching data and running backtest…")
        symbol = self.symbol_var.get().strip()
        tf = self.tf_var.get()

        def work() -> None:
            try:
                candles = live.fetch_candles(self.client, symbol, tf, bars)
                if len(candles) < 220:
                    raise RuntimeError(
                        f"Only {len(candles)} bars returned — not enough to backtest. "
                        f"Try a longer timeframe or more bars.")
                interval = live.TIMEFRAME_SEC.get(tf, 3600)
                strat = ConfluenceStrategy()
                risk = RiskManager(RiskConfig(risk_per_trade=self.risk_per_trade))
                result = run_backtest(
                    candles, strat, risk, symbol=symbol,
                    start_cash=capital, fee_rate=self.taker,
                    bars_per_day=max(1, 86400 // interval),
                )
                self.q.put(lambda: self._backtest_done(result, symbol, tf, len(candles)))
            except Exception as exc:
                self.q.put(lambda e=exc: self._backtest_failed(e))

        threading.Thread(target=work, daemon=True).start()

    def _backtest_done(self, result, symbol, tf, n) -> None:
        self.backtest_btn.config(state="normal")
        r = result.report
        self._set_text(self.report, "")
        self._append_report(f"=== Backtest: {symbol} {tf} | {n} real bars ===")
        for line in r.as_lines():
            self._append_report("  " + line)
        self._append_report("")
        self._append_report(f"  Win rate achieved: {r.win_rate:.1f}%")
        self._append_report("  At 1:2 reward:risk, breakeven win rate is only ~33%.")
        self._append_report("  A 70%+ win rate at 1:2 would be a world-class edge — verify")
        self._append_report("  it holds on out-of-sample data before trusting it.")
        self._append_report("  Backtest results are hypotheses, not guarantees.")

    def _backtest_failed(self, exc: Exception) -> None:
        self.backtest_btn.config(state="normal")
        self._set_text(self.report, "")
        self._append_report("Backtest failed: " + str(exc))
        messagebox.showerror("Backtest failed", str(exc))


def main() -> None:
    root = tk.Tk()
    App(root)
    root.mainloop()


if __name__ == "__main__":
    main()
