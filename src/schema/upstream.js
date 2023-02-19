const nameFormat = { pattern: /^[A-Za-z\d_\-.]+$/, message: '名称仅包含字母数字划线和点!' }
const nameMax = { max: 30, message: '名称最长30个字符!' }

const portBetween = { type: 'number', min: 1, max: 65535, message: '在1-65535之间！' }
const weightBetween = { type: 'number', min: 1, max: 100, message: '在1-100之间！' }

const nodeIpForm = {
  pattern: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
  message: '请输入合法IP'
}

export const schemaUpstream = {
  name: [nameFormat, nameMax],
  load_balance: [{ required: true, message: '请选择负载均衡!' }],
  node_ip: [{ required: true, message: '请输入上游节点IP信息!' }, nodeIpForm],
  node_port: [portBetween],
  node_weight: [weightBetween]
}
