"""
Source credibility checker.

Loads a JSON whitelist of trusted news domains and a blacklist of known
misinformation sources from config/credibility_domains.json.
Provides a simple lookup + partial-match API used by the /credibility
endpoint and optionally during verification.
"""

from __future__ import annotations

import json
import os
from urllib.parse import urlparse

# ── Load domain lists from JSON ─────────────────────────────────

_JSON_PATH = os.path.join(
    os.path.dirname(__file__), "..", "config", "credibility_domains.json"
)

with open(_JSON_PATH, "r") as _f:
    _data = json.load(_f)

TRUSTED_DOMAINS: set[str] = set(_data.get("trusted", []))
SUSPICIOUS_DOMAINS: set[str] = set(_data.get("suspicious", []))


# ── Helpers ─────────────────────────────────────────────────────


def _extract_domain(url_or_domain: str) -> str:
    """Normalise a URL or bare domain to a root domain string."""
    text = url_or_domain.strip().lower()
    if not text.startswith(("http://", "https://")):
        text = "https://" + text
    hostname = urlparse(text).hostname or ""
    # Strip leading "www."
    if hostname.startswith("www."):
        hostname = hostname[4:]
    return hostname


# ── Public API ──────────────────────────────────────────────────


def is_trusted(domain_or_url: str) -> bool:
    """Return True if the domain belongs to a trusted source."""
    domain = _extract_domain(domain_or_url)
    # Exact match or sub-domain match (e.g. m.ndtv.com → ndtv.com)
    return any(domain == t or domain.endswith("." + t) for t in TRUSTED_DOMAINS)


def is_suspicious(domain_or_url: str) -> bool:
    """Return True if the domain is on the known-misinformation list."""
    domain = _extract_domain(domain_or_url)
    return any(domain == s or domain.endswith("." + s) for s in SUSPICIOUS_DOMAINS)


def check_credibility(domain_or_url: str) -> dict:
    """
    Return a dict with credibility info for a domain.

    Keys: domain, trusted, suspicious, label
    """
    domain = _extract_domain(domain_or_url)
    trusted = is_trusted(domain)
    suspicious = is_suspicious(domain)

    if trusted:
        label = "trusted"
    elif suspicious:
        label = "suspicious"
    else:
        label = "unknown"

    return {
        "domain": domain,
        "trusted": trusted,
        "suspicious": suspicious,
        "label": label,
    }
