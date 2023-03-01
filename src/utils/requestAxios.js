import axios from 'axios'
import router from '@/router'
import store from '@/store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 关闭加载图标
NProgress.configure({ showSpinner: false })

// 初始化
const instance = axios.create({
  timeout: 20000
})

// 开发环境增加api前缀，在代理服务中使用
if (process.env.NODE_ENV == 'development') {
  instance.defaults.baseURL = '/api'
}

// 请求拦截
instance.interceptors.request.use(
  config => {
    NProgress.start()
    const { userInfo } = store.state.user
    if (userInfo.token) {
      config.headers['auth-token'] = userInfo.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截
instance.interceptors.response.use(
  response => {
    NProgress.done()
    let data = response.data
    if (data.code == 401) {
      // 清除用户信息
      store.commit('user/setToken', {})
      // 跳转登录页
      router.push('/login')
    }
    return data
  },
  err => {
    if (err.response && err.response.status === 401) {
      // 清除用户信息
      store.commit('user/setToken', {})
      // 跳转登录页
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default instance
