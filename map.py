import os, re, json

CONTENT = "src/content"
DATA = ["conditions", "glossary", "bestiary", "moves", "spirits", "tables"]
PROSE = ["rules", "lore", "gm-guide"]

entries = {}

for coll in DATA:
    d = os.path.join(CONTENT, coll)
    if os.path.exists(d):
        for f in sorted(os.listdir(d)):
            if f.startswith(".") or f.startswith("_"):
                continue
            slug = re.sub(r"\.(yaml|yml|mdx|md)$", "", f)
            path = f"/{coll}/{slug}"
            with open(os.path.join(d, f)) as fh:
                text = fh.read(500)
            m = re.search(r"^name:\s*(.+)$", text, re.M)
            title = m.group(1).strip().strip("\"'") if m else slug
            entries[slug] = {"path": path, "title": title}

def walk_prose(base, coll, prefix=""):
    d = os.path.join(base, coll)
    if not os.path.exists(d):
        return
    for name in sorted(os.listdir(d)):
        if name.startswith(".") or name.startswith("_"):
            continue
        fp = os.path.join(d, name)
        if os.path.isdir(fp):
            walk_prose(base, coll, f"{prefix}/{name}" if prefix else name)
        elif name.endswith(".mdx") or name.endswith(".md"):
            slug = re.sub(r"\.(mdx|md)$", "", name)
            rel_path = f"{prefix}/{slug}" if prefix else slug
            path = f"/{coll}/{rel_path}"
            with open(fp) as fh:
                text = fh.read(500)
            m = re.search(r"^title:\s*(.+)$", text, re.M)
            title = m.group(1).strip().strip("\"'") if m else slug
            entries[f"{coll}/{rel_path}"] = {"path": path, "title": title}

for coll in PROSE:
    walk_prose(CONTENT, coll)

print(json.dumps(entries, indent=2))
