import request from "@/utils/request.js";

// 获取文章详情API
export const getArticleDetailAPI = (art_id) => {
  return request.get(`/v1_0/articles/${art_id}`);
};
// 关注作者 API
export const followUserAPI = (target) => {
  return request.post("/v1_0/user/followings", {
    target,
  });
};
// 取消关注功能
export const unfollowUserAPI = (author_id) => {
  return request.delete(`/v1_0/user/followings/${author_id}`);
};
// 文章点赞 API
export const addLikeAPI = (target) => {
  return request.post("/v1_0/article/likings", {
    target,
  });
};
// 文章点赞取消 API
export const delLikeAPI = (id) => {
  return request.delete(`/v1_0/article/likings/${id}`);
};
