import typeOf from "./typeOf";
import isObjectLike from "./isObjbectLike";
/**
 * 检查 value 是否是一个类arguments对象
 * @param {*} value The value to check
 * */

function isArguments (value) {
  return isObjectLike(value) && typeOf(value) === 'arguments'
}

export default isArguments
