const digValue = (obj, target) => {
  return target in obj ? obj[target] : Object.values(obj).reduce((acc, val) => {
    if (acc !== undefined) return acc;
    if (typeof val === 'object') return digValue(val, target);
  }, undefined);
};

/**
 * 深度获取对象中某个值
 * @desc deep = Infinite
 * @desc 如果无限级深度对象中存在相同key,那么在找到第一层key时停止查找
 * @param value {object} 源对象
 * @param keys {array} 需要获取的值
 * @return object
 * @example
 * dig({a: 1, b: {c: 3}}, ['a', 'c'])
 * */

export const dig = (value, keys) => {
  return keys.reduce((acc, val) => (void(acc[val] = digValue(value, val) ) || acc), {});
};

export default dig
