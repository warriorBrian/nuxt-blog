# nuxt-blog

## 基于Nuxt.js服务器渲染(SSR)构建的个人博客系统

### 线上地址: [Brian's Blog](http://www.brianlee.cn)

### Nuxt总结文档: [Nuxt.js Docs](http://docs.brianlee.cn)

------

## 环境规范：

> Vue.js >= 2.0

> Nuxt.js >= 1.0.0

> Node.js > 8.0

> MongoDB >= v3.6.3

## 目录说明：

* `nuxt/`:**前端UI界面**

* `server/`:**后端服务功能**

* `serviceUI/`:**后端UI界面源码**

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

## 构建与运行

> **特别注意：构建与运行及详情在每个目录下的readme说明,点击目录即可阅读！**

> 暂不支持移动端，正在开发移动端版本中...

```shell

# nuxt localhost:8081

$ npm install

# server localhost:3000

$ npm install

# serviceUI localhost:8082

$ npm install

```

## 常见问题

> Q：每个目录都是干嘛的？

```
├── nuxt/                            前端项目目录
├── server/                          后端项目目录
└── serviceUI/                        后端管理页面目录
```

> Q：为什么我登录不了后台？

1. 请确认已经装好mongoDB数据库，并且连接成功。

2. 请确认已经按照[使用前准备](#使用前准备)成功插入账号和密码

3. 后台目录分为两个：


* `server/`: 后端服务功能目录

* `serviceUI/`: 后端UI界面源码

如果您是想在**本地运行**项目，请运行 `serviceUI/`目录：

```shell

# 运行

$ npm run dev

```

而`server/`目录，如果访问`localhost:3000`,是被打包过的`vue`源码所以它的`process.env.NODE_ENV`会自动判断为`production`(生产环境)。

被打包过的`vue`源码，放在`public/`目录下，连接为真实线上环境，**所以想在本地调试：请运行`serviceUI/`目录。**



## 部分效果图展示

#### [部分效果图文章跳转链接](https://cnodejs.org/topic/5b08e74229e6e510415b24c2)
