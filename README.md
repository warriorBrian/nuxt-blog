# nuxt-blog

## 基于Nuxt.js服务器渲染(SSR)构建的个人博客系统

### 线上地址: [Brian's Blog](http://www.brianlee.cn)

### Nuxt踩坑文档: [Nuxt.js Docs](http://docs.brianlee.cn)

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

## 部分效果图展示

#### 首页

![首页](https://dn-cnode.qbox.me/FqmNs0ws9LxLDO3SYAGnBUEYA7yT)

#### 更新日志模块

![更新日志模块](https://dn-cnode.qbox.me/FpsRbDm7asj3td8e8DFc80nQkXhK)


#### 后台登录页面

![后台登录页面](https://dn-cnode.qbox.me/FnThkitje2RwyxsK0wsY0I2O4VGO)

#### 后台首页面

![后台首页面](https://dn-cnode.qbox.me/Fp4qoJ4cobBIGC_WKbiJOGasnKf3)

#### 后台发布文章

![后台发布文章](https://dn-cnode.qbox.me/FkpjKIfKzwFzFvShiO56OP22DeLK)

#### 后台文章列表
