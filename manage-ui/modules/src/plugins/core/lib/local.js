import typeOf from "./typeOf";
/**
 * @desc 二次封装localStorage及sessionStorage
 * @param setItem 设置存储值，可以为数组或者对象
 * @param getItem key {string} 获取存储值,与localStorage方法保持一致
 * @return local  and  session function
 * */
class LocalStorage {
  constructor () {
    this.storage = window.localStorage
  }
  setItem (key, value) {
    Object.is(typeOf(value), 'object') || Object.is(typeOf(value), 'array') ? this.storage.setItem(key, JSON.stringify(value)) : this.storage.setItem(key, value)
    return this
  }
  getItem (key) {
    if (!Object.is(typeOf(key), 'string')) {
      throw Error('key must be a string')
    }
    try {
      return JSON.parse(this.storage.getItem(key))
    } catch (error) {
      if (error) {
        return this.storage.getItem(key)
      }
    }
  }
  removeItem (key) {
    if (!Object.is(typeOf(key), 'string')) {
      throw Error('key must be a string')
    }
    return this.storage.removeItem(key)
  }
  clear () {
    return this.storage.clear()
  }
}

export default LocalStorage
