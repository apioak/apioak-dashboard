const sniFormat = { pattern: /^[A-Za-z\d_\-./]+$/, message: '域名仅包含字母、数字、划线、点、/!' }

export const schemaSsl = {
  sni: [sniFormat],
  certificate: [{required: true, message: '证书内容不能为空'}],
  private_key: [{required: true, message: '私钥内容不能为空'}],
}

