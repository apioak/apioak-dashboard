import { nameFormat, nameMax } from '../common'

const rateLenBetween = {
  type: 'number',
  min: 1,
  max: 100000,
  message: '当前值必须在 1-100000 之间！'
}

const burstLenBetween = { type: 'number', min: 1, max: 5000, message: '当前值必须在 1-5000 之间！' }

const delayLenBetween = { type: 'number', min: 1, max: 60, message: '当前值必须在 1-60 之间！' }

export const schemaPluginLimitConn = {
  name: [nameFormat, nameMax],
  rate: [{ required: true, message: '请输入rate!' }, rateLenBetween],
  burst: [{ required: true, message: '请输入burst!' }, burstLenBetween],
  default_conn_delay: [{ required: true, message: '请输入default_conn_delay!' }, delayLenBetween]
}
