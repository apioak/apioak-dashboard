module.exports = {
    devServer: {
        proxy: {
            "/apioak": {
                target: "http://49.232.143.79:10080",
                changeOrigin: true
            }
        }
    },

    lintOnSave: false
}