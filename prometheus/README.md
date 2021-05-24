## prometheus 监控

后台管理系统使用prometheus监控服务器，如果需要请开始部署。

### prometheus 关联依赖

* node_exporter:v1.1.2
* prometheus:v2.26.0
* grafana:7.5.5

#### node_exporter

`node_exporter`组件主要是用来收集服务器硬件资源使用情况，对于docker部署，他将必须使用`network:host`模式来监听宿主机硬件运行情况。

#### grafana

`grafana`是一个跨平台的开源的度量分析和可视化工具，可以通过将采集的指标可视化展示。

---

### 端口说明

* prometheus 9090 端口 (如果使用指标采集必须暴露端口)
* node_exporter 9100 端口 (如果使用指标采集必须暴露端口)
* grafana 3001 端口 (选择性使用，不使用则不需要暴露端口)

---
### 部署prometheus

部署prometheus采用的是docker compose来启动部署。

#### 第一步, 确认文件

目录下存在两个文件:

* prometheus.yml
* grafana.ini

在启动部署`promethues`之前需要进行确认:

`prometheus.yml` 文件:

```yml
...
...
scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']
        labels:
          instance: prometheus
 
  - job_name: linux
    static_configs:
      # 上面不需要进行改动，这里需要改成实际部署服务器的IP
      - targets: ['IP:9100']
        labels:
          instance: localhost
```

如上所示，只需要将注释部分`targets`修改成**部署服务器的实际IP地址即可。**


`grafana.ini` 文件:

```ini
...
...

[server]
# Protocol (http, https, h2, socket)
;protocol = http

# The ip address to bind to, empty will bind to all interfaces
;http_addr =

# The http port  to use
http_port = 3001
```

默认`grafana.ini`只修改了暴露端口:`3001`，如果有需求可自行修改。


#### 第二步, 开始部署

使用`docker-compose`来进行启动，在此目录下执行：

```sh
# 启动prometheus及关联依赖
$ docker-compose up -d
```

查看日志详情:

```sh
$ docker-compose logs
```

`grafana`组件持久化数据卷目录为`/opt/grafana-storage`，默认权限值不能不够需要设置权限:

```sh
$ chmod 777 /opt/grafana-storage
```

#### 第三步, 配置

成功部署后，访问`http://ip:3001`会进入grafana界面，默认账号密码: `admin`

> :warning: 首次登陆成功后请将默认密码设置为自己密码，防止泄露

> 提示：如果不需要使用`grafana`可以选择不暴露`3001`端口，则以下配置不需要进行操作。

配置grafana:

1. 点击左侧设置(Configuration)，进入`Data Sources`
2. 点击 add data sources, 并选择 `prometheus`
3. 进入配置后，在`URL`栏目中输入`prometheus:9090`,其他配置保持默认
4. 点击保存(Save & Test)，出现绿色alert: Data source is working，代表连接成功

grafana导入模板:

1. 点击左侧加号(Create)选择导入(Import)
2. 在url栏目中输入模板编号: `12227`，并点击Load完成模板配置
3. 在`Prometheus Data Source`选择刚刚创建的 data source点击import完成配置

配置node_exporter:

如果云服务部署，例如阿里云等云服务，请在安全组中开放`9100`端口

配置prometheus:

如果云服务部署，例如阿里云等云服务，请在安全组中开放`9090`端口