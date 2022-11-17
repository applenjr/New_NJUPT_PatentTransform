import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import router, { asyncRouterList } from "@/router";
import { store } from "@/store";

// 路由过滤器（按权限管理路由）
function filterPermissionsRouters(routes: Array<RouteRecordRaw>, role: Array<unknown>) {
  const res = [];
  const removeRoutes = [];
  routes.forEach((route) => {
    const children = [];
    route.children?.forEach((childRouter) => {
      const roleCode = childRouter.meta?.roleCode || childRouter.name;
      if (role.indexOf(roleCode) !== -1) {
        children.push(childRouter);
      } else {
        removeRoutes.push(childRouter);
      }
    });
    if (children.length > 0) {
      route.children = children;
      res.push(route);
    }
  });
  return { accessedRouters: res, removeRoutes };
}

export const usePermissionStore = defineStore("permission", {
  state: () => ({
    whiteListRouters: ["/login"],
    routers: [],
    removeRoutes: []
  }),
  actions: {
    async initRoutes(role: Array<unknown>) {
      let accessedRouters = [];

      let removeRoutes = [];
      // special token
      // console.log(role);
      // if (role.includes("all")) {
      //   accessedRouters = asyncRouterList;
      // } else {
      //   const res = filterPermissionsRouters(asyncRouterList, role);
      //   accessedRouters = res.accessedRouters;
      //   removeRoutes = res.removeRoutes;
      // }
      accessedRouters = asyncRouterList;

      this.routers = accessedRouters;
      this.removeRoutes = removeRoutes;

      removeRoutes.forEach((item: RouteRecordRaw) => {
        if (router.hasRoute(item.name)) {
          router.removeRoute(item.name);
        }
      });
    },
    async restore() {
      this.removeRoutes.forEach((item: RouteRecordRaw) => {
        router.addRoute(item);
      });
    }
  }
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
