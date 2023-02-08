import request from '../utils/requestAxios'

const routerList = '/admin/router/list'
const routerEditName = '/admin/router/update/name/'
const routerEnable = '/admin/router/switch/enable/'
const routerRelease = '/admin/router/switch/release/'
const routerDelete = '/admin/router/delete/'
const routerInfo = '/admin/router/info/'
const routerAdd = '/admin/router/add'
const routerUpdate = '/admin/router/update/'

/**
 * 获取路由列表
 * @param {*} params
 * @returns
 */
export const $routerList = async params => {
  return request.request({
    url: routerList,
    method: 'GET',
    params: params
  })
}

/**
 * 编辑路由名称
 * @param {*} resId 路由资源ID
 * @param {*} newName 新名称
 * @returns
 */
export const $routerEditName = async (resId, newName) => {
  let editNameUri = routerEditName + resId

  return request.request({
    url: editNameUri,
    method: 'PUT',
    data: {
      name: newName
    }
  })
}

/**
 * 路由开关
 * @param {*} resId 路由资源ID
 * @param {*} enable 开关状态
 * @returns
 */
export const $routerEnable = async (resId, enable) => {
  let enableUri = routerEnable + resId

  return request.request({
    url: enableUri,
    method: 'PUT',
    data: {
      enable: enable
    }
  })
}

/**
 * 路由发布
 * @param {*} resId 路由资源ID
 * @returns
 */
export const $routerRelease = async resId => {
  let releaseUri = routerRelease + resId

  return request.request({
    url: releaseUri,
    method: 'PUT'
  })
}

/**
 * 路由删除
 * @param {*} resId 路由资源ID
 * @returns
 */
export const $routerDelete = async resId => {
  let deleteUri = routerDelete + resId

  return request.request({
    url: deleteUri,
    method: 'DELETE'
  })
}

/**
 * 路由详情
 * @param {*} serviceResId
 * @param {*} resId
 * @returns
 */
export const $routerInfo = async (serviceResId, resId) => {
  let infoUri = routerInfo + serviceResId +'/' +resId

  return request.request({
    url: infoUri,
    method: 'GET'
  })
}

export const $routerAdd = async data => {
  return request.request({
    url: routerAdd,
    method: 'POST',
    data: data
  })
}

export const $routerUpdate = async (resId, data) => {
  let updateUri = routerUpdate + resId

  return request.request({
    url: updateUri,
    method: 'PUT',
    data: data
  })
}
