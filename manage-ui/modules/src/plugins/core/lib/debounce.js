/**
 * debounce methods (Normal way)
 * @param {callback} fn debounce callback
 * @param {time} delay debounce times
 * @returns {function} Returns closure
 * @example
 * debounce(fn => {}, 1000)
 * // => 1000 millisecond trigger
 * */
export function debounce (fn, delay) {
  let delayTime = delay || 200;
  let timer;
  return function () {
    let _this = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(_this, args)
    }, delayTime)
  }
}

export default debounce
