/**
 * 判断 value是否小于 other
 * @param {number} value
 * @param {number} other
 * @example
 * gt(3, 1)
 * // => true
 * */
function lt(value, other) {
  if (!(typeof value === 'string' && typeof other === 'string')) {
    value = +value;
    other = +other;
  }
  return value < other
}

export default lt
