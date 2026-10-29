import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import getRootPath from '#lib/store/settings/getRootPath.ts';
import Path from 'node:path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      preprocess: vitePreprocess(),
      adapter: adapter({ pages: process.env.TARGET_PATH ?? Path.join( getRootPath(), 'build' ) }),
      prerender: { handleMissingId: 'warn' }
    })
  ]
});
