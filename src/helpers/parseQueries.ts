import qs from 'qs';
/**
 * This helper will help parsing querystring from a string, specially from location.search
 *
 * @param {string} str The `string` needs to be parse.
 * @param { object } keys An object containing the key to be extracted and it's default value (if the result is undefined)
 *
 * @example
 * ```
 *  parseQueries(location.search, {
 *     filter: selectedTab,
 *   search: undefined,
 *     page: currentPage,
 *     limit: rowsPerPage,
 *   });
 * ```
 */

const parseQueries = (str: string, keys: { [key: string]: any }): { [key: string]: any } => {
  let newobj: { [key: string]: any } = {};
  let queries = qs.parse(str, { ignoreQueryPrefix: true });
  for (let key in keys) {
    newobj[key] = (queries[key] as string) || keys[key];
  }
  return newobj;
};

export default parseQueries;
