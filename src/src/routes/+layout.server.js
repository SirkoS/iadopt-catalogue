import { getSettings } from '$lib/store/settings.ts';

export async function load({ params }) {
  return {
    ... params,
    settings: await getSettings()
  };

};
