/**
 * @author baoyuhao
 * @date 2022/11/18 00:20:36
 * @description
 * @version 0.1.0
 */
import Layout from "@/layouts/index.vue";

export default [
  /**
   * 产学研路由
   */
  // 价格意向
  {
    path: "/priceIntention",
    name: "priceIntention",
    component: Layout,
    redirect: "/priceIntention/base",
    meta: { title: "价格意向（产学研）", icon: "money-circle", single: true },
    children: [
      {
        path: "base",
        name: "priceIntentionBase",
        component: () => import("@/pages/cxy/priceIntention/base/index.vue"),
        meta: { title: "价格意向" }
      }
    ]
  },
  // 专利审批
  {
    path: "/patentApprove",
    name: "patentApprove",
    component: Layout,
    redirect: "/patentApprove/transform",
    meta: { title: "专利审批（产学研）", icon: "secured" },
    children: [
      {
        path: "transform",
        name: "transform",
        component: () => import("@/pages/cxy/patentApprove/transform/base/index.vue"),
        meta: { title: "转让" }
      },
      {
        path: "permission",
        name: "permission",
        component: () => import("@/pages/cxy/patentApprove/permission/base/index.vue"),
        meta: { title: "许可" }
      },
      {
        path: "waitFirstAuthorApprove",
        name: "waitFirstAuthorApprove",
        component: () => import("@/pages/cxy/patentApprove/waitFirstAuthorApprove/index.vue"),
        meta: { title: "等待第一作者审批" }
      }
    ]
  },
  // 合同管理
  {
    path: "/contractManage",
    name: "contractManage",
    component: Layout,
    redirect: "/contractManage/base",
    meta: { title: "合同管理（产学研）", icon: "file", single: true },
    children: [
      {
        path: "base",
        name: "contractManageBase",
        component: () => import("@/pages/cxy/contractManage/base/index.vue"),
        meta: { title: "合同管理" }
      }
    ]
  },
  // 批量转化
  {
    path: "/batchTransform",
    name: "batchTransform",
    component: Layout,
    redirect: "/batchTransform/base",
    meta: { title: "批量转化（产学研）", icon: "file", single: true },
    children: [
      {
        path: "base",
        name: "batchTransformBase",
        component: () => import("@/pages/cxy/batchTransform/base/index.vue"),
        meta: { title: "合同管理" }
      }
    ]
  },
  // 信息维护
  {
    path: "/informationMaintenance",
    name: "informationMaintenance",
    component: Layout,
    redirect: "/informationMaintenance/company",
    meta: { title: "信息维护（产学研）", icon: "tools" },
    children: [
      {
        path: "company",
        name: "company",
        component: () => import("@/pages/cxy/informationMaintenance/company/index.vue"),
        meta: { title: "公司" }
      },
      {
        path: "agency",
        name: "agency",
        component: () => import("@/pages/cxy/informationMaintenance/agency/index.vue"),
        meta: { title: "中介" }
      }
    ]
  },
  // 数据中心
  {
    path: "/dataCenter",
    name: "dataCenter",
    component: Layout,
    redirect: "/dataCenter/base",
    meta: { title: "数据中心（产学研）", icon: "server", single: true },
    children: [
      {
        path: "base",
        name: "dataCenterBase",
        component: () => import("@/pages/cxy/dataCenter/base/index.vue"),
        meta: { title: "数据中心" }
      }
    ]
  }
];
