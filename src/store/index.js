import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import userModule from './modules/user'
import paramsModule from './modules/params'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: userModule,
    params: paramsModule
  },
  plugins: [
    createPersistedState({
      key: 'vuex-local',
      paths: ['user', 'params']
    })
  ]
})
