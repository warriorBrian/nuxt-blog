/**
 * 将值转为整数
 * @param {*} value convert value
 * @returns {number} Returns numbers
 * @example
 * toInteger(3.2)
 * // => 3
 * */

function toInteger (value) {
  const remainder = value % 1;
  return remainder ? value - remainder : value;
}

export default toInteger;
