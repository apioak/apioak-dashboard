const nameMax = { max: 30, message: '名称最长30个字符！' }

// const rateLenBetween = { type: 'number', min: 1, max: 100000, message: '当前值必须在 1-100000 之间！' }
//
// const burstLenBetween = { type: 'number', min: 0, max: 5000, message: '当前值必须在 0-5000 之间！' }

const headerFormat = {
  pattern: /^[A-Za-z1-9_-]+$/,
  message: '当前值仅包含字母、数字、划线'
}

export const schemaPluginMock = {
  name: [nameMax],
  response_type:[ {type: "string", required: true, message: "请输入response_type"}],
  http_code:[{ type: "number", required: true, message: "请输入http_code" }],
  http_body:[{ type: "string", required: true, message: "请输入http_body" }],
}
