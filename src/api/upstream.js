import request from '../utils/requestAxios'

const upstreamList = '/admin/service/list' //TODO 替换为upstream列表URI

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
