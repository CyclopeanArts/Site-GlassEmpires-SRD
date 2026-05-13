import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';
import remarkWikilinks from './remark-wikilinks.js';
import pagePreviewsIntegration from './src/integrations/page-previews.js';

export default defineConfig({
  site: 'https://srd.glassempires.com',
  integrations: [mdx(), pagefind(), pagePreviewsIntegration()],
  build: { format: 'directory' },
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
});
