// 网络请求模块
import axios from "axios";

import { Toast } from "vant";

import store from "@/store/index.js";

const instance = axios.create({
  // 请求根路径
  baseURL: "http://www.liulongbin.top:8000",
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 显示 loading 效果
    Toast.loading({
      message: "加载中...",
      duration: 0,
    });
    // 为请求 添加自定义字段 token 认证
    const token = store.state.tokenInfo.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    Toast.clear();
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
