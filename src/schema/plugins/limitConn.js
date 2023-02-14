const nameMax = { max: 30, message: '名称最长30个字符！' }

const rateLenBetween = { type: 'number', min: 1, max: 100000, message: '当前值必须在 1-100000 之间！' }

const burstLenBetween = { type: 'number', min: 1, max: 5000, message: '当前值必须在 0-5000 之间！' }

const delayLenBetween = { type: 'number', min: 1, max: 60, message: '当前值必须在 1-60 之间！' }

export const schemaPluginLimitConn = {
  name: [nameMax],
  rate: [rateLenBetween],
  burst: [burstLenBetween],
  default_conn_delay: [delayLenBetween],
}
