const nameMax = { max: 30, message: '名称最长30个字符！' }

const responseType = {
  type: "string",
  required: true,
  pattern: /^[/+-.a-zA-Z1-9]+$/,
  message: '当前值仅包含字母、数字以及+-./符号！'
}

const httpCode = {
  type: 'number',
  required: true,
  min: 100,
  max: 999,
  message: '当前值必须在 100-999 之间！'
}

const httpBody = {
  type: "string",
  required: true,
  message: "请输入http_body"
}

export const schemaPluginMock = {
  name: [nameMax],
  response_type:[responseType],
  http_code:[httpCode],
  http_body:[httpBody],
}
