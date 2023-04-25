
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave: false
})
module.exports = {
  devServer: {
    port: 9000,// 端口号的配置
    open: true,// 自动打开浏览器
    host: "localhost"
  }
}
