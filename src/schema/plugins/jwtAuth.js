const nameMax = { max: 30, message: '名称最长30个字符！' }

const jwtKeyLenBetween = { type: 'string', min: 10, max: 32, message: '当前字段长度必须在 10~32 之间！' }

export const schemaPluginJwtAuth = {
  name: [nameMax],
  jwt_key: [jwtKeyLenBetween],
}
