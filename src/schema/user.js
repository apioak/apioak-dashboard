const emailFormat = {
  pattern: /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/,
  message: '邮箱格式错误!'
}

const passwordMin = { min: 8, message: '密码最小8个字符!' }
const passwordMax = { max: 16, message: '密码最长16个字符!' }

const nameFormat = { pattern: /^[A-Za-z\d_]+$/, message: '昵称仅包含字母数字下划线字符!' }
const nameMax = { max: 15, message: '昵称最长15个字符!' }

export const schemaUser = {
  email: [{ required: true, message: '请输入邮箱!' }, emailFormat],
  password: [{ required: true, message: '请输入密码!' }, passwordMin, passwordMax],
  userName: [{ required: true, message: '请输入昵称!' }, nameFormat, nameMax]
}
