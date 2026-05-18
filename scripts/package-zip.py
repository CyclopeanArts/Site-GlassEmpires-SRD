"""Build an offline-capable zip of the SRD site from dist/.
"""

import json
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
VERSION_FILE = ROOT / "version.json"


def load_version():
    with open(VERSION_FILE) as f:
        return json.load(f)["version"]


def relativise_html(text, prefix):
    """Depth-relativise src/href, inline CSS url(), append /index.html to dir links."""
    # Step 1: relativise src/href
    text = re.sub(r'\b(src|href)="/([^"]*)"', lambda m: f'{m.group(1)}="{prefix}{m.group(2)}"', text)
    text = re.sub(r"\b(src|href)='/([^']*)'", lambda m: f"{m.group(1)}='{prefix}{m.group(2)}'", text)

    # Step 2: relativise CSS url() inside inline <style> blocks
    def fix_inline_css(m):
        css = m.group(1)
        css = re.sub(r"url\(/([^)]+)\)", lambda n: f"url({prefix}{n.group(1)})", css)
        return f"<style>{css}</style>"

    text = re.sub(r"<style>(.*?)</style>", fix_inline_css, text, flags=re.DOTALL)

    # Step 3: append /index.html to hrefs pointing to content dirs
    def fix_href(m):
        val = m.group(1)
        if val.startswith(("http", "#", "mailto:", "javascript:", "data:")):
            return f'href="{val}"'
        if val.endswith("/index.html"):
            return f'href="{val}"'
        last_seg = val.rstrip("/").split("/")[-1] if "/" in val else val
        if "." in last_seg and val not in ("./", "../", "../../", "../../../"):
            return f'href="{val}"'
        clean = val.rstrip("/")
        return f'href="{clean}/index.html"'

    text = re.sub(r'href="([^"]*)"', fix_href, text)
    return text


def relativise_css(text):
    """Relativise CSS url() from root-absolute to ../ (files are in _astro/)."""
    return re.sub(r"url\(/([^)]+)\)", r"url(../\1)", text)


def patch_pagefind_js(text):
    """Patch pagefind JS to use relative paths."""
    return text.replace("/pagefind/", "./")


def depth_prefix(file_path, staging_root):
    """Calculate the relative prefix to reach the root from a file's location."""
    rel = file_path.relative_to(staging_root)
    parts = len(rel.parents) - 1
    if parts <= 0:
        return "./"
    return "../" * parts


def make_start_script():
    return """#!/bin/bash
# Glass Empires SRD — offline server
echo ""
echo "  Glass Empires SRD — Starting local server..."
echo "  Open http://localhost:8080 in your browser"
echo "  Press Ctrl+C to stop the server"
echo ""
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m http.server 8080
else
    echo "  ERROR: Python is required. Install from https://www.python.org/downloads/"
    read -p "  Press Enter to exit..."
fi
"""


def make_bat_script():
    return """@echo off
echo.
echo   Glass Empires SRD -- Starting local server...
echo.
python -m http.server 8080
if errorlevel 1 (
    python3 -m http.server 8080
)
if errorlevel 1 (
    echo.
    echo   ERROR: Python is required. Install from https://www.python.org/downloads/
    pause
)
"""


def make_readme():
    return """Glass Empires SRD -- Offline Version

HOW TO OPEN
-----------
  Windows: Double-click start.bat
  macOS/Linux: Double-click start.sh, or run: bash start.sh

  Then open http://localhost:8080 in your browser.
  Everything works: search, page previews, keyboard nav, theme toggle.

  NOTE: Opening index.html directly in Chrome will break some features
  due to browser security restrictions. The server script avoids this.

WHAT'S INCLUDED
---------------
  The complete Glass Empires SRD: rules, bestiary, lore, magic,
  factions, combat, and GM resources.

  New versions at https://srd.glassempires.com
  Announced at https://sakiroku.com
"""


def main(dist_dir=None):
    if dist_dir is None:
        dist_dir = DIST

    if not dist_dir.exists() or not (dist_dir / "index.html").exists():
        print(f"dist/ not found or incomplete at {dist_dir}")
        print("Run 'npm run build' first.")
        return None

    version = load_version()
    zip_name = f"SRD-v{version}.zip"
    zip_path = ROOT / zip_name

    with tempfile.TemporaryDirectory(prefix="srd-zip-") as tmp:
        staging = Path(tmp) / "srd"
        shutil.copytree(dist_dir, staging)

        for html_file in sorted(staging.rglob("*.html")):
            prefix = depth_prefix(html_file, staging)
            html_file.write_text(relativise_html(html_file.read_text(), prefix))

        for css_file in sorted(staging.rglob("*.css")):
            css_file.write_text(relativise_css(css_file.read_text()))

        for pf_js in sorted(staging.rglob("pagefind/*.js")):
            pf_js.write_text(patch_pagefind_js(pf_js.read_text()))

        # Write startup files and README
        (staging / "start.sh").write_text(make_start_script())
        (staging / "start.bat").write_text(make_bat_script())
        (staging / "README.txt").write_text(make_readme())
        (staging / "version.json").write_text(json.dumps({"version": version}))

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in sorted(staging.rglob("*")):
                if f.is_file():
                    arcname = str(f.relative_to(staging))
                    zf.write(f, arcname)

    size_mb = zip_path.stat().st_size / 1024 / 1024
    print(f"Created {zip_name} ({size_mb:.1f} MB)")
    return zip_path


if __name__ == "__main__":
    dist_path = None
    if len(sys.argv) > 2 and sys.argv[1] == "--dir":
        dist_path = Path(sys.argv[2]).resolve()
    main(dist_path)
