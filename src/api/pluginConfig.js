import request from '../utils/requestAxios'

let configTypeService = 1

const servicePluginConfigList = '/admin/service/plugin/config/list/'
const servicePluginConfigAdd = '/admin/service/plugin/config/add'
const servicePluginConfigUpdate = '/admin/service/plugin/config/update/'
const servicePluginConfigEnable = '/admin/service/plugin/config/switch/enable/'

/**
 * 插件配置列表
 * @param {*} configType
 * @param {*} resId
 * @returns
 */
export const $pluginConfigList = async (resId, configType = configTypeService) => {
  if (configType == configTypeService) {
    return $servicePluginConfigList(resId)
  } else {
    // return $routerPluginConfigList(resId)
  }
}

/**
 * 插件配置增加
 * @param {*} configType
 * @param {*} data
 * @returns
 */
export const $pluginConfigAdd = async (data, configType = configTypeService) => {
  if (configType == configTypeService) {
    return $servicePluginConfigAdd(data)
  } else {
    // return
  }
}

/**
 * 插件配置更新
 * @param {*} configType
 * @param {*} resId
 * @param {*} data
 * @returns
 */
export const $pluginConfigUpdate = async (resId, data, configType = configTypeService) => {
  if (configType == configTypeService) {
    return $servicePluginConfigUpdate(resId, data)
  } else {
    // return
  }
}

/**
 * 插件配置开关
 * @param {*} configType
 * @param {*} resId
 * @param {*} data
 * @returns
 */
export const $pluginConfigEnable = async (resId, data, configType = configTypeService) => {
  if (configType == configTypeService) {
    return $servicePluginConfigEnable(resId, data)
  } else {
    // return
  }
}

// *************************************service-plugin-config*******************************************

/**
 * 插件配置列表
 * @param {*} resId
 * @returns
 */
let $servicePluginConfigList = async resId => {
  let listUri = servicePluginConfigList + resId

  return request.request({
    url: listUri,
    method: 'GET'
  })
}

/**
 * 插件配置增加
 * @param {*} data
 * @returns
 */
let $servicePluginConfigAdd = async data => {
  return request.request({
    url: servicePluginConfigAdd,
    method: 'POST',
    data: data
  })
}

/**
 * 插件配置更新
 * @param {*} resId
 * @param {*} data
 * @returns
 */
let $servicePluginConfigUpdate = async (resId, data) => {
  let updateUri = servicePluginConfigUpdate + resId

  return request.request({
    url: updateUri,
    method: 'PUT',
    data: data
  })
}

/**
 * 服务插件配置开关
 * @param {*} resId
 * @param {*} data
 * @returns
 */
let $servicePluginConfigEnable = async (resId, data) => {
  let enableUri = servicePluginConfigEnable + resId

  return request.request({
    url: enableUri,
    method: 'PUT',
    data: data
  })
}

// *************************************router-plugin-config*******************************************
