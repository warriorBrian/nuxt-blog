import typeOf from "./typeOf";
/**
 * 检查value值是否为字符串
 * @param {*} value The value to check
 * @returns boolean is string?
 * @example
 * isString('1')
 * // => true
 * isString(1)
 * // => false
 * isString(null)
 * // false
 * */

function isString (value) {
  return typeof value === 'string' ||
    (typeof value === 'object' && value != null && !Array.isArray(value) && typeOf(value) === 'string');
}

export default isString
