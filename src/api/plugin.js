import request from '../utils/requestAxios'

const pluginTypeList = '/admin/plugin/type-list'
const pluginList = '/admin/plugin/add-list'

/**
 * 获取插件类型列表
 * @returns
 */
export const $pluginTypeList = async () => {
  return request.request({
    url: pluginTypeList,
    method: 'GET'
  })
}

/**
 * 获取插件列表
 * @returns
 */
export const $pluginList = async () => {
  return request.request({
    url: pluginList,
    method: 'GET'
  })
}
