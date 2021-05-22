'use strict';

import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: '/api'
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);
// const requestLists = [];
// const CancelToken = axios.CancelToken;
_axios.interceptors.request.use(
  function (config) {
    // config.cancelToken = new CancelToken((cancel) => {
    //   const requestFlag = config.url + JSON.stringify(config.data) + '&' + config.method;
    //   requestLists.includes(requestFlag) ? cancel() : requestLists.push(requestFlag)
    // });
    const token = window.sessionStorage.getItem('access_token');
    config.headers['Content-Type'] = 'application/json'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const { status, data: { message } } = error.response;
    Message.error(message);
    console.log(`拦截错误, 错误信息: ${message}, 状态码: ${status}`);
    if (router.currentRoute.name !== "login") {
      if (status === 401) {
        // 401 token 过期及校验不通过则跳转登录页面
        router.replace({
          name: "login",
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
        document.title = "登录";
        return false;
      }
    }
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.$axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
};

Vue.use(Plugin);

export const api = _axios;

export default Plugin
