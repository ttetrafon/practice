// TODO: add unit tests for this...
export function compareObjects(o: any, p: any, skipFunctions: boolean = true) {
  let i: number;
  const keysO: string[] = Object.keys(o).sort();
  const keysP: string[] = Object.keys(p).sort();

  // check number of keys
  if (keysO.length !== keysP.length)
    return false;

  // check key names
  if (keysO.join('') !== keysP.join(''))
    return false;

  for (i = 0; i < keysO.length; ++i) {
    if (o[keysO[i]] instanceof Array) {
      if (!(p[keysO[i]] instanceof Array)) return false;
      if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join('')) return false;
    }
    else if (o[keysO[i]] instanceof Date) {
      if (!(p[keysO[i]] instanceof Date))
        return false;
      if (('' + o[keysO[i]]) !== ('' + p[keysO[i]]))
        return false;
    }
    else if (o[keysO[i]] instanceof Function) {
      if (skipFunctions) continue;
      else {
        if (!(p[keysO[i]] instanceof Function)) return false
      };
    }
    else if (o[keysO[i]] instanceof Object) {
      if (!(p[keysO[i]] instanceof Object)) return false;
      if (o[keysO[i]] === o) {
        if (p[keysO[i]] !== p) return false;
      }
      else if (compareObjects(o[keysO[i]], p[keysO[i]]) === false) return false;
    }
    if (o[keysO[i]] !== p[keysO[i]]) return false;
  }
  return true;
}
