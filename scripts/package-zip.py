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


def inject_base(text, prefix):
    """Inject <base href="{prefix}"> after <head> (or <head ...>).
    This makes ALL root-absolute URLs (src, href, JS fetch, etc.)
    resolve correctly from any file depth.
    """
    text = re.sub(r'(<head[^>]*>)', lambda m: f'{m.group(1)}\n<base href="{prefix}">', text)
    return text


def relativise_css(text):
    """Relativise CSS url() references.
    Astro puts both CSS and referenced assets (fonts, etc.) in _astro/,
    so url(/_astro/foo) becomes url(./foo) for same-directory resolution.
    """
    return re.sub(r"url\(/_astro/", "url(./", text)


def depth_prefix(file_path, staging_root):
    """Calculate the relative prefix to reach the root from a file's location."""
    rel = file_path.relative_to(staging_root)
    parts = len(rel.parents)  # number of directories deep
    if parts == 0:
        return "./"
    return "../" * parts


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
            html_file.write_text(inject_base(html_file.read_text(), prefix))

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
