const nameMax = { max: 30, message: '名称最长30个字符！' }

const timeWindowLenBetween = { type: 'number', min: 1, max: 86400, message: '当前值必须在 1-86400 之间！' }

const countLenBetween = { type: 'number', min: 1, max: 100000000, message: '当前值必须在 1-100000000 之间！' }

export const schemaPluginLimitCount = {
  name: [nameMax],
  time_window: [timeWindowLenBetween],
  count: [countLenBetween],
}
