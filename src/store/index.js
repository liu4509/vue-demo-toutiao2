import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let initState = {
  tokenInfo: {},
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
    updateTokenInfo(state, payload) {
      state.tokenInfo = payload;
      this.commit("saveStateToStorage");
    },
    // 将 state 数据 持久化存储在 localStorage
    saveStateToStorage(state) {
      localStorage.setItem("state", JSON.stringify(state));
    },
  },
  // 异步修改全局数据
  actions: {},
});
