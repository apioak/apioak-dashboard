const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  outputDir: 'html', // build打包时输出文件目录
  assetsDir: 'assets', // 配置js、css等静态资源二级目录的位置
  lintOnSave: false, //  eslint 是否在保存时检查（语法检测）
  chainWebpack: config => {
    // 修改favicon.png打包时生成目录到静态资源的img文件夹内（默认：在public下与index.html同级）
    config.plugin('copy').tap(args => {
      args[0].patterns[0].from = 'public'
      args[0].patterns[0].to = 'assets/img'
      return args
    })
  },
  devServer: {
    open: true, // vue项目启动时自动打开浏览器
    port: 8080, // 开发时的服务端口
    proxy: {
      // 开发时防止跨域的代理服务
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
