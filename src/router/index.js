import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 路由懒加载 const Login = () => import('@/views/Login/Login.vue')
// 登录组件
const Login = () => import("@/views/Login/Login.vue");
// 主页组件
const Main = () => import("@/views/Main/Main.vue");
// 主页-首页组件
const Home = () => import("@/views/Home/Home.vue");
// 主页-我的组件
const User = () => import("@/views/User/User.vue");
// 搜索组件
const Search = () => import("@/views/Search/Search.vue");
// 搜索结果页面
const SearchResult = () => import("@/views/SearchResult/SearchResult.vue");
const routes = [
  { path: "/login", component: Login, name: "login" },
  {
    path: "/",
    component: Main,
    name: "main",
    redirect: "home",
    children: [
      { path: "home", component: Home, name: "home" },
      { path: "user", component: User, name: "user" },
    ],
  },
  { path: "/search", component: Search, name: "search" },
  {
    path: "/search/:kw",
    component: SearchResult,
    name: "search-result",
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
