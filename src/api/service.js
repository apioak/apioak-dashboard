import request from '../utils/requestAxios'

const serviceList = '/admin/service/list'

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
