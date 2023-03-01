const nameFormat = {
  pattern: /^[A-Za-z\u4E00-\u9FA5\d_\-./*\\]+$/,
  message: '名称仅包含汉字、字母、数字、 _ * . / \\ - '
}
const nameMax = { max: 30, message: '名称最长30个字符!' }

const pathFormat = {
  pattern: /^\/[(A-Za-z)\d_\-./*=]+$/,
  message: '路径必须以“/”开头，仅支持字母、数字、 / _ - . * ='
}

export const schemaRouter = {
  name: [nameFormat, nameMax],
  service_res_id: [{ required: true, message: '所属服务不能为空' }],
  router_path: [{ required: true, message: '路由路径不能为空' }, pathFormat],
  request_methods: [{ required: true, message: '请求方法不能为空' }]
}
