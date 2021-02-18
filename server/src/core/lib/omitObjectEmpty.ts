/**
 * 过滤对象中value为空的方法
 * @param obj {object} 源对象
 * @return object
 * @example
 * omitObjectEmpty({a: 1, b: undefined})
 * // => {a: 1}
 * */

export const omitObjectEmpty = (obj) => {
  return Object.keys(obj).filter(v => obj[v]).reduce((acc, key) => (void(acc[key] = obj[key]) || acc), {});
};

export default omitObjectEmpty;
