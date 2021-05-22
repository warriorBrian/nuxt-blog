import {HttpService} from '@nestjs/common';
import { dateProcess } from 'src/core/lib';
import { SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(3002)
export class PrometheusGateway {
  private address = process.env['PROMETHEUS_ADDRESS'];
  private instance = process.env['PROMETHEUS_INSTANCE'];
  constructor(
    private readonly httpService: HttpService
  ) {}
  @WebSocketServer()
  server: Server;

  /**
   * ====================================== 封装方法 ===============================================>
   * */
  /**
   * @desc 计算 prometheus 步长
   * @desc 当获取数量为1时则使用1，否则使用count - 1
   * @param count {number} 获取数量
   * */
  private calculateTimes (count) {
    const now = (Math.round(new Date().getTime() / 1000));
    const beforeHour = now - 3600;
    const step = (now - beforeHour) / (count === 1 ? 1 : (count - 1));
    return { now, beforeHour, step };
  }

  private async getCPUDataHandle (client, params, event: string) {
    const res = await this.httpService.get(`${this.address}/api/v1/query_range`, { params: { ...params } }).toPromise();
    const [pushData] = res.data.data.result;
    const handleData = pushData.values.reduce((acc, val) => {
      const [time, values] = val;
      acc.push({ time: dateProcess(time, 'hh:mm:ss'), values });
      return acc;
    }, []);
    client.emit(event, handleData);
  }

  /**
   * @desc 统一获取prometheus query range 数据
   * */
  private async getPrometheusQueryRange (params, fn = v => v) {
    const queryRange = await this.httpService.get(`${this.address}/api/v1/query_range`, { params: { ...params } }).toPromise();
    const [pushData] = queryRange.data.data.result;
    return pushData.values.reduce((acc, val) => {
      const [time, values] = val;
      acc.push({ time: dateProcess(time, 'hh:mm:ss'), values: fn(values) });
      return acc;
    }, []);
  }

  /**
   * @desc 统一获取 prometheus query 数据
   * */
  private async getPrometheusQueryData (params) {
    const res = await this.httpService.get(`${this.address}/api/v1/query`, { params: { ...params } }).toPromise();
    const [pushData] = res.data.data.result;
    return pushData;
  }
  /**
   * ====================================== CPU信息 ===============================================>
   * */
  /**
   * @method websocket
   * @desc 推送 CPU 实时数据
   * @desc 5s interval
   * @on GET_CPU
   * @emits CPU_DATA
   * */
  @SubscribeMessage('GET_CPU')
  async emitCPUData(client: any) {
    const { now, beforeHour, step } = this.calculateTimes(60);
    const query = `1 - avg(irate(node_cpu_seconds_total{instance=~"${this.instance}",mode="idle"}[30m])) by (instance)`;
    const params: any = {
      query: query,
      start: beforeHour,
      end: now,
      step: step
    };
    // 第一次推送全量数据
    this.getCPUDataHandle(client, params, 'CPU_DATA');
    // 第二次推送
    setInterval(() => {
      const { now, step } = this.calculateTimes(1);
      const params = { query, start: now - 5, end: now, step };
      this.getCPUDataHandle(client, params, 'CPU_DATA');
    }, 5000);
  }

  @SubscribeMessage('GET_CPU_USAGE')
  async emitCPUUsageData (client) {
    const query = `100 - (avg(irate(node_cpu_seconds_total{instance=~"${this.instance}",mode="idle"}[30m])) * 100)`;
    const now = (Math.round(new Date().getTime() / 1000));
    const params = { query, time: now };
    const data = await this.getPrometheusQueryData(params);
    const [time, values] = data.value;
    client.emit('CPU_USAGE', {time: dateProcess(time, 'hh:mm:ss'), values});
    // 第二次推送
    setInterval(async () => {
      const now = (Math.round(new Date().getTime() / 1000));
      const params = { query, time: now };
      const data = await this.getPrometheusQueryData(params);
      const [time, values] = data.value;
      client.emit('CPU_USAGE', {time: dateProcess(time, 'hh:mm:ss'), values});
    }, 5000);
  }
  /**
   * ====================================== 服务信息 ===============================================>
   * */
  /**
   * @desc 获取服务信息
   * */
  private async emitServiceDetailHandle (client) {
    // 获取主机信息
    const unameQuery = `node_uname_info{origin_prometheus=~""} - 0`;
    const now = (Math.round(new Date().getTime() / 1000));
    const { metric: { instance, job, nodename }, value: [ systemTime ] } = await this.getPrometheusQueryData({ query: unameQuery, time: now });
    // 获取运行时间
    const runtimeQuery = `sum(time() - node_boot_time_seconds{origin_prometheus=~""})by(instance)`;
    const { value: [ , runtime ] } = await this.getPrometheusQueryData({ query: runtimeQuery, time: now });
    // 获取内存总数
    const memTotalDataQuery = `node_memory_MemTotal_bytes{origin_prometheus=~""} - 0`;
    const { value: [ , memoryTotal ] } = await this.getPrometheusQueryData({ query: memTotalDataQuery, time: now });
    // 获取CPU总核心数
    const cpuTotalQuery = `count(node_cpu_seconds_total{origin_prometheus=~"",mode='system'}) by (instance)`;
    const { value: [ , cpuTotal ] } = await this.getPrometheusQueryData({ query: cpuTotalQuery, time: now });

    // 获取运行时间
    function times (mss) {
      const days = parseInt(mss / (60 * 60 * 24) as any);
      const hours = parseInt((mss % (60 * 60 * 24)) / (60 * 60) as any);
      const minutes = parseInt((mss % (60 * 60)) / (60) as any);
      return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
    }

    const params = {
      instance,
      job,
      nodename,
      systemTime: dateProcess(systemTime, 'hh:mm:ss'),
      runtime: times(runtime),
      memoryTotal: (memoryTotal / ( 1024 * 1024 * 1024 )).toFixed(2) + ' GiB',
      cpuTotal
    };

    client.emit('SERVICE_DETAIL', params);
  }

  @SubscribeMessage('GET_SERVICE_DETAIL')
  async emitServiceDetailData (client) {
    await this.emitServiceDetailHandle(client);
    // 第二次推
    setInterval(async () => {
      await this.emitServiceDetailHandle(client);
    }, 5000);
  }

  /**
   * ====================================== 内存信息 ===============================================>
   * */

  /**
   * @desc 推送内存信息数据封装
   * */
  private async emitMemoryHandle (client, params) {
    const memoryConversion = v => parseFloat((Number(v) / ( 1024 * 1024 * 1024 )).toFixed(2));
    // 总内存
    const memoryTotalQuery = `node_memory_MemTotal_bytes{instance=~"${this.instance}"}`;
    const memoryTotalData = await this.getPrometheusQueryRange({ query: memoryTotalQuery, ...params }, memoryConversion);
    // 已用内存
    const memoryUsedQuery = `node_memory_MemTotal_bytes{instance=~"${this.instance}"} - node_memory_MemAvailable_bytes{instance=~"${this.instance}"}`;
    const memoryUsedData = await this.getPrometheusQueryRange({ query: memoryUsedQuery, ...params },memoryConversion);
    // 可用内存
    const memoryAvailableQuery = `node_memory_MemAvailable_bytes{instance=~"${this.instance}"}`;
    const memoryAvailableData = await this.getPrometheusQueryRange({ query: memoryAvailableQuery, ...params }, memoryConversion);

    const data = { memoryTotalData, memoryUsedData, memoryAvailableData };

    // 将数据再进行处理
    const handleData = Object.keys(data).reduce((acc, val) => {
      // 随便取一个值的time，作为x轴时间数据
      if (val === 'memoryTotalData') {
        acc['times'] = data[val].map(v => v.time);
      }
      acc[val] = data[val].map(v => v.values);
      return acc;
    }, {});

    client.emit('MEMORY_DATA', handleData);
  }

  /**
   * @desc 推送数据，开始轮询
   * */
  @SubscribeMessage('GET_MEMORY')
  async intervalEmitMemoryData (client) {
    const { now, beforeHour, step } = this.calculateTimes(60);
    await this.emitMemoryHandle(client, { start: beforeHour, end: now, step });
    setInterval(() => {
      // 每次推送一条，重新计算步长等其他值
      const { now, step } = this.calculateTimes(1);
      this.emitMemoryHandle(client, { start: now - 5, end: now, step });
    }, 5000);
  }

  /**
   * ====================================== 网络信息 ===============================================>
   * */

  /**
   * @desc 推送网络流量数据封装
   * */
  private async emitNetworkHandle (client, params) {
    // bytes conversion kb
    const networkConversion = v => parseFloat((Number(v) / 1024 ).toFixed(2));
    // 上行数据
    const networkTransmitQuery = `irate(node_network_transmit_bytes_total{instance=~'${this.instance}',device!~'tap.*|veth.*|br.*|docker.*|virbr*|lo*'}[30m])*8`;
    const networkTransmitTotal = await this.getPrometheusQueryRange({ query: networkTransmitQuery, ...params }, v => (-parseFloat((Number(v) / 1024 ).toFixed(2))));
    // 下行数据
    const networkReceiveQuery = `irate(node_network_receive_bytes_total{instance=~'${this.instance}',device!~'tap.*|veth.*|br.*|docker.*|virbr*|lo*'}[30m])*8`;
    const networkReceiveTotal = await this.getPrometheusQueryRange({ query: networkReceiveQuery, ...params }, networkConversion);

    // 中位线数据
    const fillData = new Array(networkReceiveTotal.length).fill(0);

    const data = {transmit: networkTransmitTotal, receive: networkReceiveTotal};

    // 将数据再进行处理
    const handleData = Object.keys(data).reduce((acc, val) => {
      // 随便取一个值的time，作为x轴时间数据
      if (val === 'transmit') {
        acc['times'] = data[val].map(v => v.time);
      }
      acc[val] = data[val].map(v => v.values);
      return acc;
    }, {});

    client.emit('NETWORK_DATA', {...handleData, fill: fillData});
  }

  /**
   * @desc 推送数据，开始轮询
   * */
  @SubscribeMessage('GET_NETWORK')
  async emitNetworkData (client) {
    const { now, beforeHour, step } = this.calculateTimes(60);
    await this.emitNetworkHandle(client, { start: beforeHour, end: now, step });
    setInterval(() => {
      // 每次推送一条，重新计算步长等其他值
      const { now, step } = this.calculateTimes(1);
      this.emitNetworkHandle(client, { start: now - 5, end: now, step });
    }, 5000);
  }

}
