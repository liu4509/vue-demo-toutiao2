<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="18"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length != 0">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="item"
        @click="gotoSearchResult"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="history = []" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(item, index) in history"
          :key="index"
          @click="gotoSearchResult"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
// 搜索建议API
import { getSuggestListAPI } from "@/API/searchAPI.js";
// 轻提示 vant 的 组件
import { Toast } from "vant";
export default {
  name: "Search",
  data() {
    return {
      // 搜索关键词
      kw: "",
      // 接收定时器
      timerId: null,
      // 搜索建议列表数据
      suggestList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem("history") || "[]"),
      newKw: "",
      newHistory: [],
    };
  },
  methods: {
    // 搜索组件的输入事件
    onInput() {
      // 重新触发 清空之前的定时器
      clearTimeout(this.timerId);
      // kw 为空 不执行
      if (this.kw.length === 0) {
        this.suggestList = [];
        return;
      }
      // 触发后 存储 kw 值
      this.timerId = setTimeout(() => {
        this.initSuggestList();
      }, 500);
    },
    // 初始化搜索建议列表
    async initSuggestList() {
      const { data: res } = await getSuggestListAPI(this.kw);
      if (res.message === "OK") {
        // 如果搜索没有建议 继续执行该方法就会报错
        if (res.data.options[0] == null) {
          Toast("没有相关内容！");
          this.suggestList = res.data.options;
        } else {
          this.hlightKeywords(res.data.options);
          this.suggestList = res.data.options;
        }
      }
    },
    // 搜索历史
    oleSearchList() {
      // 搜索关键词放进搜索历史
      this.newHistory = this.history.filter((item) => item !== this.newKw);
      this.newHistory.unshift(this.newKw);
      this.history = this.newHistory;
    },
    // 高亮显示搜索关键词
    hlightKeywords(arr) {
      // 动态创建正则表达式
      const reg = new RegExp(this.kw, "ig");
      arr.forEach((item, index) => {
        // 给关键词替换高亮的 style
        arr[index] = item.replace(reg, (val) => {
          return `<span style="color: red; font-weight: bold;">${val}</span>`;
        });
      });
    },
    // 跳转搜索结果
    gotoSearchResult(e) {
      this.newKw = e.target.innerText;
      this.oleSearchList();
      // 添加延时 完成 添加搜索历史
      setTimeout(() => {
        this.$router.push("/search/" + this.newKw);
      }, 50);
    },
  },
  watch: {
    history(newVal) {
      localStorage.setItem("history", JSON.stringify(newVal));
    },
  },
  // Dom 结构渲染到浏览器页面成功时触发
  mounted() {
    const ipt = document.querySelector("input[type=search]");
    ipt && ipt.focus();
  },
};
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  // 后退按钮
  .goback {
    padding-left: 14px;
  }
  // 搜索组件
  .van-search {
    flex: 1;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>