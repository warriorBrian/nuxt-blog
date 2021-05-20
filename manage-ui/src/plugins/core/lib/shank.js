/**
 * 具有与 Array.prototype.splice 相同的功能
 * 但是这个方法会返回一个新数组，而不是对原有数组进行改变
 * @param {array} arr array to be handle
 * @param {number} index start position
 * @param {number} delCount delete count
 * @param {*} elements add elements
 * @example
 * shank([0, 1], 1, 1)
 * // => [0]
 * shank([0, 1], 1, 1, 2)
 * // => [0, 2]
 * */

function shank (arr, index = 0, delCount = 0, ...elements) {
  return arr.slice(0, index).concat(elements).concat(arr.slice(index + delCount));
}

export default shank
