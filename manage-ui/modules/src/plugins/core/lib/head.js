/**
 * 获取数组第一个元素
 * @param {array} array
 * @example
 * head([0, 1, 2])
 * // => 0
 * head([])
 * // => undefined
 * head(1)
 * // => undefined
 * */

function head (array) {
  return (array != null && array.length) ? array[0] : undefined;
}

export default head
