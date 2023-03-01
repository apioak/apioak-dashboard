import request from '../utils/requestAxios'

const upstreamList = '/admin/upstream/list'
const upstreamNameList = '/admin/upstream/name/list'
const upstreamEditName = '/admin/upstream/update/name/'
const upstreamEnable = '/admin/upstream/switch/enable/'
const upstreamDelete = '/admin/upstream/delete/'
const upstreamRelease = '/admin/upstream/switch/release/'
const upstreamInfo = '/admin/upstream/info/'
const upstreamAdd = '/admin/upstream/add'
const upstreamUpdate = '/admin/upstream/update/'

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
 * 获取upstream列表
 * @returns
 */
export const $upstreamNameList = async () => {
  return request.request({
    url: upstreamNameList,
    method: 'GET',
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

/**
 * 发布
 * @param {*} resId
 * @returns
 */
export const $upstreamRelease = async resId => {
  let releaseUri = upstreamRelease + resId

  return request.request({
    url: releaseUri,
    method: 'PUT'
  })
}

/**
 * 删除
 * @param {*} resId
 * @returns
 */
export const $upstreamDelete = async resId => {
  let deleteUri = upstreamDelete + resId

  return request.request({
    url: deleteUri,
    method: 'DELETE'
  })
}

/**
 * 详情
 * @param {*} resId
 * @returns
 */
export const $upstreamInfo = async resId => {
  let infoUri = upstreamInfo + resId

  return request.request({
    url: infoUri,
    method: 'GET'
  })
}

/**
 * 上游增加
 * @param {*} data
 * @returns
 */
export const $upstreamAdd = async data => {
  return request.request({
    url: upstreamAdd,
    method: 'POST',
    data: data
  })
}

/**
 * 上游更新
 * @param {*} resId
 * @param {*} data
 * @returns
 */
export const $upstreamUpdate = async (resId, data) => {
  let updateUri = upstreamUpdate + resId

  return request.request({
    url: updateUri,
    method: 'PUT',
    data: data
  })
}
