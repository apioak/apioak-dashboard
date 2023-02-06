import request from '../utils/requestAxios'

const pluginConfigList = '/admin/service/plugin/config/list/'

export const $pluginConfigList = async resId => {
  let listUri = pluginConfigList + resId

  return request.request({
    url: listUri,
    method: 'GET'
  })
}
