/**
 * @desc 为了兼容本地开发环境，使用转换函数进行地址转换
 * @desc 如果为development(开发环境), 则拼接 .env 文件下的 VUE_APP_PROXY_ADDRESS
 * @desc 如果为production环境，则直接使用返回路径，不进行地址转换
 * @param path {string} 需要转换的地址
 * @example
 * development, 七牛云上传方式:
 * convertURL('//xxx.com/1.jpg')
 * // => //xxx.com/1.jpg
 * development, 本地上传方式:
 * convertURL('/path/1.jpg')
 * // => proxyAddress + /path/1.jpg
 * production, 本地上传方式(七牛云及其他方式同上):
 * convertURL('/path/1.jpg')
 * // => /path/1.jpg
 * */

function convertURL (path) {
  const env = process.env.NODE_ENV;
  const proxyAddress = process.env.VUE_APP_PROXY_ADDRESS;
  const reg = /^(http(s)?:)?(\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
  if (reg.test(path)) {
    return path;
  }
  return Object.is(env, 'development') ? `${proxyAddress + path}` : `${process.env.VUE_APP_API_PREFIX}${path}`;
}
export default convertURL;
