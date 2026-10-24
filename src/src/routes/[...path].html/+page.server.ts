import { getVariable, getVariables } from '#lib/store/variable.js';
import toJSONLD from '#lib/util/model/toJSONLD.js';

export async function load({ params }) {

  // get corresponding variable
  const data = await getVariable( params.path.replace( '.html', '' ) );

  // pass everything on
  return {
    path:         params.path,
    variable:     toJSONLD( data.variable ),
    issue:        data.variable.issue,
    variableList: await getVariables(),
    related:      data.related,
  };

};
