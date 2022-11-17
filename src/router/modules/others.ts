/**
 * @author baoyuhao
 * @date 2022/11/16 14:32:41
 * @description
 * @version 0.1.0
 */
import LogoutIcon from "@/assets/assets-slide-logout.svg";

export default [
  {
    path: "/loginRedirect",
    name: "loginRedirect",
    redirect: "/login",
    meta: { title: "登录页", icon: LogoutIcon, hidden: true },
    component: () => import("@/layouts/blank.vue"),
    children: [
      {
        path: "index",
        redirect: "/login",
        component: () => import("@/layouts/blank.vue"),
        meta: { title: "登录中心" }
      }
    ]
  }
];
