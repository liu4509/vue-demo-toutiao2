<template>
  <div class="search-result-container">
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    ></van-nav-bar>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ArtItem
        v-for="item in searchList"
        :key="item.art_id.toString()"
        :article="item"
        :isShow="false"
      ></ArtItem>
    </van-list>
  </div>
</template>

<script>
// 搜索结果 API
import { getSearchResultAPI } from "@/API/searchAPI.js";
// 文章列表 item 组件
import ArtItem from "@/components/ArtItem/ArtItem.vue";
export default {
  name: "SearchResult",
  props: ["kw"],
  data() {
    return {
      // 页码
      page: 1,
      // 搜索列表数据
      searchList: [],
      // 上拉刷新
      loading: false,
      finished: false,
    };
  },
  methods: {
    // 初始化搜索结果列表
    async initSearchList() {
      this.loading = true;
      const { data: res } = await getSearchResultAPI(this.kw, this.page);
      if (res.message === "OK") {
        this.searchList = [...this.searchList, ...res.data.results];
        this.loading = false;
        if (res.data.results.length === 0) {
          this.finished = true;
        }
        this.page += 1;
      }
      this.loading = false;
    },
    // 上拉刷新事件
    onLoad() {
      this.initSearchList();
    },
  },
  components: {
    ArtItem,
  },
  created() {
    this.initSearchList();
  },
};
</script>

<style lang="less" scoped>
</style>