export const HookAlgorithmToName = function (upstreamId) {
  let upstreamIdNameList = {
    1: '加权轮询（Round Robin）',
    2: '一致性哈希（CHash）'
  }

  let upstreamName = upstreamIdNameList[upstreamId]
  if (upstreamName == null) {
    upstreamName = '暂无数据'
  }

  return upstreamName
}
