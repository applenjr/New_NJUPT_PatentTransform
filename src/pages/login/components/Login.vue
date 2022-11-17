<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="username">
        <t-input v-model="formData.username" size="large" placeholder="请输入工号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录</t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FormInstanceFunctions, MessagePlugin } from "tdesign-vue-next";
import { useUserStore, usePermissionStore } from "@/store";
import { request } from "@/utils/request";
import md5 from "js-md5";

const userStore = useUserStore();
const permissionStore = usePermissionStore();

const FORM_RULES = {
  username: [{ required: true, message: "工号必填", type: "error" }],
  password: [{ required: true, message: "密码必填", type: "error" }]
};

const type = ref("password");

const form = ref<FormInstanceFunctions>();
const formData = ref({
  username: "teacher",
  password: "abc123123"
});
const showPsw = ref(false);

const router = useRouter();

const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    console.log(formData.value);
    let obj = ref({
      ...formData.value,
      password: md5(formData.value.password)
    });
    // await userStore.login(formData.value);
    request.post({
      url: "/authorize/loginByPassword",
      data: obj.value
    }).then((res) => {
        console.log(res);
        let userInfo = {
          userName: res.userName,
          userGh: res.userGh,
          role: res.role,
          userDepartment: res.userDepartment
        };
        userStore.setUserInfo(userInfo);
        console.log(userStore.getUserInfo());
        permissionStore.initRoutes(userInfo.role);
        console.log(permissionStore.routers);
        MessagePlugin.success("Welcome，" + userStore.userInfo.userName + "！");
        console.log(router.options);
        switch (res.role) {
          case "superadmin":
            router.push({
              path: "/patentManage/patentList"
            });
            break;
          case "admin":
            router.push({
              path: "/patentManage/patentList"
            });
            break;
          case "teacher":
            router.push({
              path: "/patentManage/patentList"
            });
            break;
          case "finance":
            router.push({
              path: "/contract_invoice"
            });
            break;
          case "root":
            // sessionStorage.setItem(
            //   "state",
            //   JSON.stringify(this.$store.state)
            // );
            router.push({
              path: "/patents"
            });
            break;
          case "academy":
            router.push({
              path: "/data_center"
            });
            break;
          default:
            break;
        }
      }
    ).catch((err) => {
      console.log(err);
      // this.loading = false;
      MessagePlugin.error(err.message);
    }).finally(() => {
    });
  }
};
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
