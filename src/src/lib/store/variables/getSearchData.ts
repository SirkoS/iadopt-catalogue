
import type { Entity } from '#lib/util/model/models.js';
import { VARIABLES } from './getVariable';
import { getVariables } from './getVariables';
import { harmonizePath } from './harmonizePath';

const SEARCHDATA : SearchData | undefined = undefined;

/**
 * mapping labels to variables (inverse search index)
 * labels are in lower-case
 * variables are identified by their path
 */
export type SearchData = {
  property: Record< string, string[] >,
  ooi:      Record< string, string[] >,
  matrix:   Record< string, string[] >,
  context:  Record< string, string[] >,
  statmod:  Record< string, string[] >,
}

/**
 * return the data basis for main page search
 */
export async function getSearchData() {

  // short circuit
  if( SEARCHDATA ) {
    return SEARCHDATA;
  }

  const result : SearchData = {
    property: {},
    ooi:      {},
    matrix:   {},
    context:  {},
    statmod:  {},
  };


  // add entities to their section
  function add( path: string, entities: Entity[], target: Record< string, string[]> ) {

    // prepare
    // flatten systems
    entities = entities
      .filter( (e) => !!e ) // skip empty parts
      .map( (e) => e.isSystem() ? Object.values(e.getComponents()).flat() : e )
      .flat();

    // add to collection
    for( const entity of entities ) {
      const usedLabel = (entity.getLabel() || '').toLocaleLowerCase();
      target[ usedLabel ] = target[ usedLabel ] || [];
      target[ usedLabel ].push( harmonizePath( path ) ); // use canonical web paths
    }

  }

  // process all variables
  await getVariables(); // make sure cache is filled
  for( const [path, variable] of Object.entries( VARIABLES ) ) {

    add( path, [ variable.getProperty() ],            result.property );
    add( path, [ variable.getObjectOfInterest() ],    result.ooi );
    add( path, [ variable.getMatrix() ],              result.matrix );
    add( path, variable.getContextObjects(),          result.context );
    add( path, [ variable.getStatisticalModifier() ], result.statmod );

  }

  // done
  return result;

}
