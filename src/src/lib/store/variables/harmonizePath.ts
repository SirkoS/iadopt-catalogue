/**
 *  harmonize paths to be usable as web paths
 */
export function harmonizePath(p: string){
  return p.replace( /\\/g, '/' );
}
