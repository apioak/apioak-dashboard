import Vue from "vue";
import App from "./App.vue";
import APIOAKCookie from 'vue-cookies';
import APIOAKElement from 'element-ui';
import APIOAKBackend from '@/apioak/backend';
import APIOAKRequest from '@/apioak/request';
import APIOAKConst from "@/apioak/const";
import APIOAKRouter from '@/router';
import APIOAKStore from '@/store/index';

Vue.use(APIOAKRouter);
Vue.use(APIOAKCookie);
Vue.use(APIOAKElement);
Vue.use(APIOAKBackend);
Vue.use(APIOAKRequest);
Vue.use(APIOAKConst);

Vue.config.productionTip = false;

new Vue({
  router: APIOAKRouter,
  store: APIOAKStore,
  render: h => h(App),
}).$mount("#app");
