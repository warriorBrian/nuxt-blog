import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
/*存储登录用户名*/
const state = {
	tokenName:''
}

const mutations = {
	setUserName(state,userName) {
		state.tokenName = userName
	}
}

export default new Vuex.Store({
	state,
	mutations
})
