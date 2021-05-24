### 目录结构

```
├── components/                         存放公用组件，用于组织应用的 Nuxt.js 组件
│   ├── post-form.vue                   提交评论模块
│   ├── ...
├── layouts/                            布局模板文件，默认default，通过为页面设置layout修改
│   ├── default.vue                     默认渲染模板
│   ├── error.vue                       错误页面渲染模板
├── pages/                              存放页面的目录结构
│   ├── index.vue                       首页
│   ├── article/                        文章模块
│   ├── ....
├── plugins/                            存放插件，用于丰富页面应用及UI插件、Axios插件等
│   ├── axios.js                        axios插件及配置
│   ├── element-ui.js                   element-ui按需引入组件
│   └── core/                           公共封装函数目录
├── static/                             静态资源目录
│   ├── image/                          存放静态资源图片目录
│   └── ...
├── README.md                           README
├── .editorconfig                       编辑器配置文件
├── .eslintrc.js                        es-lint检查规则
├── ...
├── nuxt.config.js                      nuxt配置相关主文件
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

### 环境依赖

> node.js >=14.16.1

> nuxt 2.15.3

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:8083
$ npm run dev

# 构建与打包
$ npm run build

```
