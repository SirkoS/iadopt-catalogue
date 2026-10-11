import { getSettings } from '$lib/store/settings';

export async function load({ params }) {
  return {
    ... params,
    settings: await getSettings()
  };

};
