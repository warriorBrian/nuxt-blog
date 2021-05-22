/**
 * 判断 value是否大于等于 other
 * @param {number} value
 * @param {number} other
 * @example
 * gte(3, 1)
 * // => true
 * */
function gte (value, other) {
  if (!(typeof value === 'string' && typeof other === 'string')) {
    value = +value;
    other = +other;
  }
  return value >= other
}

export default gte
