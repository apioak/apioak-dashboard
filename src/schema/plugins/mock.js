import { nameFormat, nameMax } from '../common'

const responseType = {
  required: true,
  pattern: /^[/+-.a-zA-Z1-9]+$/,
  message: '当前值仅为: application/json、text/html、text/xml'
}

const httpCode = {
  required: true,
  type: 'number',
  min: 100,
  max: 999,
  message: '当前值必须在 100-999 之间！'
}

const httpBody = { required: true, message: '请输入http_body' }

export const schemaPluginMock = {
  name: [nameFormat, nameMax],
  response_type: [responseType],
  http_code: [httpCode],
  http_body: [httpBody]
}
