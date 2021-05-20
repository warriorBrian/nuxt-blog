import typeOf from "./typeOf";
import isArguments from "./isArguments";
import isArrayLike from "./isArrayLike";
import isPrototype from './internal/isPrototype'

/**
 * 检查value值是否为一个 空对象、集合、映射、或者set，判断依据是：除非有枚举的对象
 * length 大于0的arguments、object、array、string等
 * 对象如果被认为是空，那么它们没有自己的可枚举的属性对象。
 * 类数组值，比如arguments对象，array, string的length为0被认为是空，类似的map(映射)和set的size为0也被认为是空。
 * @param {*} value The value to check
 * @example
 * isEmpty(true)
 * // => true
 * isEmpty(1)
 * // => true
 * isEmpty([1, 2, 3])
 * // => false
 * isEmpty({a: 1, b: 2})
 * // => false
 * */

function isEmpty (value) {
  // null or undefined
  if (value == null) {
    return true
  }
  // set or map type
  if (typeOf(value) === 'set' || typeOf(value) === 'map') {
    return !value.size;
  }
  // arrayLike
  const arrayLikeObject = Array.isArray(value) || typeOf(value) === 'string';
  if (isArrayLike(value) && ( arrayLikeObject || typeof value.splice === 'function' || isArguments(value) )) {
    return !value.length;
  }
  // prototype
  if (isPrototype(value)) {
    return !Object.keys(value).length;
  }
  // enumerable
  /**
   * 处理普通类型及对象，使用hasOwnProperty.call检测自身属性中是否具有执行的属性
   * 注意： 这里不能使用hasOwnProperty来直接检测值，在特定条件下会出现undefined情况。
   * 特殊情况: Object.create(null) => does not exist prototype
   * */
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

export default isEmpty
