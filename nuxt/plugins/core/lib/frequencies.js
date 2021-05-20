/**
 * 计算数组中元素出现的次数，返回一个对象
 * key为元素值，value为次数
 * @param {array} arr
 * @example
 * frequencies(['a', 'b', 'a', 'a' ,'c'])
 * // => {'a': 3, 'b': 1, 'c': 1}
 * */

function frequencies (arr) {
  return arr.reduce((a, v) => {
    a[v] = a[v] ? a[v] + 1 : 1;
    return a;
  }, {});
}

export default frequencies
