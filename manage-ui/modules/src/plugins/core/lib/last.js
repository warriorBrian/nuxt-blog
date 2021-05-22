/**
 * 获取数组最后一个元素
 * @param {array} array
 * @example
 * last([0, 1, 2])
 * // => 2
 * last([])
 * // => undefined
 * */

function last (array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1]: undefined;
}

export default last
