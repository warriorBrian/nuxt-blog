module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css','element-ui/lib/theme-chalk/index.css','~assets/css/Markdown.css'],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  plugins:['~/plugins/element-ui','~/plugins/axios'],
  modules:['@nuxtjs/axios'],
  loader:[
     {
         test:/\.less$/,
         loaders:'style-loader!css-loader!less-loader'
     }
  ],
  /*
   ** Build configuration
   */
  build: {
    vendor:['axios'],
    babel:{
        "plugins":[
            ['component',{
                "libraryName":"element-ui",
                "styleLibraryName":"theme-chalk"
            }]
        ]
    },
    /*
     ** Run ESLINT on save
     */
    extend (config, ctx) {
      // if (ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
}
