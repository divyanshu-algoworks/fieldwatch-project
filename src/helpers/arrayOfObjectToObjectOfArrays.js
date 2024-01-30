/**
 * Helper get keys from first object and return object with all that keys and
 * every key will be array of values
 * @param {Array} arr Array of objects
 * @returns {Object}
 */
export default function arrayOfObjectToObjectOfArrays(arr) {
  if (!arr[0]) {
    return {};
  }

  const keys = Object.keys(arr[0]);
  // init value is object with all keys, value of each is empty array
  const initValue = keys.reduce((res, key) => {
    return { ...res, [key]: [], };
  }, {});

  return arr.reduce((res, item) => {
    // push every item key key-array of result object
    return keys.reduce((r, key) => {
      return {
        ...r,
        [key]: [...r[key], item[key]]
      }
    }, res);
  }, initValue);
}
