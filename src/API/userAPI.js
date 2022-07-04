import request from "@/utils/request.js";

// 登录API
export const loginAPI = (data) => {
  return request.post("/v1_0/authorizations", data);
};
