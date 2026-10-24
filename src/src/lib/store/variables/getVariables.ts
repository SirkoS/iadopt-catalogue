import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { PATH_ROOT } from '../settings';
import { getPlainVariable } from './getVariable';
import { harmonizePath } from './harmonizePath';


// memoization
let VARIABLE_LIST :  SectionEntry | undefined = undefined;



export type VariableList = {
  label:    string,
  path:     string,
  section:  string,
  comment:  string,
}
export type SectionEntry = {
  label:      string,
  extLabel:   string,
  id:         string,
  variables:  VariableList[],
  children:   Record< string, SectionEntry >,
}


/**
 * retrieve all Variables
 */
export async function getVariables() : Promise< SectionEntry > {

  // short circuit
  if( VARIABLE_LIST ) {
    return VARIABLE_LIST;
  }

  const result : SectionEntry = {
    label:      'root',
    extLabel:   'root',
    id:         'root',
    variables:  [],
    children:   {},
  };

  // scan for RDF files
  for await(const rawFilePath of Fs.glob( '**/*.ttl', { cwd: PATH_ROOT } ) ) {

    // skip templates
    if( rawFilePath.includes( 'template' ) ) {
      continue;
    }

    // get variable
    let variable;
    try {
      variable = await getPlainVariable( rawFilePath );
    } catch( e ) {
      console.error( rawFilePath + ' - ' + (e as Error).message );
      continue;
    }
    if( !variable ) {
      console.error( rawFilePath + ' - Could not extract variable!' );
      continue;
    }

    // add to results
    const entry : VariableList = {
      label:    variable.getLabel() ?? variable.getShortIri(),
      comment:  variable.getComment(),
      path:     harmonizePath( rawFilePath ),  // use canonical web paths
      section:  Path.dirname( rawFilePath ),
    };

    // add to tree
    const sections = entry.section.split( Path.sep );
    const path = [];
    let runner : SectionEntry = result;
    for( const section of sections ) {
      path.push(section);
      if( !(section in runner.children) ) {
        runner.children[ section ] = {
          label:      section,
          extLabel:   path.join( ' - ' ),
          id:         path.join( Path.sep ).replace(/[^a-zA-Z0-9]/gi, '' ),
          variables:  [],
          children:   {}
        };
      }
      runner = runner.children[ section ];
    }
    runner.variables.push( entry );

  }

  // memorize
  VARIABLE_LIST = result;
  return result;

}
