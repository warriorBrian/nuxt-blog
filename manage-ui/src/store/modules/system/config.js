import { SET_BLACKLIST_STATUS } from './../types';
const state = {
  status: 0
};

const getters = {
  status: state => state.status
};

const mutations = {
  [SET_BLACKLIST_STATUS] (state, data) {
    state.status = data;
  }
};

const actions = {
  async setBlacklistStatus ({ commit }, data) {
    commit(SET_BLACKLIST_STATUS, data);
  }
};

export default {
  namespaced: true, // 开启命名空间
  mutations,
  state,
  getters,
  actions
}
