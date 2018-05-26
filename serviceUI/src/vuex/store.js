import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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
