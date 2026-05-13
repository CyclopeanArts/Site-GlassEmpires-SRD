#!/usr/bin/env node
/**
 * Generate public/page-previews.json from content source files.
 *
 * For prose pages (rules, lore, gm-guide): extracts the first real
 * body paragraph after frontmatter -- skips headings, callouts,
 * tables, and component tags. Falls back to summary only if no
 * body text is found.
 *
 * For data collections (conditions, bestiary, etc.): uses the
 * summary YAML field, truncated to 200 chars.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const CONTENT_DIR = 'src/content';
const PUBLIC_DIR = 'public';
const MAX_PREVIEW = 200;

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return {};
  const end = text.indexOf('\n---', 3);
  if (end === -1) return {};
  const data = {};
  for (const line of text.slice(4, end).split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.slice(0, colon).trim();
      let val = line.slice(colon + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  }
  return data;
}

function collectFiles(dir, exts) {
  const results = [];
  try {
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.') || name.startsWith('_')) continue;
      const full = join(dir, name);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          results.push(...collectFiles(full, exts));
        } else if (exts.includes(extname(name))) {
          results.push(full);
        }
      } catch {}
    }
  } catch {}
  return results;
}

function extractBodyPreview(body) {
  const lines = body.split('\n');
  let inCallout = false;

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith('<!--')) continue;
    if (t.startsWith('<Callout')) { inCallout = true; continue; }
    if (inCallout && t === '</Callout>') { inCallout = false; continue; }
    if (inCallout) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('|')) continue;
    if (t.startsWith('- ') || t.startsWith('-  ')) continue;
    if (t.startsWith('>')) continue;
    if (t.startsWith('<')) continue;
    if (t.startsWith('@')) continue;

    if (t.length > MAX_PREVIEW) {
      const cut = t.lastIndexOf(' ', MAX_PREVIEW);
      return t.slice(0, cut > 0 ? cut : MAX_PREVIEW) + '\u2026';
    }
    return t;
  }
  return '';
}

function main() {
  const baseDir = join(process.cwd(), CONTENT_DIR);
  const publicDir = join(process.cwd(), PUBLIC_DIR);
  mkdirSync(publicDir, { recursive: true });
  const previews = {};

  // Prose collections
  for (const coll of ['rules', 'lore', 'gm-guide']) {
    const collDir = join(baseDir, coll);
    for (const file of collectFiles(collDir, ['.mdx', '.md'])) {
      try {
        const text = readFileSync(file, 'utf-8');
        const fm = parseFrontmatter(text);
        if (fm.draft === 'true') continue;
        let rel = file.replace(baseDir, '').replace(/^\//, '');
        if (rel.startsWith(coll + '/')) rel = rel.slice(coll.length + 1);
        rel = rel.replace(/\.(mdx|md)$/, '');
        const slug = '/' + coll + '/' + rel;
        const title = fm.title || '';
        if (!title) continue;
        let preview = '';
        const fmEnd = text.indexOf('\n---', 3);
        if (fmEnd !== -1) {
          const bodyStart = text.indexOf('\n', fmEnd + 4);
          if (bodyStart !== -1) preview = extractBodyPreview(text.slice(bodyStart + 1));
        }
        if (!preview) preview = fm.summary || '';
        if (preview) previews[slug] = { title, preview };
      } catch {}
    }
  }

  // Data collections
  for (const coll of ['conditions', 'glossary', 'bestiary', 'moves', 'spirits', 'tables']) {
    const collDir = join(baseDir, coll);
    for (const file of collectFiles(collDir, ['.yaml', '.yml'])) {
      try {
        const text = readFileSync(file, 'utf-8');
        const nameMatch = text.match(/^name:\s*(.+)$/m);
        if (!nameMatch) continue;
        let rel = file.replace(baseDir, '').replace(/^\//, '');
        if (rel.startsWith(coll + '/')) rel = rel.slice(coll.length + 1);
        rel = rel.replace(/\.(yaml|yml)$/, '');
        const slug = '/' + coll + '/' + rel;
        const title = nameMatch[1].replace(/^["']|["']$/g, '');
        const sm = text.match(/^summary:\s*(.+)$/m);
        const preview = sm ? sm[1].replace(/^["']|["']$/g, '').slice(0, MAX_PREVIEW) : '';
        if (title) previews[slug] = { title, preview };
      } catch {}
    }
  }

  const outPath = join(publicDir, 'page-previews.json');
  writeFileSync(outPath, JSON.stringify(previews));
  console.log('[page-previews] wrote ' + Object.keys(previews).length + ' entries to ' + outPath);
}

main();
