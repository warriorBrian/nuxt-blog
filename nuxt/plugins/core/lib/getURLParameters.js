/**
 * 将URI 参数转换为对象
 * @param url {string} 源对象
 * @return object
 * @example
 * getURLParameters('?id=1&params=2')
 * // => {id: 1, params: 2}
 * */
export const getURLParameters = url => {
  const decode = decodeURIComponent(url);
  return (decode.match(/([^?&=]+)(=[^&]*)/g) || []).reduce((acc, val) => {
    acc[val.slice(0, val.indexOf('='))] = val.slice(val.indexOf('=') + 1);
    return acc
  }, {})
};

export default getURLParameters
