import { ALLOWED_EMAIL_DOMAINS } from '../constants/emailDomains'

export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

/**
 * Helper receive object and path to value, separated by docs and return value,
 * which situated by this path
 * @param {object} obj object, where is our value
 * @param {string} key path to value
 * @returns {*} value, which we search for
 */
export function getObjectValue(obj, key) {
  const res = key.split('.').reduce(function (res, key) {
    return res[key] || {};
  }, obj);
  if (Object.entries(res).length === 0 && res.constructor === Object) {
    return undefined;
  }
  return res;
}

function insertToObj(res, path, val) {
  if (path.length === 1) {
    return { ...res, [path[0]]: val, };
  }
  const [key, ...newPath] = path;
  const newRes = res[key];
  return {
    ...res,
    [key]: insertToObj(newRes, newPath, val)
  };
}

export function hostEndsWith(host = ''){
  if(!host) return;
  const allowedDomains = ALLOWED_EMAIL_DOMAINS.map(domain => domain.toLowerCase());
  const email = host.toLowerCase();
  return allowedDomains.some(element => element === email);
};

/**
 *
 * @param {object} obj object, where we want update value
 * @param {string} key path to value, separated by dots
 * @param {*} value value, which we want to set
 * @returns {object} exist object with new value
 */
export function setObjectValue(obj, key, value) {
  const path = key.split('.');
  return insertToObj(obj, path, value);
}
