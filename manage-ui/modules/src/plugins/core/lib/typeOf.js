/**
 * Type Detection
 * @param {*} obj detection value
 * @returns {string} Returns Type string
 * @example
 * typeOf('abc')
 * // => string
 * */
function typeOf (obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Arguments]': 'arguments',
    '[object Map]': 'map',
    '[object Set]': 'set'
  };
  return map[toString.call(obj)]
}

export default typeOf
