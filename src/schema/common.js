export const nameFormat = {
  pattern: /^[A-Za-z\u4E00-\u9FA5\d_\-./*\\]+$/,
  message: '名称仅包含汉字、字母、数字、 _ * . / \\ - '
}

export const nameMax = { max: 30, message: '名称最长30个字符！' }

export const authFormat = {
  pattern: /^[A-Za-z\d_\-.]+$/,
  message: '仅包含字母、数字、 _ - . '
}

export const authLenBetween = { min: 10, max: 32, message: '当前字段长度必须在 10~32 之间！' }
