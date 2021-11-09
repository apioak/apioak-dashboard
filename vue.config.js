module.exports = {
  //API_ROOT: "http://demo.apioak.com/",
  //配置接口转发
  devServer: {
    proxy: {
      api: {
        target: process.env.VUE_APP_ROOT,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
