import toInteger from "./toInteger";
/**
 * 返回传入的状态码是否成功
 * @param {number} code response code
 * @returns {boolean} Returns true or false
 * @example
 * success(res.code)
 * // => true
 * */

const successCode = [200, 20000, 201];
const success = (code) => successCode.includes(toInteger(code));


export default success;
