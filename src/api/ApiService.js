import { request } from "../libs/http.js";

export default {
  /**
   * 服务名称列表
   * @returns {Promise<unknown>}
   */
  getNameList: () => {
    return request("admin/service/name/list", null);
  },

  /**
   * 服务列表
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (params) => {
    return request("admin/service/list", params);
  },

  /**
   * 服务详情
   * @param resId
   * @returns {Promise<unknown>}
   */
  info: (resId) => {
    return request("admin/service/info/" + resId);
  },
  /**
   * 服务增加
   * @param params
   * @returns {Promise<unknown>}
   */
  post: (params) => {
    return request("admin/service/add", params, "post");
  },

  /**
   * 服务修改
   * @param resId
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (resId, params) => {
    return request("admin/service/update" + resId, params, "put");
  },

  /**
   * 服务名称更新
   * @param resId
   * @param name
   * @returns {Promise<unknown>}
   */
  putName: (resId, name) => {
    return request("admin/service/update/name/" + resId, { name: name }, "put");
  },

  /**
   * 服务发布
   * @param resId
   * @returns {Promise<unknown>}
   */
  putSwitchRelease: (resId) => {
    return request("admin/service/switch/release/" + resId, null, "put");
  },

  /**
   * 服务开关
   * @param resId
   * @param enable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (resId, enable) => {
    return request(
      "admin/service/switch/enable/" + resId,
      { enable: enable },
      "put"
    );
  },
  /**
   * 服务删除
   * @param resId
   * @returns {Promise<unknown>}
   */
  delete: (resId) => {
    return request("admin/service/delete/" + resId, null, "delete");
  },
};
