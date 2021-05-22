function _debounce(func, wait, immediate = false) {
  let timeout;
  return function (_this, args) {
    let context = _this;
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * decorators
 * @param {number} wait 等待触发时长，毫秒
 * @param {boolean} immediate 是否立即执行一次
 * @example
 * vue demo:
 * export default {
 *   methods: {
 *     @debounce(800)
 *     test () {
 *       // something
 *     }
 *   }
 * }
 * */

function debounce (wait, immediate = false) {
  return (target, property, descriptor) => {
    const method = descriptor.value;
    const fn = _debounce(method, wait, immediate);
    descriptor.value = function (...args) {
      fn(this, args);
    };
    return descriptor;
  };
}

export default debounce
