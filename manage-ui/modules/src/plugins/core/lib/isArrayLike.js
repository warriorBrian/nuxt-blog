import isLength from "./isLength";
/**
 * 检查value是否为 *类数组，如果一个值被认为是类数组，那么它应该不是一个函数
 * 并且value.length是个整数，且大于0
 * @param {*} value The value to check
 * @example
 * isArrayLike([1, 2, 3])
 * // => true
 * isArrayLike('abc')
 * // => true
 * isArrayLike(undefined)
 * // => false
 *  */

function isArrayLike (value) {
  return (value != null && typeof value !== 'function') && isLength(value.length);
}

export default isArrayLike
