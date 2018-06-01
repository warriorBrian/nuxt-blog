# 前端Nuxt.js说明

------

## 重点(临时)说明：因Nuxt.js官方更新依赖包不稳定导致报错，如果遇到运行程序报错，比如出现：

```bash

No parser and no filepath given, using 'babylon' the parser now but this will throw an error in the future. Please specify a parser or a filepath so one can be inferred.

```

## **请按步骤下载所需文件:**

```bash

# 安装vue-loader@13.7.2版本

$ cnpm install vue-loader@13.7.2 -D

```

*临时使用方法，官网迭代版本修复后将删除以上临时说明！*

*影响版本:Nuxt.js v1.4.0+*

------

## 目录结构

```
├── assets/                             资源目录 assets 用于组织未编译的静态资源如 LESS
├── build/                              server/打包后的部署服务器端渲染文件
├── components/                         存放公用组件，用于组织应用的 Nuxt.js 组件
│   ├── NavHeader.vue                   页面公用头部组件
│   ├── ...
├── layouts/                            布局模板文件，默认default，通过为页面设置layout修改
│   ├── default.vue                     默认渲染模板
│   ├── error.vue                       错误页面渲染模板
├── node_modules/                       开发环境/部署环境依赖文件
├── pages/                              存放页面的目录结构
│   ├── index.vue                       首页
│   ├── Front/                          渲染数据跳转路由页面
│   ├── ....
├── plugins/                            存放插件，用于丰富页面应用及UI插件、Axios插件等
│   ├── axios.js                        axios插件及配置
│   ├── element-ui.js                   element-ui按需引入组件
│   └── url.js                          接口配置文件
├── server/                             服务器端渲染配置
│   └── index.js                        服务器端渲染配置文件
├── static/                             静态资源目录
│   ├── images/                         存放静态资源图片目录
│   └── ...
├── README.md                           README
├── .editorconfig                       编辑器配置文件
├── .eslintrc.js                        es-lint检查规则
├── ...
├── app.html                            配置全局模板文件，配置SEO
├── nuxt.config.js                      nuxt配置相关主文件
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

## 环境依赖及要求

> 安装 node.js >=8.0

> 采用Koa2渲染，熟悉Koa2等框架

> 熟悉Vue.js2.0等

## 用到的技术

> Nuxt.js + Element-UI + @nuxtjs/axios + Less等

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:8081
$ npm run dev

# 构建与打包
$ npm run build
$ npm run start

# pm2 部署

$ npm run prd

# 静态资源打包
$ npm run generate
```
