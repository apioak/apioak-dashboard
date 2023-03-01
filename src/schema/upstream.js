const nameFormat = {
  pattern: /^[A-Za-z\u4E00-\u9FA5\d_\-./*]+$/,
  message: '名称仅包含汉字、字母、数字、_ - . / *'
}
const nameMax = { max: 30, message: '名称最长30个字符!' }

const portBetween = { type: 'number', min: 1, max: 65535, message: '限制1-65535' }
const weightBetween = { type: 'number', min: 1, max: 100, message: '限制1-100' }

const nodeIpForm = {
  pattern: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
  message: '请输入合法IP'
}

export const schemaUpstream = {
  name: [nameFormat, nameMax],
  upstream_nodes: [{ required: true }, { type: 'array' }],
  load_balance: [{ required: true, message: '请选择负载均衡!' }],
  node_ip: [{ required: true, message: '请输入上游节点IP信息!' }, nodeIpForm],
  node_port: [portBetween],
  node_weight: [weightBetween]
}
