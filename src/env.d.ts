/// <reference types="astro/client" />

/**
 * Astro components used in MDX files are resolved at build time
 * without explicit imports. These declarations help the language
 * server provide prop autocomplete in .mdx files.
 */
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime';
  const component: AstroComponentFactory;
  export default component;
}
