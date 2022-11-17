import { defineStore } from "pinia";
import { store, usePermissionStore } from "@/store";

import { request } from "@/utils/request";

const InitUserInfo = {
  userName: "",
  userGh: "",
  role: "",
  userDepartment: ""
};

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: InitUserInfo
  }),
  getters: {
    role: (state) => {
      return state.userInfo?.role;
    }
  },
  actions: {
    async setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    async getUserInfo() {
      request.get({
        url: "/user/getLoginUserInfo"
      }).then(res => {
        console.log(res);
        let userInfo = {
          userName: res.userName,
          userGh: res.userGh,
          role: res.role,
          userDepartment: res.userDepartment
        };
        this.userInfo = userInfo;
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        // return this.userInfo;
      });
    },
    async logout() {
      this.userInfo = InitUserInfo;
    }
  },
  persist: {
    afterRestore: (ctx) => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes(ctx.store.role);
    }
  }
});

export function getUserStore() {
  return useUserStore(store);
}
