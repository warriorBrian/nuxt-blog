# 后端界面层说明

## 目录结构

```
├── build/                              脚手架构建文件配置目录
├── config/                             开发环境/生产环境配置目录
│   ├── index.js                        配置文件
│   └── ...
├── src/                                界面构建文件目录
│   ├── assets/css/admin/               css分离文件
│   ├── components/                     构建页面主文件
│   ├──  ├── Index.vue                  首页
│   ├──  └── ...
│   ├── router/                         路由配置文件
│   ├──  └── index.js                   路由配置信息
│   ├── vuex/                           状态管理仓库配置目录
│   ├──  └── store.js                   配置文件
│   ├── App.vue                         Vue主文件
│   └── main.js                         Vue主入口文件
├── static/                             存放静态资源目录
│   └── ...
├── .babelrc                            babel转换规则配置文件
├── .editorconfig                       编辑器配置文件
├── ...
├── README.md                           README
├── index.html                          打包生成主模板文件
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

## 环境依赖及要求

> 安装 node.js >=8.0

> Vue-cli latest

> 熟悉Vue.js2.0

## 用到的技术

> Vue + Vue-Router + Vue-cli + Vue + Axios + Less + Iview等

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:8082
$ npm run dev

# 构建与打包
$ npm run build
$ npm run start

```
