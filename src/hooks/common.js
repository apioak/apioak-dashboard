export const HookProtocolToName = function (protocolId) {
  let protocolIdNameList = {
    1: 'HTTP',
    2: 'HTTPS',
    3: 'HTTP&HTTPS'
  }

  return protocolIdNameList[protocolId]
}

export const HookReleaseToName = function (releaseId) {
  let releaseIdNameList = {
    1: '未发布',
    2: '待发布',
    3: '已发布'
  }

  return releaseIdNameList[releaseId]
}

export const HookEnableToName = function (enableId) {
  let enableIdNameList = {
    1: true,
    2: false
  }

  return enableIdNameList[enableId]
}

export const MethodOption = [
    "ALL",
    "GET",
    "POST",
    "PUT",
    "DELETE",
]