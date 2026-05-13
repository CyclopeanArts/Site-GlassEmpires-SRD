/**
 * Astro integration: generates public/page-previews.json.
 *
 * Dev mode: runs once on server start after initial content sync,
 * then watches content files for changes and regenerates.
 * Build mode: runs the content-source generator.
 */
import { execSync } from 'child_process';
import { join } from 'path';

function runGenerator() {
  try {
    execSync('node scripts/generate-previews.js', {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    return true;
  } catch (e) {
    console.warn('[page-previews] generation failed:', e.message);
    return false;
  }
}

export default function pagePreviewsIntegration() {
  let initialized = false;
  let debounceTimer = null;

  return {
    name: 'page-previews',
    hooks: {
      'astro:server:setup': ({ server }) => {
        // Generate once after the initial content sync settles
        setTimeout(() => {
          console.log('[page-previews] initial generation');
          runGenerator();
          initialized = true;
        }, 3000);

        // Watch content files, but only after initial generation is done
        const watcher = server.watcher;
        watcher.on('all', (event, path) => {
          if (!initialized) return;
          // Only react to content directory changes
          if (!path.includes('src/content')) return;
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            console.log('[page-previews] content changed, regenerating\u2026');
            runGenerator();
          }, 1500);
        });
      },
      'astro:build:done': async () => {
        runGenerator();
      },
    }
  };
}
