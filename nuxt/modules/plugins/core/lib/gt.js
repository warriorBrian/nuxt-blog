/**
 * 判断 value是否大于 other
 * @param {number} value
 * @param {number} other
 * @example
 * gt(3, 1)
 * // => true
 * */
function gt (value, other) {
  if (!(typeof value === 'string' && typeof other === 'string')) {
    value = +value;
    other = +other;
  }
  return value > other
}

export default gt
