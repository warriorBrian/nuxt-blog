import typeOf from "./typeOf";
/**
 * 将对象或者某个值进行重新赋值
 * @param obj {any} conversion value
 * @param fn {callback} conversion value callback
 * @example
 * clear(params, item => params[item] = Array.isArray(params[item]) ? [] : '')
 * */

function clear (obj, fn) {
  return Object.is(typeOf(obj), 'object') && Object.keys(obj).forEach(fn)
}

export default clear
