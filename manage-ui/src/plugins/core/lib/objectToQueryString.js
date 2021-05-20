/**
 * 将对象转换为get请求格式字符串
 * @param queryParameters {object}
 * @return {string} string
 * @example
 * objectToQueryString({ access_token: 0b12845d4c530a156891921985de38e3, id: [1, 2] })
 * // => ?access_token=0b12845d4c530a156891921985de38e3&id[]=1&id[]=2
 * */
export const objectToQueryString = queryParameters => {
  return Object.entries(queryParameters).reduce((acc, [key, val]) => {
    const queryFlags = acc.includes('?') ? '&' : '?';
    acc += Array.isArray(val) ? val.reduce((acc, val) => (void (acc += `${queryFlags}${key}[]=${val}`) || acc), '') : `${queryFlags}${key}=${val}`;
    return acc;
  }, '');
};
export default objectToQueryString
