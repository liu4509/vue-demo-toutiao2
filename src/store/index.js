import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import { getUserInfoAPI, getUserProfileAPI } from "@/API/userAPI.js";

let initState = {
  tokenInfo: {},
  // 用户基本信息
  userInfo: {},
  // 用户简介信息
  userProfile: {},
};

// 读取 localStorage 里面的 state
const stateStr = localStorage.getItem("state");
if (stateStr) {
  initState = JSON.parse(stateStr);
}

export default new Vuex.Store({
  // 全局数据
  state: initState,
  // 包装全局数据
  getters: {},
  // 修改全局数据
  mutations: {
    // 更新 token
    updateTokenInfo(state, payload) {
      state.tokenInfo = payload;
      this.commit("saveStateToStorage");
    },
    // 将 state 数据 持久化存储在 localStorage
    saveStateToStorage(state) {
      localStorage.setItem("state", JSON.stringify(state));
    },
    // 更新 用户基本信息
    updataUserInfo(state, payload) {
      state.userInfo = payload;
      this.commit("saveStateToStorage");
    },
    // 退出登录 清空 state 值
    cleanState(state) {
      state.tokenInfo = {};
      state.userInfo = {};
      state.userProfile = {};
      this.commit("saveStateToStorage");
    },
    // 更新 用户简介信息
    updataUserProfile(state, payload) {
      state.userProfile = payload;
      this.commit("saveStateToStorage");
    },
  },
  // 异步修改全局数据
  actions: {
    // 初始化用户基本信息
    async initUserInfo(ctx) {
      const { data: res } = await getUserInfoAPI();
      if (res.message === "OK") {
        ctx.commit("updataUserInfo", res.data);
      }
    },
    // 初始化用户简介信息
    async initUserProfile(ctx) {
      const { data: res } = await getUserProfileAPI();
      if (res.message === "OK") {
        ctx.commit("updataUserProfile", res.data);
      }
    },
  },
});
