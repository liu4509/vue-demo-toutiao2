<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 评论列表 -->
    <van-list
      class="cmt-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了"
      :immediate-check="false"
      @load="onLoad"
    >
      <!-- 评论 item 项 -->
      <div
        class="cmt-item"
        v-for="item in cmtlist"
        :key="item.com_id.toString()"
      >
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              name="like"
              size="16"
              color="red"
              v-if="item.is_liking"
              @click="delLike(item)"
            />
            <van-icon
              name="like-o"
              size="16"
              color="gray"
              v-else
              @click="addLike(item)"
            />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{ item.content }}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>

    <!-- 添加评论 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="cmtCount" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" @click="showShare = true" />
      </div>
    </div>

    <!-- 输入评论内容 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="评论内容"
        @blur="hideBox2"
        ref="iptCmt"
        v-model.trim="cmt"
      ></textarea>
      <van-button type="default" :disabled="cmt.length === 0" @click="pubCmt"
        >发布</van-button
      >
    </div>

    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
  </div>
</template>

<script>
// 文章评论 API
import {
  getCmtListAPI,
  addLikeCmtAPI,
  delLikeCmtAPI,
  pubCommentAPI,
} from "@/API/articleAPI.js";
// 从 popmotion 中按需导入 animate 动画函数
import { animate } from "popmotion";

export default {
  name: "ArtCmt",
  props: {
    id: {
      type: Number | String,
    },
  },
  data() {
    return {
      offset: null,
      // 文章评论列表数据
      cmtlist: [],
      // 上拉加载
      loading: false,
      finished: false,
      // 切换评论组件
      isShowBox1: true,
      // 评论总数量
      cmtCount: 0,
      // 用户输入的评论内容
      cmt: "",
      // 分享面板
      showShare: false,
      // 分享面板数据
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
    };
  },
  methods: {
    // 初始化文章评论数据
    async initCmtList() {
      const { data: res } = await getCmtListAPI(this.id, this.offset);
      if (res.message === "OK") {
        // 偏移量
        this.offset = res.data.last_id;
        // 评论数据
        this.cmtlist = [...this.cmtlist, ...res.data.results];
        this.loading = false;

        this.cmtCount = res.data.total_count;
        if (res.data.results.length === 0) {
          this.finished = true;
        }
      }
    },
    // 上拉加载事件
    onLoad() {
      this.initCmtList();
    },
    // 文章评论点赞
    async addLike(cmt) {
      const { data: res } = await addLikeCmtAPI(cmt.com_id.toString());
      if (res.message === "OK") {
        cmt.is_liking = true;
      }
    },
    // 文章评论取消点赞
    async delLike(cmt) {
      const res = await delLikeCmtAPI(cmt.com_id.toString());
      if (res.status === 204) {
        cmt.is_liking = false;
      }
    },
    // 显示评论输入
    showBox2() {
      this.isShowBox1 = false;
      this.$nextTick(() => {
        this.$refs.iptCmt.focus();
      });
    },
    // 失去焦点 返回 box1
    hideBox2() {
      // 给点击发布按钮一点时间
      setTimeout(() => {
        this.isShowBox1 = true;
      }, 50);
    },
    // 发布评论
    async pubCmt() {
      const { data: res } = await pubCommentAPI(this.id, this.cmt);
      if (res.message === "OK") {
        // 添加进评论列表
        this.cmtlist.unshift(res.data.new_obj);
        // 评论数量 +1
        this.cmtCount += 1;
        // 给 是否点赞  赋初始值
        res.data.new_obj.is_liking = false;
        this.cmt = "";
        this.initAnimate();
        // 提示用户成功
        this.$toast.success("评论成功！");
      }
    },
    // 滚动到评论列表区域
    scrollToCmtList() {
      this.initAnimate();
    },
    // 滚动动画
    initAnimate() {
      // 1. 当前滚动条的位置
      const now = window.scrollY;
      // 2. 目标位置（文章信息区域的高度）
      const dist = document.querySelector(".article-container").offsetHeight;

      // 3. 实现滚动动画
      animate({
        from: now, // 当前的位置
        to: dist, // 目标位置
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    },
    // 点击分享里面的 item 项事件
    onSelect(option) {
      this.$toast(option.name);
      this.showShare = false;
    },
  },
  created() {
    this.initCmtList();
  },
};
</script>

<style lang="less" scoped>
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>