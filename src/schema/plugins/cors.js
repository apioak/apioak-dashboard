import { nameFormat, nameMax } from '../common'

const configFormat = {
  pattern: /^[A-Za-z*,]+$/,
  message: '当前值仅包含字母、*以及英文逗号！'
}

const configMax = { max: 80, message: '当前值最长80个字符' }

const maxAgeBetween = { type: 'number', min: 0, max: 86400, message: '当前值必须在 0-86400 之间！' }

export const schemaPluginCors = {
  name: [nameFormat, nameMax],
  allow_methods: [configFormat],
  allow_origins: [configMax],
  allow_headers: [configMax],
  max_age: [maxAgeBetween]
}
