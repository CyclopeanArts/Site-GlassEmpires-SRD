/**
 * remark-wikilinks — transforms [[slug]] and [[slug|text]] into links.
 *
 * Uses the shared slug-resolver for auto-discovery. Zero maintenance:
 * add a new file and [[new-slug]] automatically resolves.
 */
import { getSlugMap } from './src/config/slug-resolver.js';

export default function remarkWikilinks() {
  const slugMap = getSlugMap();

  function resolveSlug(slug) {
    const found = slugMap[slug];
    if (found) return found.path;
    return '/rules/' + slug;
  }

  function walk(node, parent, index) {
    if (!node) return;

    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        walk(node.children[i], node, i);
      }
    }

    if (node.type !== 'text') return;
    if (!parent || index === undefined) return;

    const text = node.value;
    const regex = /\[\[([^\]]+)\]\]/g;
    const matches = [...text.matchAll(regex)];
    if (matches.length === 0) return;

    const newNodes = [];
    let lastIndex = 0;

    for (const match of matches) {
      if (match.index > lastIndex) {
        newNodes.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }

      const inner = match[1];
      const pipeIdx = inner.indexOf('|');
      const slug = pipeIdx >= 0 ? inner.slice(0, pipeIdx).trim() : inner.trim();
      const label = pipeIdx >= 0 ? inner.slice(pipeIdx + 1).trim() : slug;
      const href = resolveSlug(slug);

      newNodes.push({
        type: 'link',
        url: href,
        children: [{ type: 'text', value: label }],
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      newNodes.push({ type: 'text', value: text.slice(lastIndex) });
    }

    parent.children.splice(index, 1, ...newNodes);
  }

  return (tree) => walk(tree);
}
