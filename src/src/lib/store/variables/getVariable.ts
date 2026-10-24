import { Entity, Variable } from '#lib/util/model/models.js';
import { getRaw } from './getRaw';
import extract from '#lib/util/extract.js';
import { getSearchData, type SearchData } from './getSearchData';
import { harmonizePath } from './harmonizePath';

/** already parsed variables */
export const VARIABLES : Record<string, Variable> = {};
/** known related variables */
const RELATED : Record<string, RelatedVariables> = {};
/** errors during processing */
const PARSER_ERRORS : Record<string, unknown> = {};

export type LabeledVariable = {
  label: string,
  path: string,
}
export type RelatedVariables ={

    // by type
    property: LabeledVariable[],
    ooi:      LabeledVariable[],
    matrix:   LabeledVariable[],
    context:  LabeledVariable[],
    statmod:  LabeledVariable[],

    // by hierarchy
    broader: LabeledVariable[],
    narrower: LabeledVariable[],

  }
export type VariableDetails = {
  variable: Variable,
  related:  RelatedVariables,
}

export async function getPlainVariable( path: string ) : Promise<Variable> {

  // short-circuit
  if( path in VARIABLES ) {
    return VARIABLES[ path ];
  }
  if( path in PARSER_ERRORS ) {
    throw PARSER_ERRORS[ path ];
  }

  try {

    // path to file
    const raw = await getRaw( path );
    const variable = (await extract( raw ))[0];

    // attempt to get the issue link
    const issue = raw.match( /ex:issue "([^"]+)"/ )?.[1];
    if( issue && variable ) {
      variable.issue = issue;
    }

    // memorize
    VARIABLES[ path ] = variable;
    return VARIABLES[ path ];

  } catch( e ) {

    // memorize error and pass on
    PARSER_ERRORS[ path ] = e;
    throw e;

  }

}


/**
 * get the Variable object from the given turtle file
 */
export async function getVariable( path: string ) : Promise<VariableDetails> {

  // short-circuit on errors
  if( path in PARSER_ERRORS ) {
    throw PARSER_ERRORS[ path ];
  }


  // get plain variable
  const variable = await getPlainVariable( path );

  // short-circuit on data
  if( path in RELATED ) {
    return {
      variable,
      related: RELATED[ path ]
    };
  }

  try {

    // get search data as a basis
    const searchData = await getSearchData();

    // memorize
    RELATED[ path ] = {
      property: await prepOutput( path, searchData.property[ variable.getProperty()?.getLabel() || '' ] ),
      ooi:      await prepOutput( path, processSystem( variable.getObjectOfInterest(), 'ooi', searchData ) ),
      matrix:   await prepOutput( path, processSystem( variable.getMatrix(), 'matrix', searchData ) ),
      context:  await prepOutput( path, variable.getContextObjects().flatMap( (c) => processSystem( c, 'context', searchData ) ) ),
      statmod:  await prepOutput( path, searchData.statmod[ variable.getStatisticalModifier()?.getLabel() || '' ] ),

      broader:  [],
      narrower: [],
    };
    return {
      variable,
      related: RELATED[ path ]
    };

  } catch( e ) {

    // memorize error and pass on
    PARSER_ERRORS[ path ] = e;
    throw e;

  }

}

/**
 * Helper function for getVariable
 * convert from paths to shortened outputs
 */
async function prepOutput(ownPath: string, paths: string[] | undefined) {

  // no input
  if( !paths || !paths.length ) {
    return [];
  }

  // make paths unique
  const uniquePaths = Array.from( new Set( paths ) )
    .filter( (p) => p != ownPath ); // remove variable itself from the list

  // get data from corresponding variables
  return (await Array
    .fromAsync(
      uniquePaths.filter( (p) => p )
        .map( async (p) => {
          const variable = await getPlainVariable( p );
          return {
            label: variable?.getLabel() || '[unlabeled Variable]',
            path: harmonizePath( p )
          };
        })
    ))
    .sort( (a,b) => a.label.localeCompare( b.label ) );

};


/**
 * Helper function for getVariable
 * take all parts of a system and flatten them
 */
function processSystem(
  entity: Entity,
  prop: keyof SearchData,
  searchData: SearchData
) : string[] {

  if( !entity ) {

    // no input
    return [];

  } else if( entity.isSystem() ) {

    // system input
    return Object.values( entity.getComponents() )
      .flat()
      .flatMap( (e) => searchData[ prop ][ e?.getLabel() || '' ] );

  } else {

    // single entity - no system
    return searchData[ prop ][ entity?.getLabel() || '' ];

  }

}
