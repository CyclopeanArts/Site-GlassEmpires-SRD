/**
 * Slug resolver: scans content collections at build time to build
 * a map of slug → { path, title }. Used by SideNav to resolve
 * nav entries without needing full href paths or labels.
 *
 * Registers both full slugs (classes/gangster) and bare slugs
 * (gangster) for nested files, so nav entries can use either form.
 * Last-registered wins on collisions.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = 'src/content';
const DATA_COLLECTIONS = ['conditions', 'bestiary', 'actions', 'spirits', 'tables'];
const PROSE_COLLECTIONS = ['rules', 'lore', 'gm-guide'];

let _slugMap = null;

function parseFrontmatterTitle(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const match = text.slice(0, end).match(/^title:\s*(.+)$/m);
  if (!match) return null;
  let title = match[1].trim();
  if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
    title = title.slice(1, -1);
  }
  return title;
}

export function getSlugMap() {
  if (_slugMap) return _slugMap;

  const cwd = process.cwd();
  _slugMap = {};
  const baseDir = join(cwd, CONTENT_DIR);

  // Data collections: flat YAML files
  for (const coll of DATA_COLLECTIONS) {
    const dir = join(baseDir, coll);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.') || name.startsWith('_')) continue;
      const fileSlug = name.replace(/\.(yaml|yml|mdx|md)$/, '');
      const path = `/${coll}/${fileSlug}`;

      let title = fileSlug;
      try {
        const text = readFileSync(join(dir, name), 'utf-8');
        const nameMatch = text.match(/^name:\s*(.+)$/m);
        if (nameMatch) title = nameMatch[1].replace(/^["']|["']$/g, '');
      } catch {}

      _slugMap[fileSlug] = { path, title };
    }
  }

  // Prose collections: nested MDX/MD files
  function walkProse(dir, coll, relDir = '') {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.') || name.startsWith('_')) continue;
      const full = join(dir, name);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          walkProse(full, coll, relDir ? `${relDir}/${name}` : name);
        } else if (name.endsWith('.mdx') || name.endsWith('.md')) {
          const fileSlug = name.replace(/\.(mdx|md)$/, '');
          const fullSlug = relDir ? `${relDir}/${fileSlug}` : fileSlug;
          const path = `/${coll}/${fullSlug}`;

          let title = fileSlug;
          try {
            const text = readFileSync(full, 'utf-8');
            const fmTitle = parseFrontmatterTitle(text);
            if (fmTitle) title = fmTitle;
          } catch {}

          // Register full slug AND bare slug alias
          _slugMap[fullSlug] = { path, title };
          _slugMap[fileSlug] = { path, title }; // bare alias — last wins on collision
        }
      } catch {}
    }
  }

  for (const coll of PROSE_COLLECTIONS) {
    walkProse(join(baseDir, coll), coll);
  }

  return _slugMap;
}
