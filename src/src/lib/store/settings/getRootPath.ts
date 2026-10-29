import Path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  // https://stackoverflow.com/a/55944697/1169798
  const pathComponents = Path.dirname( fileURLToPath(import.meta.url) ).split( Path.sep );
  while( (pathComponents.length > 0) && (pathComponents.pop() != 'src' ) ) {}
  if( pathComponents.at(-1) == 'src' ) {
    pathComponents.pop();
  }
  return Path.join( ... pathComponents, 'test' );

}
