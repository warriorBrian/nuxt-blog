import Vue from 'vue'
import App from './App'
import router from './router'
import { Button,Row,Col,Menu,MenuItem,Icon,Layout,Sider,Submenu,MenuGroup,Input,DatePicker,Card,RadioGroup,Radio,Notice,Tag,Table,Page,Modal,Message,Circle } from 'iview'
import 'iview/dist/styles/iview.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Axios from 'axios'
import store from '@/vuex/store'
Axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://api.brianlee.cn';
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.use(mavonEditor)
Vue.component('Button', Button)
Vue.component('Row',Row)
Vue.component('Col',Col)
Vue.component('Menu',Menu)
Vue.component('MenuItem',MenuItem)
Vue.component('Icon',Icon)
Vue.component('Layout',Layout)
Vue.component('Sider',Sider)
Vue.component('Submenu',Submenu)
Vue.component('MenuGroup',MenuGroup)
Vue.component('Input',Input)
Vue.component('DatePicker',DatePicker)
Vue.component('Card',Card)
Vue.component('RadioGroup',RadioGroup)
Vue.component('Radio',Radio)
Vue.component('Tag',Tag)
Vue.component('Table',Table)
Vue.component('Page',Page)
Vue.component('Modal',Modal)
Vue.component('i-circle',Circle);
Vue.prototype.$Notice = Notice;
Vue.prototype.$Message = Message;
/* eslint-disable no-new */
router.beforeEach((to,from,next)=>{
    // 如果router路由中存在标识符需要鉴权
	if (to.meta.requireAuth) {
        // 存在放行
		if(store.state.tokenName) {
			next();
		}else {
			let storage = window.sessionStorage;
			if (storage.getItem('username') != null) {
				next();
			}else {
				next({path:'/error'});
			}

		}
	}else {
		next();
	}
});
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
