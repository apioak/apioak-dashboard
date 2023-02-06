import { $pluginTypeList, $pluginList } from '@/api'

export const HookPluginKeyComponentMap = function () {
  return {
    cors: 'Cors',
    // mock: 'Mock',
    // 'key-auth': 'KeyAuth',
    // 'jwt-auth': 'JwtAuth',
    // 'limit-req': 'LimitReq',
    // 'limit-conn': 'LimitConn',
    'limit-count': 'LimitCount'
  }
}

export const HookPluginKeyToComponent = function (key) {
  let pluginKeyComponentMap = HookPluginKeyComponentMap()

  let componentName = pluginKeyComponentMap[key]
  if (componentName) {
    return componentName
  } else {
    return 'Plugin404'
  }
}

export const HookPluginTypeList = async function () {
  let { code, data } = await $pluginTypeList()

  let pluginTypeList = []
  if (code == 0 && data.length > 0) {
    data.forEach(typeInfo => {
      pluginTypeList.push(typeInfo)
    })
  }

  return pluginTypeList
}

export const HookPluginTypeIdNameMap = async function () {
  let list = await HookPluginTypeList()

  let pluginTypeIdNameMap = {}

  if (list.length > 0) {
    list.forEach(info => {
      pluginTypeIdNameMap[info.id] = info.name
    })
  }

  return pluginTypeIdNameMap
}

export const HookPluginList = async function () {
  let { code, data } = await $pluginList()

  let pluginList = []
  if (code == 0 && data.length > 0) {
    data.forEach(pluginInfo => {
      pluginList.push(pluginInfo)
    })
  }

  return pluginList
}
