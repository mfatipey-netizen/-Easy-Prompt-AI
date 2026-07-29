"""Notifications. Console by default; optional Telegram/webhook via stdlib only."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


@dataclass
class Notifier:
    telegram_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    webhook_url: Optional[str] = None

    def send(self, message: str) -> None:
        print(f"[{_now()}] {message}", flush=True)
        if self.telegram_token and self.telegram_chat_id:
            self._telegram(message)
        if self.webhook_url:
            self._webhook(message)

    def _telegram(self, message: str) -> None:
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = urllib.parse.urlencode(
                {"chat_id": self.telegram_chat_id, "text": message}
            ).encode()
            urllib.request.urlopen(urllib.request.Request(url, data=data), timeout=15)
        except Exception as exc:  # notifications must never crash the bot
            print(f"[{_now()}] (telegram failed: {exc})", flush=True)

    def _webhook(self, message: str) -> None:
        try:
            data = json.dumps({"text": message}).encode()
            req = urllib.request.Request(
                self.webhook_url, data=data, headers={"Content-Type": "application/json"}
            )
            urllib.request.urlopen(req, timeout=15)
        except Exception as exc:
            print(f"[{_now()}] (webhook failed: {exc})", flush=True)
