import { PATH_ROOT } from '#lib/store/settings.js';
import { getVariables, } from '#lib/store/variable.js';

export async function load() {
  return {
    variables: await getVariables(),
    root: PATH_ROOT,
  };
}
