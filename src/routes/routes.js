import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Services from "@/pages/Services.vue";
import ServiceDetail from "@/pages/Service/Detail";
import ServiceRoute from "@/pages/Route";

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
        path: "services/detail",
        name: "ServiceDetail",
        component: ServiceDetail,
      },
      {
        path: "services/route",
        name: "ServiceRoute",
        component: ServiceRoute,
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
        path: "plug-in",
        name: "PlugIn",
        component: PlugIn,
      },
    ],
  },
];

export default routes;
