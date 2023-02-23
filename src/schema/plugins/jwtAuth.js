import { nameFormat, nameMax, authFormat, authLenBetween } from '../common'

export const schemaPluginJwtAuth = {
  name: [nameFormat, nameMax],
  jwt_key: [{ required: true, message: '请输入jwt_key' }, authLenBetween, authFormat]
}
