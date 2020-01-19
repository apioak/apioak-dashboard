module.exports = {
    devServer: {
        proxy: {
            "/apioak": {
                target: "http://127.0.0.1:10080",
                changeOrigin: true
            }
        }
    },
    lintOnSave: false
}
