module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "http://49.232.143.79:10080",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    lintOnSave: false
}