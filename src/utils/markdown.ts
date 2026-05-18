/**
 * Shared markdown rendering utilities for the SRD.
 * Extracted from Ref.astro so page templates can use the same renderer.
 */
import { getSlugMap } from '../config/slug-resolver.js';

const _slugMap = getSlugMap();

export function wikilinksToHtml(text: string): string {
  return text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, s, lbl) => {
      const found = _slugMap[s];
      return `<a href="${found ? found.path : '/rules/' + s}">${lbl}</a>`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_, s) => {
      const found = _slugMap[s];
      return `<a href="${found ? found.path : '/rules/' + s}">${found ? found.title : s}</a>`;
    });
}

export function mdToHtml(md: string): string {
  return wikilinksToHtml(md)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function renderTableBlock(text: string): string {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return text;

  const headerMatch = lines[0].match(/^\|(.+)\|$/);
  if (!headerMatch) return text;

  const headers = headerMatch[1].split('|').map(h => h.trim());
  const bodyRows = lines.slice(2).filter(l => l.match(/^\|.+\|$/));

  let html = '<table class="ref-clipping-table"><thead><tr>';
  for (const h of headers) {
    html += `<th>${h.replace(/\*(\*?.+?\*?)\*/g, '<strong>$1</strong>')}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of bodyRows) {
    const cells = row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
    html += '<tr>';
    for (const cell of cells) {
      html += `<td>${mdToHtml(cell)}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

export function renderFullMarkdown(text: string): string {
  const blocks = text.split(/\n\n+/);
  const parts: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');

    // Table detection
    if (lines.some(l => l.trim().match(/^\|.+\|$/))) {
      parts.push(renderTableBlock(trimmed));
      continue;
    }

    // Heading detection
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/m);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const tag = `h${Math.min(level + 2, 6)}`;
      parts.push(`<${tag} class="ref-clipping-heading">${mdToHtml(headingMatch[2])}</${tag}>`);
      continue;
    }

    // Ordered list detection
    const hasOrderedItems = lines.some(l => l.trim().match(/^\d+\.\s/));
    if (hasOrderedItems) {
      const items = lines
        .filter(l => l.trim().match(/^\d+\.\s/))
        .map(l => `<li>${mdToHtml(l.trim().replace(/^\d+\.\s/, ''))}</li>`);
      parts.push(`<ol>${items.join('\n')}</ol>`);
      continue;
    }

    // Unordered list detection
    const hasListItems = lines.some(l => l.trim().match(/^[-*]\s/));
    if (hasListItems) {
      const items = lines
        .filter(l => l.trim().match(/^[-*]\s/))
        .map(l => `<li>${mdToHtml(l.trim().replace(/^[-*]\s/, ''))}</li>`);
      parts.push(`<ul>${items.join('\n')}</ul>`);
      continue;
    }

    // Callout detection
    if (trimmed.startsWith('<Callout') || trimmed.startsWith('</Callout')) {
      parts.push(trimmed);
      continue;
    }

    // Regular paragraph
    const withBreaks = trimmed.replace(/\n/g, '<br>');
    parts.push(`<p>${mdToHtml(withBreaks)}</p>`);
  }

  return parts.join('\n');
}
