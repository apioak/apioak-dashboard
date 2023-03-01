import request from '@/utils/requestAxios'

const login = '/admin/user/login'
const register = '/admin/user/register'
const logout = '/admin/user/logout'

/**
 * 登录
 * @param {*} data
 */
export const $login = data => {
  return request.request({
    url: login,
    method: 'POST',
    data: data
  })
}

/**
 * 注册
 * @param {*} data
 * @returns
 */
export const $register = data => {
  return request.request({
    url: register,
    method: 'POST',
    data: data
  })
}

/**
 * 退出登录
 * @returns
 */
export const $logout = () => {
  return request.request({
    url: logout,
    method: 'POST'
  })
}
