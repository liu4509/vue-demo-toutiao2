import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// vant 组件库
import Vant, { Lazyload } from "vant";
import "vant/lib/index.less";

// rem适配
import "amfe-flexible";

// dayjs插件
import dayjs from "dayjs";
// 导入计算相对时间的插件
import relativeTime from "dayjs/plugin/relativeTime";
// 导入中文语言包
import zh from "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale(zh);

Vue.use(Vant);
Vue.use(Lazyload);
Vue.config.productionTip = false;

Vue.filter("dateFormat", (dt) => {
  return dayjs().to(dt);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
