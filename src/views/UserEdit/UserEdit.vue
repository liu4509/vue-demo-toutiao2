<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userProfile.photo"
            @click="$refs.fileRef.click()"
          />
          <!-- 文件选择框 -->
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            v-show="false"
            ref="fileRef"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="onNameCellClick"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthCellClick"
      />
    </van-cell-group>
    <!-- 修改用户名称 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改名称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <!-- input-align 文本横向的对其方式 -->
      <van-field
        v-model.trim="name"
        placeholder="请输入用户名"
        input-align="center"
        maxlength="7"
        ref="nameRef"
      />
    </van-dialog>
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="updateBirthday"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { updateUserProfileAPI, updateUserAvatarAPI } from "@/API/userAPI.js";
import dayjs from "dayjs";
export default {
  name: "UserEdit",
  data() {
    return {
      // 是否展示修改姓名的对话框
      showNameDialog: false,
      // 用户填写的姓名
      name: "",
      // 是否展示修改生日的对话框
      showBirthSheet: false,
      // 最小可选日期（0 表示 1月份）
      minDate: new Date(1900, 0, 1),
      // 最大可选日期（11 表示 12月份）
      maxDate: new Date(2050, 11, 31),
      // 当前日期
      currentDate: new Date(),
    };
  },
  methods: {
    ...mapActions(["initUserProfile"]),
    // 名称单元格 点击事件
    onNameCellClick() {
      this.name = this.userProfile.name;
      this.showNameDialog = true;
      this.$nextTick(() => {
        this.$refs.nameRef.focus();
      });
    },
    // 自定义关闭 dialog 事件
    beforeClose(action, done) {
      // 点击取消按钮
      if (action === "cancel") return done();
      // 判断输入是否合法
      if (this.name === "" || this.name.length > 7) {
        this.$notify({
          type: "warning",
          message: "名称不能为空",
          duration: 2000,
        });
        this.$refs.nameRef.focus();
        return done(false);
      }
      // 点击确认按钮
      this.updateName(done);
    },
    // 更新用户名称
    async updateName(done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name });
        if (res.message === "OK") {
          done();
          this.initUserProfile();
          this.$notify({
            type: "success",
            message: "用户名更新成功",
            duration: 2000,
          });
        }
      } catch (e) {
        if (e.response.status === 409) {
          this.$notify({
            type: "warning",
            message: "名称被占用，请更换后重试",
            duration: 2000,
          });
          done(false);
          this.$refs.nameRef.focus();
        } else {
          done();
          this.$notify({
            type: "danger",
            message: "名称更新失败",
            duration: 2000,
          });
        }
      }
    },
    // 为时间组件赋初始值
    onBirthCellClick() {
      // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
      this.currentDate = this.userProfile.birthday
        ? new Date(this.userProfile.birthday)
        : new Date();
      this.showBirthSheet = true;
    },
    // 时间组件确认按钮事件
    async updateBirthday(value) {
      // 关闭动作面板
      this.showBirthSheet = false;
      // 调用 .format() 方法对时间进行格式化
      const dateStr = dayjs(value).format("YYYY-MM-DD");
      const { data: res } = await updateUserProfileAPI({ birthday: dateStr });
      if (res.message === "OK") {
        // 重新获取用户的简介信息
        this.initUserProfile();
        this.$notify({
          type: "success",
          message: "生日更改成功",
          duration: 2000,
        });
      }
    },
    // 文件改变事件
    async onFileChange(e) {
      // 获取到用户选择的文件列表
      const files = e.currentTarget.files;
      // 如果没有选择任何文件，则不执行后续的业务逻辑
      if (files.length === 0) return;
      // 创建 FormData 对象
      const fd = new FormData();
      fd.append("photo", files[0]);

      const { data: res } = await updateUserAvatarAPI(fd);
      if (res.message === "OK") {
        // 2.1 更新用户的简介信息
        this.initUserProfile();
        // 2.2 提示用户更新成功
        this.$notify({
          type: "success",
          message: "更新头像成功！",
          duration: 2000,
        });
      }
      // 打印用户选择的第一个文件
      console.log(files[0]);
    },
  },
  computed: {
    ...mapState(["userProfile"]),
  },
  created() {
    this.initUserProfile();
  },
};
</script>

<style lang="less" scoped>
.user-edit-container {
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>