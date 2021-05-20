import LocalStorage from "./local";

/**
 * extends LocalStorage class
 * */

class SessionStorage extends LocalStorage {
  constructor (args) {
    super(args);
    this.storage = window.sessionStorage
  }
}

export default SessionStorage
