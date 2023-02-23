import { nameFormat, nameMax } from '../common'

const timeWindowLenBetween = {
  type: 'number',
  min: 1,
  max: 86400,
  message: '当前值必须在 1-86400 之间！'
}

const countLenBetween = {
  type: 'number',
  min: 1,
  max: 100000000,
  message: '当前值必须在 1-100000000 之间！'
}

export const schemaPluginLimitCount = {
  name: [nameFormat, nameMax],
  time_window: [{ required: true, message: '请输入time_window!' }, timeWindowLenBetween],
  count: [{ required: true, message: '请输入count!' }, countLenBetween]
}
