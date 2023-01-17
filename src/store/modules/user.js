// 用户模块
export default {
  namespaced: true,
  state() {
    return {
      // 用户信息
      userInfo: {
        userId: null,
        userName: null,
        email: null,
        token: null
      }
    }
  },
  mutations: {
    async setToken(state, loginData) {
      try {
        state.userInfo = loginData
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    }
  },
  actions: {}
}
