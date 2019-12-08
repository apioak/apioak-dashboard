/* eslint-disable */
export default [
    {
        path:"/service",
        name:"Service",
        component: () => import(/* webpackChunkName: "service" */ './index.vue')
    }
]