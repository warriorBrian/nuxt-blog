/**
 * 将数字转换为格式化金钱格式(字符串)
 * @param str {string} Number to be converted
 * @example
 * formatCash('1234')
 * // => 1,234
 * */

const formatCash = (str) => {
  return str.toString().split('').reverse().reduce((prev, next, index) => {
    return ((index % 3) ? next : (next + ',')) + prev
  })
};

export default formatCash
