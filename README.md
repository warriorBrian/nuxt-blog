<p align="center">
  <a href="brianlee.cn" target="blank"><img src="./manage-ui/modules/src/assets/logo.svg" width="400" alt="nuxt-blog" /></a>
</p>

<p align="center">
  <img src ="https://img.shields.io/badge/version-2.0.0-blueviolet.svg"/>
  <img src ="https://img.shields.io/badge/license-MIT-blue.svg"/>
  <img src ="https://img.shields.io/badge/macOS-passing-green"/>
  <img src ="https://img.shields.io/badge/build-passing-green"/>
</p>


nuxt blog 是一套基于nuxt与node开源博客系统，于2018年5月正式发布第一版至今，经过不断的迭代升级为目前的2.0以上版本。

舍弃繁杂，拥抱简约！


### 目录结构

```
├── manage-ui/                       后台管理项目目录
├── server/                          后端项目目录
├── prometheus/                      prometheus监控目录
└── nuxt/                            前端博客页面
```

### 构建与运行

```shell

# nuxt localhost:8083

$ npm install

# server localhost:3000
# server websocket port: 3002
$ npm install

# serviceUI localhost:8080

$ npm install

```

### 部署

> 目前使用docker部署，请确保服务器已经安装`docker`及`docker-compose`


> 进行服务打包，在docker中打包可能存在慢的情况，请耐心等待，如果出现网络问题，请多试几次。



1. 确认`manage-ui`中`.env`环境是否正确:

```sh
VUE_APP_WS_ADDRESS=ws://服务器IP:3002
```

将websocket地址设置为部署服务器IP，并暴露3002端口.

2. 确认`server`中`.env`环境是否正确:

```sh
PROMETHEUS_ADDRESS=http://服务器IP:9090
```

将地址设置为部署服务器IP，并暴露9090, 9100端口.

prometheus相关文档: [prometheus部署文档](https://github.com/warriorBrian/nuxt-blog/tree/master/prometheus)

3. 确认`server`中`ormconfig.json`配置是否正确:

```js
{
  ...
  ...
  "host": "mysql", // docker部署，如果是生成环境写为mysql服务名
  "port": 3306,
  "username": "root",
  "password": "root", // 根据实际情况进行填写数据库密码
  "database": "blog"
  ...
  ...
}
```

4. 确认`nuxt`中`.env`环境是否正确:

```sh
PROD_PROXY_ADDRESS=http://server:3000
```

此配置通常为nuxt项目代理配置，如果是生产环境，则使用以上配置，如果是开发环境则修改为`http://localhost:3000`即可.

以上配置完成后，进行打包部署:

```sh
$ docker-compose build
```

打包过后，运行部署:

> 数据卷会保存在/opt目录下进行数据持久化

```sh
$ docker-compose up -d
```

### 说明

默认后台登录用户名: demo

默认后台登录密码: 123

请在登录后进行创建账号密码，重新登录并删除测试默认账号密码。

#### 相关文档:

* server相关说明文档: [server文档](https://github.com/warriorBrian/nuxt-blog/tree/master/server/modules)

* nuxt相关说明文档: [nuxt文档](https://github.com/warriorBrian/nuxt-blog/tree/master/nuxt/modules)

* manage-ui相关说明文档: [manage-ui文档](https://github.com/warriorBrian/nuxt-blog/tree/master/manage-ui/modules)

* prometheus相关说明文档: [prometheus文档](https://github.com/warriorBrian/nuxt-blog/tree/master/prometheus)