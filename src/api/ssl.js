import request from '../utils/requestAxios'

const sslList = '/admin/certificate/list'
const sslEnable = '/admin/certificate/switch/enable/'
const sslDelete = '/admin/certificate/delete/'
const sslInfo = '/admin/certificate/info/'
const sslAdd = '/admin/certificate/add'
const sslUpdate = '/admin/certificate/update/'

/**
 * 获取证书列表
 * @param {*} params
 * @returns
 */
export const $sslList = async params => {
  return request.request({
    url: sslList,
    method: 'GET',
    params: params
  })
}

/**
 * 证书开关
 * @param {*} resId 证书资源ID
 * @param {*} enable 开关状态
 * @returns
 */
export const $sslEnable = async (resId, enable) => {
  let enableUri = sslEnable + resId

  return request.request({
    url: enableUri,
    method: 'PUT',
    data: {
      enable: enable
    }
  })
}

/**
 * 证书删除
 * @param {*} resId 证书资源ID
 * @returns
 */
export const $sslDelete = async resId => {
  let deleteUri = sslDelete + resId

  return request.request({
    url: deleteUri,
    method: 'DELETE'
  })
}

/**
 * 证书详情
 * @param {*} resId
 * @returns
 */
export const $sslInfo = async resId => {
  let infoUri = sslInfo + resId

  return request.request({
    url: infoUri,
    method: 'GET'
  })
}

export const $sslAdd = async data => {
  return request.request({
    url: sslAdd,
    method: 'POST',
    data: data
  })
}

export const $sslUpdate = async (resId, data) => {
  let updateUri = sslUpdate + resId

  return request.request({
    url: updateUri,
    method: 'PUT',
    data: data
  })
}
