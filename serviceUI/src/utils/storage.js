/**
 * Type Detection
 * @method typeOf
 * @param {parameter} typeOf for JS Detection
 * */
function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * @method storage
 * @param {methods} 重写Object及Array存储方式
 * @return LocalStorage Instance
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

class SessionStorage extends LocalStorage {
  constructor (args) {
    super(args)
    this.storage = window.sessionStorage
  }
}
let session = new SessionStorage()
let local = new LocalStorage()
export {
  session,
  local
}
export default new LocalStorage()
