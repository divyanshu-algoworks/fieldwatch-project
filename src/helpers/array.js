
export function add(src, item) {
  return [...src, item];
}

export function remove(src, index) {
  if (index === -1) {
    return src;
  }

  return [...src.slice(0, index), ...src.slice(index + 1)];
}

/**
 * This helper get array and item, and if item presence, helper removes it,
 * else adds it
 * @param {Array} src array of values
 * @param {*} item item, presence of which we want to toggle
 * @returns {Array} return new data array
 */
export function toggleItemPresence(src, item) {
  const index = src.indexOf(item);
  return index === -1 ? add(src, item) : remove(src, index);
}

export function isArray(obj) {
  // only implement if no native implementation is available
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }
  return Array.isArray(obj);
}

export function uniq(arr) {
  return arr.filter(function (value, index, self) {
    return !!value && self.indexOf(value) === index;
  });
}

/**
 * Helper get array of items and value, which should this item has. By default keyName is "id"
 * @param {Array} src array of items
 * @param {*} key Value, which should be contained by item
 * @param {String} keyName Name of key, which should contain value
 */
export function findItemByKey(src, key, keyName = "id") {
  const wantedItem = src.filter((item) => item[keyName] === key)[0];
  return wantedItem || null;
}

/**
 *
 * @param {Array} src array of items
 * @param {*} key Value, which should be contained by item
 * @param {String} keyName Name of key, which should contain value
 * @returns {Number} index of item in src. If there is no item, should return -1
 */
export function findItemIndexByKey(src, key, keyName = "id") {
  return src.findIndex((item) => item[keyName] === key);
}

/**
 *
 * @param {Array} src
 * @param {Object} item
 * @param {String} key
 * @returns {Array}
 */
export function replaceItem(src, item, key = "id") {
  const index = findItemIndexByKey(src, item[key], key);
  return [...src.slice(0, index), item, ...src.slice(index + 1)];
}

/**
 * Function move item inside array
 * @param {Array} src array of items, where item should be moved
 * @param {Number} from idex of item, which should be moved
 * @param {Number} to new item position
 * @returns {Array} new array of items
 */
export function move(src, from, to) {
  const item = src[from];
  if (to > from) {
    return [
      ...src.slice(0, from),
      ...src.slice(from + 1, to + 1),
      item,
      ...src.slice(to + 1),
    ];
  }

  if (from > to) {
    return [
      ...src.slice(0, to),
      item,
      ...src.slice(to, from),
      ...src.slice(from + 1),
    ];
  }
  return src;
}

export function insertItem(src = [], item, index = src.length) {
  return [...src.slice(0, index), item, ...src.slice(index)];
}
/**
 *
 * @param {Array} src
 * @param {Object} item
 * @param {String} key
 * @returns {Array}
 */

export function updateItem(src, key, val, keyName = "id") {
  const index = findItemIndexByKey(src, key, keyName);
  return [
    ...src.slice(0, index),
    { ...src[index], ...val },
    ...src.slice(index + 1),
  ];
}

export function removeItem(src, item, keyName = "id", val = {}) {
  const index = findItemIndexByKey(src, item[keyName], keyName);
  return remove(src, index, { ...val });
}

export function removeItemById(src, id, keyName = "id") {
  return src.filter((elem) => elem[keyName] != id);
}

export function removeAll(src) {
  src.length = 0;
  return [];
}

export function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}
