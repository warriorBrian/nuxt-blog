import typeOf from "./typeOf";
import isObjectLike from "./isObjbectLike";
/**
 * check if value is classified as a boolean
 * @param {*} value The value to check
 * @example
 * isBoolean(true)
 * // => true
 * isBoolean('true')
 * // => false
 * */

function isBoolean (value) {
  return value === true || value === false || (isObjectLike(value) && typeOf(value) === 'boolean')
}

export default isBoolean
