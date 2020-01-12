/* eslint-disable */
export default [
    {
        path:"/service",
        name:"service",
        component: () => import('./index.vue')
    },
    // {
    //     path: "/service-detail",
    //     name: "serviceDetail",
    //     component: () => import(/* webpackChunkName: "service" */ './detail/detail.vue')
    // }
]