import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { PATH_ROOT } from '../settings';



const RAWS : Record<string, string> = {};
const PARSER_ERRORS : Record<string, unknown> = {};


/**
 * retrieve the raw turtle file
 */
export async function getRaw( path: string ) : Promise<string> {

  // short-circuit
  if( path in RAWS ) {
    return RAWS[ path ];
  }
  if( path in PARSER_ERRORS ) {
    throw PARSER_ERRORS[ path ];
  }

  // trigger loading
  try {

    // path to file
    const filePath = Path.join( PATH_ROOT, path );

    // retrieve file content
    const raw = await Fs.readFile( filePath, 'utf8' );

    // memorize
    RAWS[ path ] = raw;
    return raw;

  } catch( e ) {

    // memorize error and pass on
    PARSER_ERRORS[ path ] = e;
    throw e;

  }

}
