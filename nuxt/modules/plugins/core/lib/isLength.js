import typeOf from "./typeOf";

/**
 * 检查value值是否为有效数组长度(正整型)
 * @param {*} value The value to check
 * @returns {boolean} is length?
 * @example
 * isLength(1)
 * // => true
 * isLength('1')
 * // => true
 * isLength(NaN)
 * // => false
 * */

function isLength (value) {
  // 处理边界值
  const boundaryValue = value > -1 && value % 1 === 0 && value <= Number.MAX_SAFE_INTEGER;
  return typeOf(value) === 'number' && boundaryValue;
}

export default isLength
