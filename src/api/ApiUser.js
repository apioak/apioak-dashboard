import { request } from "../libs/http.js";

export default {
  /**
   * 登录接口
   * @param email
   * @param password
   * @returns {Promise<unknown>}
   * @constructor
   */
  login: (email, password) => {
    return request(
      "admin/user/login",
      { email: email, password: password },
      "post"
    );
  },

  logout: (email, password) => {
    return request("admin/user/logout", null, "post");
  },

  register: (params) => {
    return request("admin/user/register", params, "post");
  },
};
