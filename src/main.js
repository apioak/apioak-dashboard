import Vue from "vue";
import App from "./App.vue";
import ApioakCookie from 'vue-cookies';
import ApioakElement from 'element-ui';
import ApioakBackend from '@/apioak/backend';
import ApioakRequest from '@/apioak/request';
import ApioakConst from "@/apioak/const";
import ApioakRouter from '@/apioak/router';
import ApioakStore from '@/store'

Vue.use(ApioakRouter);
Vue.use(ApioakCookie);
Vue.use(ApioakElement);
Vue.use(ApioakBackend);
Vue.use(ApioakRequest);
Vue.use(ApioakConst);

Vue.config.productionTip = false;

new Vue({
  router: ApioakRouter,
  store: ApioakStore,
  render: h => h(App),
}).$mount("#app");
