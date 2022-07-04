import request from "@/utils/request.js";

// 用户获取频道列表
export const getUserChannelAPI = () => {
  return request.get("/v1_0/user/channels");
};
