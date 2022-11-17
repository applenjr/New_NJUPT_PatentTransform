/**
 * @author baoyuhao
 * @date 2022/11/17 10:04:51
 * @description
 * @version 0.1.0
 */

import Layout from "@/layouts/index.vue";

export default [
  /**
   * 教师路由
   */
  // 专利管理
  {
    path: "/patentManage",
    name: "patentManage",
    component: Layout,
    redirect: "/patentManage/patentList",
    meta: { title: "专利管理（教师）", icon: "view-module" },
    children: [
      {
        path: "patentList",
        name: "patentList",
        component: () => import("@/pages/teacher/patentManage/patentList/index.vue"),
        meta: { title: "专利列表" }
      }
      // {
      //   path: "drafts",
      //   name: "drafts",
      //   component: () => import("@/pages/teacher/patentsManager/drafts/index.vue"),
      //   meta: { title: "草稿箱" }
      // }
    ]
  },
  // 审批管理
  {
    path: "/aprovalManage",
    name: "aprovalManage",
    component: Layout,
    redirect: "/aprovalManage/approvalList",
    meta: { title: "审批管理（教师）", icon: "secured" },
    children: [
      {
        path: "approvalList",
        name: "approvalList",
        component: () => import("@/pages/teacher/approvalManage/approvalList/index.vue"),
        meta: { title: "您发起的审批" }
      },
      {
        path: "confirmApproval",
        name: "confirmApproval",
        component: () => import("@/pages/teacher/approvalManage/confirmApprovalLiat/index.vue"),
        meta: { title: "待您确认的转化审批" }
      }
    ]
  }
];
