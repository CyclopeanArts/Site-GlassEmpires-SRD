"""Build an offline-capable zip of the SRD site from dist/.
"""

import base64
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


def svg_to_data_uri(path):
    svg = path.read_text()
    b64 = base64.b64encode(svg.encode()).decode()
    return f"data:image/svg+xml;base64,{b64}"


def inline_assets(html, staging):
    def inline_css(m):
        raw = m.group(1)
        rel = raw.lstrip("./")
        css_path = staging / rel
        if css_path.exists():
            content = css_path.read_text()
            return f"<style>\n{content}\n</style>"
        return m.group(0)

    def inline_module_js(m):
        raw = m.group(1)
        rel = raw.lstrip("./")
        js_path = staging / rel
        if js_path.exists():
            content = js_path.read_text()
            return f"<script type=\"module\">\n{content}\n</script>"
        return m.group(0)

    def inline_regular_js(m):
        raw = m.group(1)
        rel = raw.lstrip("./")
        js_path = staging / rel
        if js_path.exists():
            content = js_path.read_text()
            return f"<script>\n{content}\n</script>"
        return m.group(0)

    html = re.sub(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]*)"[^>]*/?>', inline_css, html)
    html = re.sub(r'<script[^>]*type="module"[^>]*src="([^"]*)"[^>]*></script>', inline_module_js, html)
    html = re.sub(r'<script(?!\s+type="module")[^>]*src="([^"]*)"[^>]*></script>', inline_regular_js, html)
    return html


def relativise_html(text, prefix):
    text = re.sub(r'\b(src|href)="/([^"]*)"', lambda m: f'{m.group(1)}="{prefix}{m.group(2)}"', text)
    text = re.sub(r"\b(src|href)='/([^']*)'", lambda m: f"{m.group(1)}='{prefix}{m.group(2)}'", text)

    def fix_inline_css(m):
        css = m.group(1)
        css = re.sub(r"url\(/([^)]+)\)", lambda n: f"url({prefix}{n.group(1)})", css)
        return f"<style>{css}</style>"

    text = re.sub(r"<style>(.*?)</style>", fix_inline_css, text, flags=re.DOTALL)

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
    return re.sub(r"url\(/([^)]+)\)", r"url(../\1)", text)


def inline_svg_in_css(text, staging):
    def replace_svg_url(m):
        path_str = m.group(1)
        rel = path_str.lstrip("./")
        svg_path = staging / rel
        if svg_path.exists():
            return f"url({svg_to_data_uri(svg_path)})"
        return m.group(0)
    text = re.sub(r"url\(([^)]*icons/theme\.svg[^)]*)\)", replace_svg_url, text)
    return text


def inject_file_guard(text):
    """Replace the search bar div with a placeholder when on file:///"""
    guard = """<script>
(function(){if(location.protocol==='file:'){var s=document.getElementById('search-area');if(s){s.innerHTML='<div style="font-family:Literata Variable,Georgia,serif;font-size:.8em;padding:.35em .75em;color:var(--text-muted);border:1px dashed var(--border);border-radius:.25em;text-align:center;line-height:1.4"><span style="opacity:0.6">Search needs the local server</span><br><span style="opacity:0.4;font-size:.85em">Run <b>start.bat</b> (Windows) or <b>start.sh</b> (Mac/Linux)</span></div>';}}})();
</script>"""
    text = text = re.sub(r'(<div[^>]*id="search-area"[^>]*>)', lambda m: m.group(1) + guard, text, 1)
    return text


def patch_pagefind_js(text):
    return text.replace("/pagefind/", "./")


def depth_prefix(file_path, staging_root):
    rel = file_path.relative_to(staging_root)
    parts = len(rel.parents) - 1
    if parts <= 0:
        return "./"
    return "../" * parts


def make_start_script():
    return """#!/bin/bash
echo ""
echo "  Glass Empires SRD -- Starting local server..."
echo "  Open http://localhost:8765 in your browser"
echo ""
if command -v python3 &> /dev/null; then
    python3 -m http.server 8765
elif command -v python &> /dev/null; then
    python -m http.server 8765
else
    echo "  ERROR: Python required: https://www.python.org/downloads/"
    read -p "  Press Enter to exit..."
fi
"""


def make_bat_script():
    return """@echo off
echo.
echo   Glass Empires SRD -- Starting local server (port 8765)...
echo.
python -m http.server 8765
if errorlevel 1 (
    python3 -m http.server 8765
)
if errorlevel 1 (
    echo.
    echo   ERROR: Python required: https://www.python.org/downloads/
    pause
)
"""


def make_readme():
    return """Glass Empires SRD -- Offline Version

HOW TO OPEN
-----------
  Quick: Open index.html in Firefox (everything works).

  Chrome: Run the local server for full search/features:
    Windows: Double-click start.bat
    macOS/Linux: Double-click start.sh
    Then open http://localhost:8765

  Note: Opening index.html directly in Chrome will show the SRD
  content fine, but search and theme icon need the server.

WHAT'S INCLUDED
---------------
  Complete Glass Empires SRD: rules, bestiary, lore, magic,
  factions, combat, GM resources. Offline, no internet needed.

  New versions: https://srd.glassempires.com
  Announced: https://sakiroku.com
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
            html_file.write_text(inline_assets(html_file.read_text(), staging))

        for css_file in sorted(staging.rglob("*.css")):
            css_file.write_text(relativise_css(css_file.read_text()))

        for html_file in sorted(staging.rglob("*.html")):
            prefix = depth_prefix(html_file, staging)
            html_file.write_text(relativise_html(html_file.read_text(), prefix))

        for html_file in sorted(staging.rglob("*.html")):
            html_file.write_text(inline_svg_in_css(html_file.read_text(), staging))

        for html_file in sorted(staging.rglob("*.html")):
            html_file.write_text(inject_file_guard(html_file.read_text()))

        for pf_js in sorted(staging.rglob("pagefind/*.js")):
            pf_js.write_text(patch_pagefind_js(pf_js.read_text()))

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
