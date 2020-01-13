/* eslint-disable */
export default [
    {
        path:"/dashboard",
        name:"Dashboard",
        
        component: () => import(/* webpackChunkName: "dashboard" */ './index.vue')
    }
]