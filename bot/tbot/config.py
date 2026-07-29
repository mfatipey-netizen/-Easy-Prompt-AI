"""Configuration loading (JSON file + environment variables), stdlib only.

Secrets (API keys) come from the environment, never from the committed config
file. The JSON file holds only non-secret strategy/risk/run parameters.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Any, Dict

from .risk import RiskConfig
from .strategy import ConfluenceStrategy


@dataclass
class RunConfig:
    mode: str = "backtest"            # backtest | paper | live
    source: str = "synthetic"        # synthetic | kraken | coinbase
    exchange: str = "kraken"         # used for live orders
    symbol: str = "XBTUSD"
    interval_sec: int = 3600
    start_cash: float = 10_000.0
    fee_rate: float = 0.0016
    poll_seconds: int = 60           # paper/live loop cadence
    strategy: Dict[str, Any] = field(default_factory=dict)
    risk: Dict[str, Any] = field(default_factory=dict)

    def build_strategy(self) -> ConfluenceStrategy:
        return ConfluenceStrategy(**self.strategy) if self.strategy else ConfluenceStrategy()

    def build_risk(self) -> RiskConfig:
        return RiskConfig(**self.risk) if self.risk else RiskConfig()


def load_config(path: str | None) -> RunConfig:
    data: Dict[str, Any] = {}
    if path and os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    known = {f: data[f] for f in RunConfig.__dataclass_fields__ if f in data}
    return RunConfig(**known)


def secret(name: str, default: str = "") -> str:
    return os.environ.get(name, default)
