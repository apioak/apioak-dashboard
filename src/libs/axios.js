import axios from "axios";
import Vue from "vue";

axios.defaults.timeout = 15000;
//请求拦截器
axios.interceptors.request.use(
  function (config) {
    //config.data = qs.stringify(config.data);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// //响应拦截器
axios.interceptors.response.use(
  function (config) {
    let res = config.data;
    if (res.code === 401) {
      window.location.href = "/#/login";
    }
    /*if (res.code === 401) {
      message.error("登录状态失效")
      window.location.href = '/#/login'
    }else if(res.code === 403){
      message.error(res.msg)
      window.location.href = '/#/choose'
    }*/
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axios;
