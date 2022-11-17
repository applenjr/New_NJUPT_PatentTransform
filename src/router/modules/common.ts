/**
 * @author baoyuhao
 * @date 2022/11/18 00:20:53
 * @description
 * @version 0.1.0
 */
import Layout from "@/layouts/index.vue";

export default [
  /**
   * 公共页面
   */
  {
    path: "/user",
    name: "user",
    component: Layout,
    redirect: "/user/index",
    meta: { title: "个人页", icon: "user-circle", hidden: true },
    children: [
      {
        path: "index",
        name: "UserIndex",
        component: () => import("@/pages/user/index.vue"),
        meta: { title: "个人中心" }
      }
    ]
  },
  {
    path: "/dashboard",
    component: Layout,
    redirect: "/dashboard/base",
    name: "dashboard",
    meta: { title: "通知中心", icon: "notification" },
    children: [
      {
        path: "base",
        name: "DashboardBase",
        component: () => import("@/pages/dashboard/base/index.vue"),
        meta: { title: "概览仪表盘" }
      },
      {
        path: "detail",
        name: "DashboardDetail",
        component: () => import("@/pages/dashboard/detail/index.vue"),
        meta: { title: "统计报表" }
      }
    ]
  },
  {
    path: "/annualFeeDeadline",
    component: Layout,
    redirect: "/annualFeeDeadline/base",
    name: "annualFeeDeadline",
    meta: { title: "年费到期", icon: "time", single: true },
    children: [
      {
        path: "base",
        name: "annualFeeDeadlineMain",
        component: () => import("@/pages/common/annualFeeDeadline/index.vue"),
        meta: { title: "年费到期" }
      }
    ]
  }
];
