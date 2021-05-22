import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './style/reset.less'
import './style/element-reset.css'
import './style/components.less';
import 'animate.css';

import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import CountryFlag from 'vue-country-flag'
import popconfirm from "./components/common/popconfirm";
import empty from './components/common/empty'
import emptyData from './components/common/empty-data'
// mavon editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import convertURL from "./plugins/core/lib/internal/convertURI";
import renderExpand from './plugins/core/components/render-expand'
// socket
import Socket from './plugins/socket';
Vue.use(new Socket(`ws://${process.env.VUE_APP_PROXY_ADDRESS}`));
Vue.use(mavonEditor);
Vue.prototype.$eventBus = new Vue();
Vue.component('popconfirm', popconfirm);
Vue.component('empty', empty);
Vue.component('emptyData', emptyData);
Vue.component('country-flag', CountryFlag);
Vue.prototype.$convertURL = convertURL;
Vue.component('renderExpand', renderExpand);
Vue.config.productionTip = false;

Vue.prototype.$driver = new Driver({
  allowClose: false, // 禁止点击外部关闭
  doneBtnText: '完成', // 完成按钮标题
  closeBtnText: '关闭', // 关闭按钮标题
  stageBackground: '#fff', // 引导对话的背景色
  nextBtnText: '下一步', // 下一步按钮标题
  prevBtnText: '上一步', // 上一步按钮标题
})

router.beforeEach((to, from, next) => {
  const excludeRouterList = ['login'];
  const token = window.sessionStorage.getItem('access_token');
  // set title
  to.meta.title && (document.title = to.meta.title);
  // exclude router list and exist token
  if (excludeRouterList.includes(to.name) || token) {
    next();
  } else {
    next({
      name: 'login',
      params: {
        ...to.params
      },
      query: {
        ...to.query
      }
    });
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
