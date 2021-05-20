/**
 * 创建一个新数组，包含原数组中所有的非假值元素
 * 例如: false, null, 0, "", undefined, NaN 都被认为是假值
 * @example
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 * */

function compact (array) {
  return array.filter(Boolean);
}

export default compact
