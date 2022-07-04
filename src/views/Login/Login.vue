<template>
  <div class="login-container">
    <van-nav-bar title="黑马头条 - 登录" fixed placeholder />
    <!-- 登录的表单 -->
    <van-form @submit="login">
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号码"
        required
        :rules="rules.mobile"
      ></van-field>
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入登录密码"
        required
        :rules="rules.code"
      ></van-field>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// API
// 登录API
import { loginAPI } from "@/API/userAPI.js";

// 引入 vuex
import { mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数
      form: {
        // 手机号
        mobile: "13888888123",
        // 登录密码
        code: "246810",
      },
      // 表单效验规则
      rules: {
        // 手机效验规则
        mobile: [
          { required: true, message: "请填写你的手机号", trigger: "onBlue" },
          // 11位手机号
          {
            pattern: /^1\d{10}$/,
            message: "请填写正确的手机号",
            trigger: "onBlur",
          },
        ],
        // 密码效验规则
        code: [
          { required: true, message: "请填写你的密码", trigger: "onBlue" },
        ],
      },
    };
  },
  methods: {
    // 使用 vuex 里面的数据
    ...mapMutations(["updateTokenInfo"]),

    async login() {
      const { data: res } = await loginAPI(this.form);
      if (res.message === "OK") {
        this.updateTokenInfo(res.data);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
