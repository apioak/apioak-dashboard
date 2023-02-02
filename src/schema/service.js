const nameFormat = { pattern: /^[A-Za-z\d_\-.]+$/, message: '名称仅包含字母数字划线和点!' }
const nameMax = { max: 30, message: '名称最长30个字符!' }

const domainMax = { max: 50, message: '服务域名最长50个字符!' }

export const schemaService = {
  name: [nameFormat, nameMax],
  domain: [{ required: true, message: '请输入域名!' }, domainMax]
}
