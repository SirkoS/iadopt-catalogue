import { promises as Fs } from 'node:fs';
import Path from 'node:path';

/**
 * determine the root path to look for configs and TTL files
 */
export default function getRootPath() {

  // github environment
  if( process?.env?.GITHUB_WORKSPACE ) {
    return process.env.GITHUB_WORKSPACE;
  }

  // specifically set path
  if( process?.env?.SOURCE_PATH ) {
    return process.env.SOURCE_PATH;
  }

  // default: use our local test path, e.g., during development
  // root path to load RDF-files
  return Path.join( process.cwd(), 'test' );

}
