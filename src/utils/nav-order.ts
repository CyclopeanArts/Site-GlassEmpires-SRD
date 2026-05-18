/**
 * nav-order.ts — flattens nav.ts into a linear reading order.
 *
 * Every slug/href in the nav tree gets a position. Pages are assigned
 * prev/next based on their position in this flattened list.
 * Pages not in the nav tree fall back to collection-alphabetical ordering.
 */
import type { NavItem } from '../config/nav';
import { getSlugMap } from '../config/slug-resolver';

export interface NavOrderEntry {
  href: string;
  label: string;
}

let _flat: NavOrderEntry[] | null = null;

function flatten(items: NavItem[], into: NavOrderEntry[]): void {
  for (const item of items) {
    if (typeof item === 'string') {
      // Bare slug — resolve via slug-resolver
      const map = getSlugMap();
      const entry = map[item];
      if (entry) {
        into.push({ href: entry.path, label: entry.title });
      }
    } else if ('href' in item && item.href) {
      // Explicit href — use as-is
      into.push({ href: item.href, label: item.label ?? item.href });
    } else if ('slug' in item && item.slug) {
      // Section landing page — resolve slug first, then recurse children
      const map = getSlugMap();
      const entry = map[item.slug];
      if (entry) {
        into.push({ href: entry.path, label: entry.title });
      }
      if (item.children) {
        flatten(item.children, into);
      }
    } else if ('label' in item && item.children) {
      // Grouping with no landing page — just recurse children
      flatten(item.children, into);
    }
  }
}

export function getNavOrder(): NavOrderEntry[] {
  if (_flat) return _flat;
  const { nav } = require('../config/nav');
  _flat = [];
  flatten(nav, _flat);
  return _flat;
}

export function getNavPosition(path: string): number {
  const order = getNavOrder();
  const normalized = path.replace(/\/+$/, '');
  return order.findIndex(e => e.href === normalized);
}
