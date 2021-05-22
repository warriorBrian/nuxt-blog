
/**
 * 检测值是否为 *类对象，如果一个值是类对象，那么它不应该是null
 * */

function isObjectLike (value) {
  return typeof value === 'object' && value !== null
}

export default isObjectLike
