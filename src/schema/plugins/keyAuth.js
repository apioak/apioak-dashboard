import { nameFormat, nameMax, authFormat, authLenBetween } from '../common'

export const schemaPluginKeyAuth = {
  name: [nameFormat, nameMax],
  secret: [{ required: true, message: '请输入secret' }, authFormat, authLenBetween]
}
