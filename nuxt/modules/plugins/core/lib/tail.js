/**
 * 获取除了array数组第一个元素意外的全部元素
 * @param {array} array
 * @example
 * tail([1, 2, 3])
 * // => [2, 3]
 * tail([])
 * // => []
 * tail(null)
 * // => []
 * */

function tail (array) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return []
  }
  const [, ...result] = array;
  return result;
}

export default tail
