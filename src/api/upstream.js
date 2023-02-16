import request from '../utils/requestAxios'

const upstreamList = '/admin/upstream/list'
const upstreamEditName = '/admin/upstream/update/name/'
const upstreamEnable = '/admin/upstream/switch/enable/'

/**
 * 获取upstream列表
 * @param {*} params
 * @returns
 */
export const $upstreamList = async params => {
  return request.request({
    url: upstreamList,
    method: 'GET',
    params: params
  })
}

/**
 * 更新upstream名称接口
 * @param {*} resId
 * @param {*} newName
 * @returns
 */
export const $upstreamEditName = async (resId, newName) => {
  let editNameUri = upstreamEditName + resId

  return request.request({
    url: editNameUri,
    method: 'PUT',
    data: {
      name: newName
    }
  })
}

/**
 * 开关变更
 * @param {*} resId
 * @param {*} enable
 * @returns
 */
export const $upstreamEnable = async (resId, enable) => {
  let enableUri = upstreamEnable + resId

  return request.request({
    url: enableUri,
    method: 'PUT',
    data: {
      enable: enable
    }
  })
}
