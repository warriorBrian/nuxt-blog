const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PROXY_ADDRESS,
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3002',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/socket.io': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@assets', resolve('src/assets'))
      .set('@views', resolve('src/views'))
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}

function addStyleResource (rule) {
  rule.use('style-resource').loader('style-resources-loader').options({
    patterns: [
      path.resolve(__dirname, 'src/style/index.less') // 需要全局导入的less
    ]
  })
}
