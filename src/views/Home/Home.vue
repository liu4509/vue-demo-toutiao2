<template>
  <div class="home-container">
    <!-- // 标题 -->
    <van-nav-bar fixed placeholder>
      <template #left>
        <img src="@/assets/toutiao_logo.png" alt="logo" class="logo" />
      </template>
      <template #right>
        <van-icon name="search" size="18" color="white" />
      </template>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs v-model="active" sticky offset-top="1.2267rem">
      <van-tab v-for="item in userChannel" :key="item.id" :title="item.name">
        <ArtList :channelId="item.id"></ArtList>
      </van-tab>
    </van-tabs>
    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" />
  </div>
</template>

<script>
// 用户频道列表API
import { getUserChannelAPI } from "@/API/homeAPI.js";
// 文章列表组件
import ArtList from "@/components/ArtList/ArtList.vue";

export default {
  name: "Home",
  data() {
    return {
      // 列表个数
      active: 1,
      // 用户频道列表数据
      userChannel: [],
    };
  },
  methods: {
    // 初始用户频道列表
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI();
      if (res.message === "OK") {
        this.userChannel = res.data.channels;
      }
    },
  },
  components: {
    ArtList,
  },
  created() {
    this.initUserChannel();
  },
};
</script>

<style lang="less" scoped>
.logo {
  height: 80%;
}
/deep/ .van-tabs__wrap {
  padding-right: 36px;
  background-color: white;
}
.plus {
  position: fixed;
  top: 58px;
  right: 10px;
  z-index: 999;
}
</style>