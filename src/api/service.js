import request from '../utils/requestAxios'

const serviceList = '/admin/service/list'
const serviceEditName = '/admin/service/update/name/'
const serviceEnable = '/admin/service/switch/enable/'
const serviceRelease = '/admin/service/switch/release/'
const serviceDelete = '/admin/service/delete/'
const serviceInfo = '/admin/service/info/'
const serviceAdd = '/admin/service/add'
const serviceUpdate = '/admin/service/update/'

/**
 * 获取服务列表
 * @param {*} params
 * @returns
 */
export const $serviceList = async params => {
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

/**
 * 服务发布
 * @param {*} resId 服务资源ID
 * @returns
 */
export const $serviceRelease = async resId => {
  let releaseUri = serviceRelease + resId

  return request.request({
    url: releaseUri,
    method: 'PUT'
  })
}

/**
 * 服务删除
 * @param {*} resId 服务资源ID
 * @returns
 */
export const $serviceDelete = async resId => {
  let deleteUri = serviceDelete + resId

  return request.request({
    url: deleteUri,
    method: 'DELETE'
  })
}

/**
 * 服务详情
 * @param {*} resId
 * @returns
 */
export const $serviceInfo = async resId => {
  let infoUri = serviceInfo + resId

  return request.request({
    url: infoUri,
    method: 'GET'
  })
}

/**
 * 服务增加
 * @param {*} data
 * @returns
 */
export const $serviceAdd = async data => {
  return request.request({
    url: serviceAdd,
    method: 'POST',
    data: data
  })
}

/**
 * 服务更新
 * @param {*} resId
 * @param {*} data
 * @returns
 */
export const $serviceUpdate = async (resId, data) => {
  let updateUri = serviceUpdate + resId

  return request.request({
    url: updateUri,
    method: 'PUT',
    data: data
  })
}
