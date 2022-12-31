import { request } from "../libs/http.js";

export default {
  /**
   * 证书列表
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (params) => {
    return request("admin/certificate/list", params);
  },

  /**
   * 证书详情
   * @param resId
   * @returns {Promise<unknown>}
   */
  info: (resId) => {
    return request("admin/certificate/info/" + resId);
  },

  /**
   * 证书增加
   * @param params
   * @returns {Promise<unknown>}
   */
  post: (params) => {
    return request("admin/certificate/add", params, "post");
  },

  /**
   * 证书修改
   * @param resId
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (resId, params) => {
    return request("admin/certificate/update/" + resId, params, "put");
  },

  /**
   * 证书开关
   * @param resId
   * @param enable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (resId, enable) => {
    return request("admin/certificate/switch/enable/" + resId, { enable: enable }, "put");
  },

  /**
   * 证书删除
   * @param resId
   * @returns {Promise<unknown>}
   */
  delete: (resId) => {
    return request("admin/certificate/delete/" + resId, null, "delete");
  },
};
