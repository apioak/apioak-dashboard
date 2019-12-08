/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let routes = [
  {
    path: "/",
    redirect:'/dashboard'
  }
];
/**
 * require.context 实现流程自动化
 * @description 自动遍历业务侧路由
 * @param { String } directory - 读取的文件路径
 * @param { Boolean } useSubdirectories - 是否遍历文件子目录
 * @param { RegExp } regExp - 匹配文件的正则
 */
const routerContext = require.context('../views', true, /_router\.js$/);
routerContext.keys().forEach(route => {
  const routerModule = routerContext(route);
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  routes = [...routes, ...(routerModule.default || routerModule)];
});
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
