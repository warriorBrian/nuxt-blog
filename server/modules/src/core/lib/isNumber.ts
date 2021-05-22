import typeOf from "./typeOf";
import isObjectLike from "./isObjectLike";

function isNumber (value) {
  return typeof value === 'number' || (isObjectLike(value) && Object.is(typeOf(value), 'number'))
}

export default isNumber
