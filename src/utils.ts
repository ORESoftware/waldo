

export interface SearchResult {
  warningsCount: number,
  warnings: Array<Error>,
  results: Array<string>
}


export interface WaldoOpts {
  isViaCLI?: boolean,
  dirs?: boolean,
  files?: boolean,
  symlinks?: boolean,
  paths?: Array<string>,
  path?: string | Array<string>,
  
  matchesAnyOf?: Array<string | RegExp>,
  matchesNoneOf?: Array<string | RegExp>
  matchesAllOf?: Array<string | RegExp>
  
  
  fileMatchesAnyOf?: Array<string | RegExp>,
  fileMatchesNoneOf?: Array<string | RegExp>
  fileMatchesAllOf?: Array<string | RegExp>
  
  dirMatchesAnyOf?: Array<string | RegExp>,
  dirMatchesNoneOf?: Array<string | RegExp>
  dirMatchesAllOf?: Array<string | RegExp>
  
  depth?: number,
  printAbsolutePaths: boolean
}

export const flattenDeep = function (a: Array<any>): Array<any> {
  return a.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};


export const getUniqueList =  (a: Array<any>) : Array<any> => {
  
  const set = new Set<any>();
  
  for(let i = 0; i < a.length; i++){
      set.add(a[i]);
  }
  
  return Array.from(set.values());
  
};
