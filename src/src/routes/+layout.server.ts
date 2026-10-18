import { getSettings } from '#lib/store/settings.js';

export async function load({ params }) {
  return {
    ... params,
    settings: await getSettings()
  };

};
