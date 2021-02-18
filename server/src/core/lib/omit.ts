/**
 * 忽略对象中某个字段
 * @desc deep = 1
 * @param obj {object} 源对象
 * @param arr {array} 需要忽略的字段集合
 * @return object
 * @example
 * omit({a: 1, b: 2}, ['a'])
 * // => // {b: 2}
 * */

export const omit = (obj, arr) => {
  return Object.keys(obj).filter(k => !arr.includes(k)).reduce((acc, val) => {
    acc[val] = obj[val];
    return acc;
  }, {});
};

export default omit
