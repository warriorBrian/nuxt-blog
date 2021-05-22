import io from 'socket.io-client'
class Socket {
  constructor (ws_uri, options) {
    const opts = {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    };
    this.prefix = '%c[Websocket]: ';
    this.io = io(ws_uri, { ...opts, ...options });
    this.io.on('connect', _ => {
      this.info(`连接成功`);
    });
    // 连接
    this.io.on('connect_timeout', (timeout) => {
      console.error(`[websocket]: 连接超时，超时内容:${timeout}`);
    });
    this.io.on('error', (error) => {
      console.error(`[websocket]: 发生错误, 错误内容:${error}`);
    });
    this.io.on('disconnect', () => {
      console.error(`[websocket]: websocket已断开`);
    });
    this.io.on('close', () => {
      console.error(`[websocket]: websocket已关闭`);
    });
    // 重连
    this.io.on('reconnecting', (attemptNum) => {
      this.info(`尝试重新连接, 连接次数${attemptNum}`);
    });
    this.io.on('reconnect_attempt', (attemptNum) => {
      this.info(`重新连接次数:${attemptNum}`);
    });
    this.io.on('reconnect', (attemptNum) => {
      this.info(`重新连接成功, 连接次数:${attemptNum}`);
    });
    this.io.on('reconnect_error', (error) => {
      console.error(`[websocket]: 重新连接错误, 错误内容:${error}`);
    });
    this.io.on('reconnect_failed', () => {
      console.error('[websocket]: 重新发起连接错误, 无法继续尝试重连');
    });
  }
  info (text, data = '') {
    window.console.info(this.prefix + `%c${text}`, 'color: blue; font-weight: 600', 'color: #333333', data);
  }
  install (Vue) {
    Vue.prototype.$socket = this.io;
    this.info('socket plugin enabled');
  }
}

export default Socket
