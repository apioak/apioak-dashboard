import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(Router);

const router = new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/account',
            component: () => import(/* webpackChunkName: "layout" */ "@/components/layouts/account"),
            children: [
                {
                    path: "/account",
                    redirect: "/account/login"
                },
                {
                    path: "/account/login",
                    name: "login",
                    component: () =>
                        import(/* webpackChunkName: "account" */ "@/views/account/login")
                },
                {
                    path: "/account/register",
                    name: "register",
                    component: () =>
                        import(/* webpackChunkName: "account" */ "@/views/account/register")
                },
            ],
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "layout" */ "@/components/layouts/basic"),
            children: [
                {
                    path: "/",
                    redirect: "/projects"
                },
                {
                    path: "/projects",
                    name: "projects",
                    component: () =>
                        import(/* webpackChunkName: "dashboard" */ "@/views/project/index")
                },
                {
                    path: "/routers",
                    name: "routers",
                    component: () =>
                        import(/* webpackChunkName: "dashboard" */ "@/views/router/index")
                },
                {
                    path: "/users",
                    name: "users",
                    component: () =>
                        import(/* webpackChunkName: "dashboard" */ "@/views/user/index")
                },
            ],
        }
    ],
});

router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
        NProgress.start();
    }
    document.title = to.meta.title || 'APIOAK - Full Lifecycle Management API Gateway';
    next();
});

router.afterEach(() => {
    NProgress.done();
});

router.install = function (Vue) {
    Vue.prototype.$oakRouter = this;
};

export default router;

