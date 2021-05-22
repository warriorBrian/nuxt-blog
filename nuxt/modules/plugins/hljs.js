import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css';
import Vue from 'vue';
const focus = Vue.directive('highlight', (el) => {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  })
})
export default focus
