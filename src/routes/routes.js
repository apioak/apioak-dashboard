import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Services from "@/pages/Services.vue";

import Router from "@/pages/Router.vue";

import Certificate from "@/pages/Certificate.vue";

import ClusterNode from "@/pages/ClusterNode";

import PlugIn from "@/pages/PlugIn";

import Register from "../pages/Register";

import Login from "../pages/Login";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/services",
    children: [
      {
        path: "services",
        name: "Services",
        component: Services,
      },
      {
        path: "/router",
        name: "Router",
        component: Router,
      },
      {
        path: "certificate",
        name: "Certificate",
        component: Certificate,
      },
      {
        path: "cluster-node",
        name: "ClusterNode",
        component: ClusterNode,
      },
      {
        path: "plugin",
        name: "Plugin",
        component: PlugIn,
      },
    ],
  },

];

export default routes;
