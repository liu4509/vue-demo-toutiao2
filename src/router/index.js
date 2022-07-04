import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 路由懒加载 const Login = () => import('@/views/Login/Login.vue')
// 登录组件
const Login = () => import("@/views/Login/Login.vue");

const routes = [{ path: "/login", component: Login, name: "login" }];

const router = new VueRouter({
  routes,
});

export default router;
