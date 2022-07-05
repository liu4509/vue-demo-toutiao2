import request from "@/utils/request.js";

// 用户获取频道列表
export const getUserChannelAPI = () => {
  return request.get("/v1_0/user/channels");
};
// 获取文章列表数据
export const getArtListAPI = (id, time) => {
  return request.get("/v1_0/articles", {
    params: {
      channel_id: id,
      timestamp: time,
    },
  });
};
// 文章不感兴趣
export const dislikeArticleAPI = (id) => {
  return request.post("/v1_0/article/dislikes", {
    target: id,
  });
};
// 举报文章
export const removeArticle = (target, type) => {
  return request.post("/v1_0/article/reports", {
    target,
    type,
  });
};
