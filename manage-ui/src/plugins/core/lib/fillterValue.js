/**
 * @desc 过滤某个对象，返回给定的值组成新的对象
 * @param someKeys {array} 给定返回值的数组
 * @param source {object} 元数据
 * @param someKeys depth = 1 查找深度1
 * @param type {string} 返回类型，只能为数组或对象，默认为对象
 * @return {object | array} 返回具体类型取决于type形参，深拷贝
 * */
export const filterValue = (source, someKeys, type = 'object') => {
  const types = Object.is(type, 'object') ? {} : [];
  return _.cloneDeep(someKeys.reduce((acc, val) => {
    return Object.is(type, 'object') ? (acc[val] = source[val], acc) : (acc.push(source[val]), acc)
  }, types))
};

export default filterValue
