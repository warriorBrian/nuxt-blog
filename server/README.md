# 后端说明

## 目录结构

```
├── assets/                             服务端启动文件
├── controller/                         控制器模型负责从视图读取数据，控制用户输入，并向模型发送数据。
│   ├── article.js                      前端文章操作等
│   ├── backArticle.js                  后端文章操作等
│   ├── md5.js                          加密模块/改造加密算法
│   ├── ...
├── models/                             处理应用程序数据逻辑的部分
│   ├── db.js                           封装公用调用数据库模块
│   ├── backArticleSchema.js            后端文章集合Schema
│   ├── ...
├── plulic/                             存放静态资源目录
│   └── ...
├── routes/                             存在路由相关模块
│   └── api.js                          封装接口模块
├── view/                               模板渲染目录
│   └── error.ejs                       错误页面模板
├── README.md                           README
├── app.js                              后端服务主入口文件/配置主文件
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

## 环境依赖及要求

> 安装 node.js >=8.0

> 采用Koa2作为后端框架，熟悉Koa2等框架

> 安装 MongoDB数据库 >= 3.6.3

> 采用ORM模式，熟悉Mongoose

## 使用前准备

> 暂时不支持后台修改用户名，后续会增加。所以需要准备工作如下：

```bash

# 1. 进入blog库

$ use blog

# 2. 插入登录用户名及密码

$ db.users.insert({username:'demo',password:'626dd3c7157d6460664c3b5c3778c96c'})

# 3. 用户名及密码登录

用户名为：demo

密码为：123456

```

> **特别注意：必须要先在数据库里面插入用户名及密码，否则后台无法登陆!!!**

## 用到的技术

> Node.js + Koa2 + MongoDB + Mongoose + Koa-session等

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:3000
$ npm run dev

# pm2 部署方式
$ npm run prd

```
