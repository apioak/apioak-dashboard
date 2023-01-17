import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import userModule from './modules/user'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: userModule
  },
  plugins: [
    createPersistedState({
      key: 'vuex-local',
      paths: ['user']
    })
  ]
})
