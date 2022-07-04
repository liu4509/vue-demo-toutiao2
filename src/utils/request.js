// 网络请求模块
import axios from "axios";

const instance = axios.create({
  // 请求根路径
  baseURL: "http://www.liulongbin.top:8000",
});

export default instance;
