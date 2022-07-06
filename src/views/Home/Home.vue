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
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      @closed="isDel = false"
    >
      <div class="popup-container">
        <!-- 标题 -->
        <van-nav-bar title="频道管理" left-text="返回" left-arrow>
          <template #right>
            <van-icon
              name="cross"
              size="14"
              color="white"
              @click="show = false"
            />
          </template>
        </van-nav-bar>
        <!-- 主体部分 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <span class="title-gray">{{
                  isDel ? "点击移除频道" : "点击进入频道"
                }}</span>
              </div>
              <span class="btn-edit" @click="isDel = !isDel">{{
                isDel ? "完成" : "编辑"
              }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col
                span="6"
                v-for="(item, index) in userChannel"
                :key="item.id"
              >
                <!-- 用户频道 item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="onUserChannelClick(item, index)"
                >
                  {{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="
                      isDel && item.name !== '推荐' && userChannel.length > 2
                    "
                  >
                    <template #content>
                      <van-icon
                        name="cross"
                        class="badge-icon"
                        color="#cfcfcf"
                        size="12"
                      />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>
          <div class="van-hairline--top sp-line"></div>
          <!-- 更多频道 -->
          <van-row type="flex">
            <van-col
              span="6"
              v-for="item in moreChannels"
              :key="item.id"
              @click="addChannel(item)"
            >
              <div class="channel-item van-hairline--surround">
                {{ item.name }}
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 用户频道列表API
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updataChannel,
} from "@/API/homeAPI.js";
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
      // 是否显示频道管理弹出层
      show: false,
      // 全部频道列表数据
      allChannel: [],
      // 能否删除用户频道列表
      isDel: false,
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
    // 初始化全部频道列表
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI();
      if (res.message === "OK") {
        this.allChannel = res.data.channels;
      }
    },
    // 添加频道
    addChannel(item) {
      this.userChannel.push(item);
      this.updataChannel();
    },
    // 更新用户频道列表
    async updataChannel() {
      const channels = this.userChannel
        .filter((item) => item.name !== "推荐")
        .map((item, index) => {
          return {
            id: item.id,
            seq: index + 1,
          };
        });

      // 发起请求
      const { data: res } = await updataChannel(channels);
      if (res.message === "更新用户频道成功") {
        this.$notify({ type: "success", message: "更新成功", duration: 1000 });
      }
    },
    // 移除用户频道 item
    onUserChannelClick(channel, index) {
      if (this.isDel) {
        // 删除状态
        if (channel.name === "推荐" || this.userChannel === 2) return;
        this.userChannel = this.userChannel.filter(
          (item) => item.id !== channel.id
        );
        this.updataChannel();
      } else {
        // 点击跳转 item 项
        this.active = index;
        this.show = false;
      }
    },
  },
  components: {
    ArtList,
  },
  computed: {
    // 更多频道数据
    moreChannels() {
      return this.allChannel.filter((item) => {
        let isnum = this.userChannel.findIndex((x) => item.id === x.id);
        if (isnum === -1) return true;
      });
    },
  },
  created() {
    this.initUserChannel();
    this.initAllChannel();
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
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}
.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
    .title-bold {
      font-weight: bold;
    }
    .title-gray {
      color: gray;
      font-size: 12px;
    }
  }
}

.btn-edit {
  border: 1px solid #a3a2a2;
  padding: 0 10px;
  line-height: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 6px;
}

.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

.sp-line {
  margin: 10px 0 20px 0;
}
</style>