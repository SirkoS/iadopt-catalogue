import type { SectionEntry, VariableList } from '$lib/store/variable';

type FilterOption = {
  keyword: string,
}

/**
 * given the list of needles, return a list of all items that are supposed to be hidden
 */
export default function filter( item: SectionEntry, needles: FilterOption ) : Set<SectionEntry | VariableList>{

  // normalize input
  needles.keyword = needles?.keyword?.toLocaleLowerCase();

  // collect hidden items
  let result = new Set<SectionEntry | VariableList>();

  // check node itself
  // if this hits, all children remain visible
  if( item.label?.toLocaleLowerCase().includes( needles.keyword ) ) {
    return result;
  }

  // otherwise check all child sections
  result = Object.values( item.children )
    .map( (c) => filter( c, needles ) )
    .reduce( (all, el) => all.union( el ), result );

  // check all child variables
  let hasVisibleVariable = false;
  if( item.variables?.length ) {
    for( const variable of item.variables ) {
      if( !variable.title?.toLocaleLowerCase().includes( needles.keyword ) ) {
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
