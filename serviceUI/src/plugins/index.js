import Vue from 'vue'
function error (title, content, nodesc) {
  Vue.prototype.$Notice.error({
    title: title,
    desc: nodesc ? '' : content
  })
}
function success (title, content, nodesc) {
  Vue.prototype.$Notice.success({
    title: title,
    desc: nodesc ? '' : content
  })
}

export default {
  install (Vue) {
    Vue.prototype.success = success
    Vue.prototype.error = error
  }
}
