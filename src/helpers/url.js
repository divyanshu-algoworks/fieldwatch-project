import { isArray } from '../helpers/array';

export function getQueryParams(str = window.location.search) {
  const queryStr = str[0] === '?' ? str.substr(1) : str;
  return queryStr
    .split('&')
    .reduce((res, paramStr) => {
      const [key, val] = paramStr.split('=');
      res[key] = val;
      return res;
    }, {});
}

export function toQueryString(item, name = '') {
  if ([undefined, null].indexOf(item) > -1) {
    return '';
  }

  if (['number', 'string', 'boolean'].indexOf(typeof item) > -1) {
    return `${name}=${item}`;
  }
  if (isArray(item) && item.length === 0) {
    return `${name}[]`;
  }
  if (isArray(item)) {
    return item.map(function (i) {
      return toQueryString(i, `${name}[]`);
    }).filter(function (i) { return !!i; }).join('&');
  }
  return Object.keys(item).map(function (key) {
    const keyName = name ? `${name}[${key}]` : key;
    return toQueryString(item[key], keyName);
  }).filter(function (i) { return !!i; }).join('&');
}
