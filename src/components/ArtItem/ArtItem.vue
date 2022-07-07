<template>
  <div @click="$router.push('/article/' + artId)">
    <!-- item 项 -->
    <van-cell>
      <!-- // 标题的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ article.title }}</span>
          <!-- 图片 -->
          <img
            alt=""
            class="thumb"
            v-if="article.cover.type === 1"
            v-lazy="article.cover.images[0]"
          />
        </div>
        <div class="thumb-box" v-if="article.cover.type === 3">
          <!-- 图片 -->
          <img
            alt=""
            class="thumb"
            v-for="(item, index) in article.cover.images"
            :key="index"
            v-lazy="item"
          />
        </div>
      </template>
      <!-- // label 的插槽 -->
      <template #label>
        <div class="label-box">
          <span
            >{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论
            &nbsp;&nbsp; {{ article.pubdate | dateFormat }}</span
          >

          <!-- 关闭按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈面板 -->
    <van-action-sheet
      v-model="show"
      :closeable="false"
      cancel-text="取消"
      @closed="isFirst = true"
      get-container="body"
    >
      <div v-if="isFirst">
        <van-cell
          :title="item.name"
          clickable
          class="center-title"
          v-for="item in actions"
          :key="item.name"
          @click="onCellClick(item.name)"
        />
      </div>
      <div v-else>
        <van-cell
          title="返回"
          clickable
          title-class="center-title"
          @click="isFirst = true"
        />
        <van-cell
          :title="item.label"
          clickable
          title-class="center-title"
          v-for="item in reports"
          :key="item.type"
          @click="reportArticle(item.type)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// 反馈面板第二个面板的数据
import reports from "@/API/reports.js";
// 文章不感兴趣API
import { dislikeArticleAPI, removeArticle } from "@/API/homeAPI.js";

export default {
  name: "ArtItem",
  props: {
    // 文章列表 item 项数据
    article: {
      type: Object,
      required: true,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 反馈面板是否显示
      show: false,
      // 第一个面板的可选项列表
      actions: [
        { name: "不感兴趣" },
        { name: "反馈垃圾内容" },
        { name: "拉黑作者" },
      ],
      // 是否展示第一个反馈面板
      isFirst: true,
      // 反馈面板第二个面板的数据
      reports,
    };
  },
  methods: {
    // 反馈面板点击事件
    async onCellClick(name) {
      if (name === "不感兴趣") {
        const { data: res } = await dislikeArticleAPI(this.artId);
        if (res.message === "OK") {
          this.$emit("removeArticle", this.artId);
        }
        this.show = false;
      } else if (name === "拉黑作者") {
        console.log("拉黑作者");
        this.show = false;
      } else if (name === "反馈垃圾内容") {
        // 删除当前 item 项
        this.isFirst = false;
      }
    },
    // 举报文章
    async reportArticle(type) {
      const { data: res } = await removeArticle(this.artId, type);
      if (res.message === "OK") {
        this.$emit("removeArticle", this.artId);
      }
    },
  },
  computed: {
    artId() {
      return this.article.art_id.toString();
    },
  },
};
</script>

<style lang="less" scoped>
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  // 等比例裁剪
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
.center-title {
  text-align: center;
}
</style>