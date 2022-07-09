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
// 获取文章评论
export const getCmtListAPI = (source, offset) => {
  return request.get("/v1_0/comments", {
    params: {
      type: "a",
      source,
      offset,
    },
  });
};
// 评论点赞 API
export const addLikeCmtAPI = (target) => {
  return request.post("/v1_0/comment/likings", {
    target,
  });
};
// 取消评论点赞
export const delLikeCmtAPI = (cmt_id) => {
  return request.delete(`/v1_0/comment/likings/${cmt_id}`);
};
// 发布评论
export const pubCommentAPI = (target, content) => {
  return request.post("/v1_0/comments", {
    target,
    content,
  });
};
