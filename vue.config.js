const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // transpileDependencies: true,
  lintOnSave: false, //  关闭语法检查
  devServer: {
    open: true, // vue项目启动时自动打开浏览器
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_ROOT,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // rewrite path
        }
      }
    }
  }
})
