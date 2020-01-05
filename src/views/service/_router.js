/* eslint-disable */
export default [
    {
        path:"/service",
        name:"Service",
        component: () => import(/* webpackChunkName: "service" */ './index.vue')
    },
    // {
    //     path: "/service-detail",
    //     name: "serviceDetail",
    //     component: () => import(/* webpackChunkName: "service" */ './detail/detail.vue')
    // }
]