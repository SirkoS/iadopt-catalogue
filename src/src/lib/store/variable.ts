import extract from '$lib/util/extract.js';
import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Variable } from '$lib/util/model/models';


// memoization
const VARIABLES : Record<string, Variable> = {};
let VARIABLE_LIST :  SectionEntry | undefined = undefined;
const PARSER_ERRORS : Record<string, unknown> = {};
const RAWS : Record<string, string> = {};


// root path to load RDF-files
// https://stackoverflow.com/a/55944697/1169798
const pathComponents = Path.dirname( fileURLToPath(import.meta.url) ).split( Path.sep );
while( (pathComponents.length > 0) && (pathComponents.pop() != 'src' ) ) {}
export const PATH_ROOT = process.env.SOURCE_PATH
  ? process.env.SOURCE_PATH
  : Path.join( ... pathComponents, 'test' );


export type VariableList = {
  title:    string,
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
      variable = await getVariable( rawFilePath );
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
      title:    variable.getLabel() ?? variable.getShortIri(),
      comment:  variable.getComment(),
      path:     rawFilePath.replace( /\\/g, '/' ),  // use canonical web paths
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



/**
 * get the Variable object from the given turtle file
 */
export async function getVariable( path: string ) : Promise<Variable> {

  // short-circuit
  if( path in VARIABLES ) {
    return VARIABLES[ path ];
  }
  if( path in PARSER_ERRORS ) {
    throw PARSER_ERRORS[ path ];
  }

  try {
    // path to file
    const filePath = Path.join( PATH_ROOT, path );

    // retrieve file content
    const raw = await Fs.readFile( filePath, 'utf8' );
    const variable = (await extract( raw ))[0];

    // attempt to get the issue link
    const issue = raw.match( /ex:issue "([^"]+)"/ )?.[1];
    if( issue && variable ) {
      variable.issue = issue;
    }

    // memorize
    RAWS[ path ] = raw;
    VARIABLES[ path ] = variable;
    return variable;

  } catch( e ) {

    // memorize error and pass on
    PARSER_ERRORS[ path ] = e;
    throw e;

  }

}


/**
 * retrieve the raw turtle file
 */
export async function getRaw( path:string ) : Promise<string | undefined> {

  // short-circuit
  if( path in RAWS ) {
    return RAWS[ path ];
  }

  // trigger loading
  await getVariable( path );

  // now it should be in our store
  return RAWS[ path ];

}
