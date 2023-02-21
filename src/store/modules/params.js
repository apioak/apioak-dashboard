// 传参模块
export default {
  namespaced: true,
  state() {
    return {
      // 传递的参数信息
      res_id: null
    }
  },
  mutations: {
    async setParamsResId(state, resId) {
      try {
        state.res_id = resId
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      }
    }
  },
  actions: {}
}
