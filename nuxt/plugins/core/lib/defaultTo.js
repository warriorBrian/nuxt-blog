/**
 * 检查value是否应该被默认值返回，如果value的值为NaN, null, undefined，那么应该返回默认值
 * @param {*} value The value to check
 * @param {*} defaultValue The default value
 * @returns {*} Returns the value or defaultValue
 * @example
 * defaultTo(10, 2)
 * // => 10
 * defaultTo(undefined, 10)
 * // => 10
 * defaultTo(null, 10)
 * // => 10
 * defaultTo(NaN, 10)
 * // => 10
 * */

function defaultTo (value, defaultValue) {
  return (value == null || value !== value) ? defaultValue : value;
}

export default defaultTo
