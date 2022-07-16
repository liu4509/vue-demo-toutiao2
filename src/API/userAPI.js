import request from "@/utils/request.js";

// 登录API
export const loginAPI = (data) => {
  return request.post("/v1_0/authorizations", data);
};
// 用户基本信息
export const getUserInfoAPI = () => {
  return request.get("/v1_0/user");
};
// 获取用户简介信息
export const getUserProfileAPI = () => {
  return request.get("/v1_0/user/profile");
};
// 修改用户简介信息
export const updateUserProfileAPI = (obj) => {
  return request.patch("/v1_0/user/profile", obj);
};
// 更新头像
export const updateUserAvatarAPI = (fd) => {
  return request.patch("/v1_0/user/photo", fd);
};
