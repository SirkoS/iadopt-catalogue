import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: process.env.TARGET_PATH ?? 'build',
    }),
    prerender: {
      handleMissingId: 'warn',
    }
  },
};

export default config;
