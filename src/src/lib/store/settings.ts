import { promises as Fs } from 'node:fs';
import Path from 'node:path';
import { parse } from 'yaml';
import getRootPath from './settings/getRootPath';

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

// root path for TTL files & config
export const PATH_ROOT = getRootPath();

/**
 * load config
 */
export async function getSettings() {

  // short-circuit
  if( SETTINGS_LOADED ) {
    return SETTINGS;
  }

  let filePath;
  try {

    // path to file
    filePath = Path.join( PATH_ROOT, '.iadopt-catalogue.yml' );

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

  } catch {
    console.error( `Could not find configuration at ${filePath}. Using defaults.` );
    return SETTINGS;
  }

}
