"""Tests for the `unslop` router CLI: component routing, skill routing,
and the prompt-shaper fallback for vague queries.

Imports the repo-root `unslop` script directly (no install needed).
"""

import importlib.machinery
import importlib.util
import subprocess
import sys
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
UNSL0P = HERE.parent / "unslop"

_loader = importlib.machinery.SourceFileLoader("unslop_cli", str(UNSL0P))
_spec = importlib.util.spec_from_loader("unslop_cli", _loader)
unslop = importlib.util.module_from_spec(_spec)
_loader.exec_module(unslop)


def run_cli(*args):
    return subprocess.run(
        [sys.executable, str(UNSL0P), *args],
        capture_output=True, text=True, timeout=60,
    )


# --- scoring: skill queries route to skills ---


def test_skill_query_routes_to_prompt_shaper():
    matches = unslop.find_skill_matches("help me write a better brief", top=3)
    assert matches[0][0]["name"] == "prompt-shaper"
    assert matches[0][1] > 0


def test_design_query_routes_to_design_intel():
    matches = unslop.find_skill_matches("critique my design typography and color palette", top=3)
    assert matches[0][0]["name"] == "design-intel"


def test_component_query_routes_to_router_skill():
    matches = unslop.find_skill_matches("which component should I use for my site", top=3)
    assert matches[0][0]["name"] == "unslop-router"


# --- scoring: component queries still rank components first ---


def test_pricing_query_ranks_pricing_first():
    matches = unslop.find_matches("pricing section for a coffee brand", top=3)
    assert matches[0][0]["name"] == "pricing"
    assert matches[0][1] >= unslop.CONFIDENCE_FLOOR


def test_hero_query_ranks_hero_first():
    matches = unslop.find_matches("hero for my landing page", top=3)
    assert matches[0][0]["name"] == "hero"


def test_faq_query_ranks_faq_first():
    matches = unslop.find_matches("frequently asked questions help section", top=3)
    assert matches[0][0]["name"] == "faq"


# --- prompt-shaper trigger: vague queries don't guess a component ---


def test_vague_query_scores_below_floor():
    matches = unslop.find_matches("make me something cool", top=3)
    assert matches[0][1] < unslop.CONFIDENCE_FLOOR


def test_skill_dominates_weak_component_match():
    # "help" weakly matches faq, but the skill score crushes it — skills win.
    c = unslop.find_matches("help me write a better brief", top=3)
    s = unslop.find_skill_matches("help me write a better brief", top=3)
    assert s[0][1] > c[0][1]
    assert s[0][1] >= unslop.CONFIDENCE_FLOOR


def test_skill_query_routes_to_skills_not_components():
    r = run_cli("find", "help me write a better brief")
    assert r.returncode == 0
    assert "Prompt Shaper" in r.stdout
    assert "Menu Pricing" not in r.stdout
    assert "Footnotes FAQ" not in r.stdout


def test_vague_find_suggests_shaper():
    r = run_cli("find", "make me something cool")
    assert r.returncode == 0
    assert "too vague" in r.stdout
    assert "skills/prompt-shaper/SKILL.md" in r.stdout


def test_confident_find_still_lists_components():
    r = run_cli("find", "pricing section for a coffee brand")
    assert r.returncode == 0
    assert "Menu Pricing" in r.stdout
    assert "too vague" not in r.stdout


# --- skill subcommand ---


def test_skill_list_lists_all_skills():
    r = run_cli("skill", "--list")
    assert r.returncode == 0
    for name in ("unslop-router", "design-intel", "prompt-shaper"):
        assert name in r.stdout


def test_skill_search_ranks_prompt_shaper():
    r = run_cli("skill", "sharpen my prompt")
    assert r.returncode == 0
    assert "Prompt Shaper" in r.stdout
