"""Tests for the prelaunch-audit `audit` CLI.

Fixtures live in tests/fixtures/. Binary image files (a small ok.png and an
oversized big.png) are materialized at test time so the repo stays text-only.
"""

import functools
import http.server
import json
import shutil
import subprocess
import sys
import threading
from pathlib import Path

import pytest

HERE = Path(__file__).resolve().parent
AUDIT = HERE.parent / "audit"
FIXTURES = HERE / "fixtures"


def run_audit(*args, cwd=None):
    return subprocess.run(
        [sys.executable, str(AUDIT), *args],
        capture_output=True, text=True, timeout=120, cwd=cwd,
    )


@pytest.fixture()
def bad_site(tmp_path):
    site = tmp_path / "bad"
    shutil.copytree(FIXTURES / "bad-site", site)
    (site / "assets" / "big.png").write_bytes(b"\x00" * (600 * 1024))
    # assets/gone.png intentionally absent -> images.missing
    return site


@pytest.fixture()
def good_site(tmp_path):
    site = tmp_path / "good"
    shutil.copytree(FIXTURES / "good-site", site)
    (site / "assets" / "ok.png").write_bytes(b"\x89PNG" + b"\x00" * 2048)
    return site


def failed_checks(output):
    """check ids with at least one FAIL finding in text output."""
    ids, current = set(), None
    for line in output.splitlines():
        if line.startswith(("FAIL", "WARN", "ok  ")):
            current = line[5:33].strip()
        if "[FAIL]" in line and current:
            ids.add(current)
    return ids


def warned_checks(output):
    ids, current = set(), None
    for line in output.splitlines():
        if line.startswith(("FAIL", "WARN", "ok  ")):
            current = line[5:33].strip()
        if "[WARN]" in line and current:
            ids.add(current)
    return ids


# -- dir mode ---------------------------------------------------------------

def test_bad_site_fails_with_expected_findings(bad_site):
    r = run_audit(str(bad_site))
    assert r.returncode == 1, r.stdout
    fails = failed_checks(r.stdout)
    for cid in ("seo.meta-description", "branding.favicon", "links.internal",
                "links.anchor", "images.missing"):
        assert cid in fails, f"expected FAIL for {cid}\n{r.stdout}"
    warns = warned_checks(r.stdout)
    for cid in ("social.og", "seo.lang", "images.alt", "images.size",
                "forms.labels", "forms.validation", "discover.robots",
                "errors.custom-404", "quality.debug-code"):
        assert cid in warns, f"expected WARN for {cid}\n{r.stdout}"


def test_good_site_passes_clean(good_site):
    r = run_audit(str(good_site))
    assert r.returncode == 0, r.stdout
    assert "[FAIL]" not in r.stdout
    assert "0 failed" in r.stdout


def test_secrets_and_env_flagged(tmp_path):
    site = tmp_path / "leaky"
    site.mkdir()
    (site / "index.html").write_text(
        "<!DOCTYPE html><html lang='en'><head><title>T</title>"
        '<meta name="description" content="' + "x" * 120 + '"></head>'
        "<body><h1>T</h1></body></html>")
    (site / ".env").write_text('STRIPE_KEY=sk-test-FAKEKEY1234567890abcdef\n')
    (site / "keys.js").write_text('const k = "AKIAIOSFODNN7EXAMPLE";\n')
    r = run_audit(str(site), "--only", "security")
    assert r.returncode == 1, r.stdout
    assert "security.secrets" in failed_checks(r.stdout)


def test_json_output_is_parseable(good_site):
    r = run_audit(str(good_site), "--format", "json")
    assert r.returncode == 0
    data = json.loads(r.stdout)
    assert data["summary"]["failed"] == 0
    assert data["mode"] == "dir"
    assert data["pages"] == 3


def test_markdown_output(good_site):
    r = run_audit(str(good_site), "--format", "markdown")
    assert r.returncode == 0
    assert r.stdout.startswith("# Pre-launch audit")


def test_only_and_skip_filter_checks(bad_site):
    r = run_audit(str(bad_site), "--only", "seo")
    assert "social.og" not in r.stdout
    assert "seo.meta-description" in r.stdout
    r2 = run_audit(str(bad_site), "--skip", "seo,social,branding,discover,links,images,forms,errors,security,quality")
    assert r2.returncode == 0, r2.stdout  # only perf left, nothing to fail on


def test_no_fail_flag(bad_site):
    r = run_audit(str(bad_site), "--no-fail")
    assert r.returncode == 0
    assert "[FAIL]" in r.stdout  # findings still reported


def test_missing_dir_errors():
    r = run_audit("/does/not/exist")
    assert r.returncode == 2


# -- url mode ---------------------------------------------------------------

@pytest.fixture()
def live_site(good_site):
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler, directory=str(good_site))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=srv.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{srv.server_address[1]}/"
    srv.shutdown()


def test_url_mode_crawls_and_passes(live_site):
    r = run_audit(live_site)
    assert r.returncode == 0, r.stdout + r.stderr
    assert "[FAIL]" not in r.stdout
    # crawled both pages (index + about); 404.html is not linked, so 2 pages
    assert "2 pages" in r.stdout
