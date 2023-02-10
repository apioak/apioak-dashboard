const nameFormat = { pattern: /^[A-Za-z\d_\-.]+$/, message: '名称仅包含字母数字划线和点!' }
const nameMax = { max: 30, message: '名称最长30个字符!' }

export const schemaRouter = {
  name: [nameFormat, nameMax],
  service_res_id: [{required: true, message: '所属服务不能为空'}],
  router_path: [{required: true, message: '路由路径不能为空'}],
  request_methods: [{required: true, message: '请求方法不能为空'}],
}
