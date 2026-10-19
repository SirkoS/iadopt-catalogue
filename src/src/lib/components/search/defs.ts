export enum SearchMode {
  keyword=  0,
  property= 1,
  ooi=      2,
  matrix=   3,
  context=  4,
  statMod=  5,
};


// constants for search modes
export const SearchModeLabels = [ 'Keyword', 'Property', 'Object of Interest', 'Matrix', 'Context Object', 'Statistical Modifier' ];

export const SearchModeClasses = [ 'keyword', 'property', 'ooi', 'matrix', 'context', 'statmod' ];


// entry for filter
export type SearchOption = {
  type: SearchMode,
  label: string,
};
