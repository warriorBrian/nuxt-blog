import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      count: 1
    },
    mutations: {
      increment (state) {
        state.count++
      }
    }
  })
}

export default createStore
