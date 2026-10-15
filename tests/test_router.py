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


def test_logo_query_routes_to_community_logo_design():
    matches = unslop.find_skill_matches("design a logo for my startup", top=3)
    assert matches[0][0]["name"] == "community-logo-design"
    assert matches[0][1] > 0


def test_illustration_query_routes_to_community_annotated_illustrations():
    matches = unslop.find_skill_matches("draw a hand-drawn diagram of my system architecture", top=3)
    assert matches[0][0]["name"] == "community-annotated-illustrations"
    assert matches[0][1] > 0


def test_motion_query_routes_to_community_emilkowalski_motion():
    matches = unslop.find_skill_matches("animate this button with smooth web motion", top=3)
    assert matches[0][0]["name"] == "community-emilkowalski-motion"
    assert matches[0][1] > 0


def test_taste_query_routes_to_community_taste():
    matches = unslop.find_skill_matches("taste skill avoid ai slop aesthetic", top=3)
    assert matches[0][0]["name"] == "community-taste"
    assert matches[0][1] > 0


def test_impeccable_query_routes_to_community_impeccable():
    matches = unslop.find_skill_matches("impeccable polish my frontend design", top=3)
    assert matches[0][0]["name"] == "community-impeccable"
    assert matches[0][1] > 0


def test_gsap_query_routes_to_community_gsap_motion():
    matches = unslop.find_skill_matches("gsap scrolltrigger reveal animation", top=3)
    assert matches[0][0]["name"] == "community-gsap-motion"
    assert matches[0][1] > 0


def test_glass_query_routes_to_community_glassmorphism():
    matches = unslop.find_skill_matches("glassmorphism frosted card", top=3)
    assert matches[0][0]["name"] == "community-glassmorphism"
    assert matches[0][1] > 0


def test_palette_query_routes_to_community_design_database():
    matches = unslop.find_skill_matches("color palette for dark fintech dashboard", top=3)
    assert matches[0][0]["name"] == "community-design-database"
    assert matches[0][1] > 0


def test_bento_query_routes_to_community_bento():
    matches = unslop.find_skill_matches("bento grid layout", top=3)
    assert matches[0][0]["name"] == "community-bento"
    assert matches[0][1] > 0


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


def test_changelog_query_ranks_changelog_first():
    matches = unslop.find_matches("release notes changelog for my product", top=3)
    assert matches[0][0]["name"] == "changelog"
    assert matches[0][1] >= unslop.CONFIDENCE_FLOOR


def test_comparison_query_ranks_vstable_first():
    matches = unslop.find_matches("comparison table us vs them for my landing page", top=3)
    assert matches[0][0]["name"] == "vs-table"
    assert matches[0][1] >= unslop.CONFIDENCE_FLOOR


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
    for name in ("unslop-router", "design-intel", "prompt-shaper", "community-logo-design",
                 "community-annotated-illustrations", "community-emilkowalski-motion",
                 "community-impeccable", "community-taste", "community-gsap-motion",
                 "community-motion-design", "community-motion-dev", "community-awwwards-ui",
                 "community-ilm-aesthetics", "community-liquid-glass", "community-ckw-design",
                 "community-magic-ui", "community-component-discovery",
                 "community-appllama-mobile", "community-design-database",
                 "community-glassmorphism", "community-bento", "community-gradient"):
        assert name in r.stdout


def test_skill_search_ranks_prompt_shaper():
    r = run_cli("skill", "sharpen my prompt")
    assert r.returncode == 0
    assert "Prompt Shaper" in r.stdout
