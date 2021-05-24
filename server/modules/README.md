### 目录结构

```
├── migration/                          数据库migration迁移执行目录
├── src/                                布局模板文件，默认default，通过为页面设置layout修改
│   ├── auth/                           权限校验模块
│   ├── core/                           核心公共封装方法目录
│   ├── entity/                         数据库模型实体类模块
│   ├── exception/                      全局处理http请求模块
│   ├── interceptors/                   全局处理响应数据模块
│   ├── interfaces/                     interface模块
│   ├── log/                            处理日志模块
│   ├── middleware/                     中间件模块
│   ├── modules/                        统一业务层模块
│   │     ├── article/                  文章模块
|   |     └── ...
│   ├── pipe/                           校验数据管道模块
│   ├── upload/                         上传模块封装
│   ├── app.module.ts/                  全局app模块
│   └── main.ts                         入口点
├── README.md                           README
├── .editorconfig                       编辑器配置文件
├── .eslintrc.js                        es-lint检查规则
├── ...
└── package.json                        项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）
```

### 环境依赖

> node.js >=13.12.0

> typeorm ^0.2.30

## 构建与运行

``` bash
# 安装依赖
$ npm install # Or yarn install

# server with hot reload at localhost:3000
$ npm run start:dev

# 构建与打包
$ npm run build

```