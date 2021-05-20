/**
 * @desc 将所有指定的空值转换成给定的值
 * @param source {object} 源对象
 * @param type {type} 比对任何类型，例如undefined
 * @param flag {type} 转换值
 * */
export const conversionEmpty = (source, type, flag) => {
  return Object.keys(source).reduce((acc, val) => (acc[val] = source[val] == type ? flag : source[val], acc), {});
};

export default conversionEmpty
