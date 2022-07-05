<template>
  <div>
    <!-- 下拉加载 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :disabled="finished"
    >
      <!-- 上拉加载 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 文章 item 项  -->
        <ArtItem
          v-for="item in artList"
          :key="item.art_id"
          :article="item"
          @removeArticle="removeArticle"
        ></ArtItem
      ></van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 文章列表数据API
import { getArtListAPI } from "@/API/homeAPI.js";
// 文章列表 item 项组件
import ArtItem from "@/components/ArtItem/ArtItem.vue";
export default {
  name: "ArtList",
  props: {
    channelId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 文章列表数据
      artList: [],
      // 时间戳
      timestamp: Date.now(),
      // 上拉加载
      loading: false,
      finished: false,
      // 下拉加载
      isLoading: false,
    };
  },
  methods: {
    // 初始化文章列表数据
    async initArtList(isRefresh) {
      this.loading = true;
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp);
      if (res.message === "OK") {
        // 更新时间戳
        this.timestamp = res.data.pre_timestamp;
        if (isRefresh) {
          this.artList = [...res.data.results, ...this.artList];
          this.isLoading = false;
        } else {
          // 更新列表数据
          this.artList = [...this.artList, ...res.data.results];
          this.loading = false;
        }
        // 判断数据加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true;
        }
      }
      this.loading = false;
    },
    //上拉加载
    onLoad() {
      this.initArtList();
    },
    // 下拉加载
    onRefresh() {
      this.initArtList(true);
    },
    // 删除列表里面的 item 项
    removeArticle(id) {
      this.artList = this.artList.filter(
        (item) => item.art_id.toString() !== id
      );
      //判断删除数据后 artList 里面的数据 是否满足 10 个
      if (this.artList.length < 10) {
        // 不满足重新请求数据
        this.initArtList();
      }
    },
  },
  components: {
    ArtItem,
  },
  created() {
    this.initArtList();
  },
};
</script>

<style lang="less" scoped>
</style>