import { PATH_ROOT } from '#lib/store/settings.js';
import { getSearchData, getVariables, } from '#lib/store/variable.js';

export async function load() {
  return {
    variables:  await getVariables(),
    searchData: await getSearchData(),
    root: PATH_ROOT,
  };
}
