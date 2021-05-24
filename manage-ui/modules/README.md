### 目录结构

```
├── src/                                界面构建文件目录
│   ├── assets/                         静态图片存放目录
│   ├── components/                     公共组件及布局组件
│   ├──  └── ...
│   ├── plugins/                        公共函数及封装函数
│   ├──  └── ...
│   ├── router/                         路由配置文件
│   ├──  └── index.js                   路由配置信息
│   ├── vuex/                           状态管理仓库配置目录
│   ├──  └── store.js                   配置文件
│   ├── style/                          公共样式目录
│   ├──  └── ...
│   ├── views/                          页面组件
│   ├──  └── ...
│   ├── App.vue                         Vue主文件
│   └── main.js                         Vue主入口文件
├── static/                             存放静态资源目录
│   └── ...
├── .babelrc                            babel转换规则配置文件
├── .editorconfig                       编辑器配置文件
├── ...
├── README.md                           README
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

### 环境依赖

> node.js >=13.12.0

> Vue-cli 3

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:8080
$ npm run serve

# 构建与打包
$ npm run build

```