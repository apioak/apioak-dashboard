import request from '../utils/requestAxios'

const serviceList = '/admin/service/list'
const serviceEditName = '/admin/service/update/name/'
const serviceEnable = '/admin/service/switch/enable/'
const serviceRelease = '/admin/service/switch/release/'

/**
 * 获取服务列表
 * @param {*} params
 * @returns
 */
export const $serviceList = params => {
  return request.request({
    url: serviceList,
    method: 'GET',
    params: params
  })
}

/**
 * 编辑服务名称
 * @param {*} resId 服务资源ID
 * @param {*} newName 新名称
 * @returns
 */
export const $serviceEditName = async (resId, newName) => {
  let editNameUri = serviceEditName + resId

  return request.request({
    url: editNameUri,
    method: 'PUT',
    data: {
      name: newName
    }
  })
}

/**
 * 服务开关
 * @param {*} resId 服务资源ID
 * @param {*} enable 开关状态
 * @returns
 */
export const $serviceEnable = async (resId, enable) => {
  let enableUri = serviceEnable + resId

  return request.request({
    url: enableUri,
    method: 'PUT',
    data: {
      enable: enable
    }
  })
}

export const $serviceRelease = async resId => {
  let releaseUri = serviceRelease + resId

  return request.request({
    url: releaseUri,
    method: 'PUT'
  })
}
