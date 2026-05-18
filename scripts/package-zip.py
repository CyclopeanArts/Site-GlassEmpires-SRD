"""Build an offline-capable zip of the SRD site from dist/.

Usage: python scripts/package-zip.py
       python scripts/package-zip.py --dir /custom/path
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


def relativise_html(text):
    """Replace root-absolute src/href with dot-prefixed equivalents."""
    text = re.sub(r'\b(src|href)="(/)', r'\1="./', text)
    text = re.sub(r"\b(src|href)='(/)", r"\1='./", text)
    return text


def relativise_css(text):
    """Replace url(/) with url(./) in CSS files."""
    return re.sub(r"url\(/([^)]+)\)", r"url(./\1)", text)


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
            html_file.write_text(relativise_html(html_file.read_text()))

        for css_file in sorted(staging.rglob("*.css")):
            css_file.write_text(relativise_css(css_file.read_text()))

        local_ver = staging / "version.json"
        local_ver.write_text(json.dumps({"version": version}))

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
