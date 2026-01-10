import extract from '$lib/util/extract.js';
import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml'

export type SettingsType = {
  /** title on top of the page */
  title: string;
  /** subtitle shown directly below the title */
  subtitle: string;
  /** footer */
  footer: string;
}

// memoization and default settings
let SETTINGS : SettingsType = {
  title:    'IAdopt Catalogue',
  subtitle: 'Collection of IAdopt Variables',
  footer:   '&copy; 2026 I-ADOPT. All rights reserved.'
};
let SETTINGS_LOADED = false;


// root path to load RDF-files
// https://stackoverflow.com/a/55944697/1169798
const pathComponents = Path.dirname( fileURLToPath(import.meta.url) ).split( Path.sep );
while( (pathComponents.length > 0) && (pathComponents.pop() != 'src' ) ) {}
export const PATH_ROOT = process.env.SOURCE_PATH
  ? process.env.SOURCE_PATH
  : Path.join( ... pathComponents, 'test' );


export async function getSettings() {

  // short-circuit
  if( SETTINGS_LOADED ) {
    return SETTINGS;
  }

  try {

    // path to file
    const filePath = Path.join( PATH_ROOT, '.iadopt-catalogue.yml' );

    // retrieve file content
    const raw = await Fs.readFile( filePath, 'utf8' );
    const loadedSettings = await parse( raw );

    // update memorized settings
    SETTINGS = {
      ... SETTINGS,
      ... loadedSettings,
    };
    SETTINGS_LOADED = true;

    return SETTINGS;

  } catch {}

}
