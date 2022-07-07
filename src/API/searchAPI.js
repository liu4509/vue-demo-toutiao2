import request from "@/utils/request.js";
// 搜索建议API
export const getSuggestListAPI = (q) => {
  return request.get("/v1_0/suggestion", {
    params: {
      q,
    },
  });
};
// 搜索结果API
export const getSearchResultAPI = (q, page) => {
  return request.get("/v1_0/search", {
    params: {
      q,
      page,
    },
  });
};
