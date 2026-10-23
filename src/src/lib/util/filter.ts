import type { SearchData, SectionEntry, VariableList } from '#lib/store/variable.js';

export type FilterOption = {
  keyword:   string[],
  property?: string[],
  ooi?:      string[],
  matrix?:   string[],
  context?:  string[],
  statmod?:  string[],
}

/**
 * given the list of needles, return a list of all items that are supposed to be hidden
 */
export default function filter( item: SectionEntry, needles: FilterOption, searchData?: SearchData ) : Set<SectionEntry | VariableList>{

  // normalize input
  const search : FilterOption = {
    // search params
    keyword:  needles.keyword?.map( (l) => l.toLocaleLowerCase() ),
    property: needles.property?.map( (l) => l.toLocaleLowerCase() ),
    ooi:      needles.ooi?.map( (l) => l.toLocaleLowerCase() ),
    matrix:   needles.matrix?.map( (l) => l.toLocaleLowerCase() ),
    context:  needles.context?.map( (l) => l.toLocaleLowerCase() ),
    statmod:  needles.statmod?.map( (l) => l.toLocaleLowerCase() ),
  };

  // identify matching variables for everything but keywords
  let varFilter : Set<string> | undefined;
  if( searchData ) {

    // get hits per query
    const perNeedle = Object.entries( search )
      // remove keyword section
      .filter( ([key,]) => key != 'keyword' )
      // target only set filters
      .filter( ([, val]) => val && val.length )
      // collect variables per component
      .flatMap( ([ key, val]) =>  val.map( (v) => {

        // get labels from corresponding index
        return Object.keys( searchData[ key as keyof SearchData ] )
          // filter matching ones
          .filter( (k) => k.includes( v ))
          // and return all matching variables
          .map( (k) => searchData[ key as keyof SearchData ][ k ] )
          // combine for this single search needle via "OR"
          .flat();

      }) );

    // combine all search terms via "AND"
    if( perNeedle.length ) {
      varFilter = new Set( perNeedle[0] );
      for( let i=1; i<perNeedle.length; i++ ) {
        varFilter = varFilter.intersection( new Set( perNeedle[ i ] ) );
      }
    }

  }

  // short-circuit for no filter
  if ( !varFilter && (!needles.keyword || !needles.keyword.length) ) {
    return new Set();
  }

  // short-circuit for unrealizable filter
  if( varFilter && !varFilter.size ) {
    console.log( 'short-ci');
    // hiding top level, will implicitly hide all children
    return new Set( Object.values( item.children || {}) ).union( new Set( item.variables ));
  }

  // traverse list to hide entries
  return recFilter( item, needles.keyword, varFilter );
}



/**
 * traverse the item list to hide parts of it
 */
function recFilter( item: SectionEntry, keywords: string[], varFilter: Set<string> | undefined ) {

  // collect hidden items
  let result = new Set<SectionEntry | VariableList>();

  // check node itself
  // if this hits, all children remain visible
  if( keywords?.some( (k) => item.label?.toLocaleLowerCase().includes( k ) ) ) {
    return result;
  }

  // otherwise check all child sections
  result = Object.values( item.children )
    .map( (c) => recFilter( c, keywords, varFilter ) )
    .reduce( (all, el) => all.union( el ), result );

  // check all child variables
  let hasVisibleVariable = false;
  if( item.variables?.length ) {
    for( const variable of item.variables ) {

      const variableLabel = variable.label?.toLocaleLowerCase();
      const variableDesc  = variable.comment?.toLocaleLowerCase();
      if(
        (
          // there are keywords
          keywords
          // check in title
          && !keywords?.some( (k) => variableLabel.includes( k ) )
          // check in description
          && !keywords?.some( (k) => variableDesc.includes( k ) )
        )
        || (
          // needs to be in variable list if defined
          varFilter && !varFilter.has( variable.path )
        )
      ) {
        result.add( variable );
      } else {
        hasVisibleVariable = true;
      }


    }
  }

  // item gets hidden, if all children (sections & variables) are hidden
  if( !hasVisibleVariable && !Object.values( item.children ).some( (c) => !result.has( c ) ) ) {
    result.add( item );
  }

  // done
  return result;

}
