import { request } from "../libs/http.js";

export default {
  /**
   * 路由列表
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (params) => {
    return request("admin/router/list", params);
  },

  /**
   * 路由详情
   * @param serviceResId
   * @param routerResId
   * @returns {Promise<unknown>}
   */
  info: (serviceResId, routerResId) => {
    return request("admin/router/info/" + serviceResId + "/" + routerResId);
  },

  /**
   * 路由增加
   * @param params
   * @returns {Promise<unknown>}
   */
  post: (params) => {
    return request("admin/router/add", params, "post");
  },

  /**
   * 路由修改
   * @param serviceResId
   * @param routerResId
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (serviceResId, routerResId, params) => {
    return request("admin/router/update/" + serviceResId + "/" + routerResId, params, "put");
  },

  /**
   * 路由复制
   * @param serviceResId
   * @param routerResId
   * @returns {Promise<unknown>}
   */
  copy: (serviceResId, routerResId) => {
    return request("admin/router/copy/" + serviceResId + "/" + routerResId, null, "post");
  },

  /**
   * 路由名称更新
   * @param serviceResId
   * @param routerResId
   * @param routerName
   * @returns {Promise<unknown>}
   */
  putName: (serviceResId, routerResId, routerName) => {
    return request(
        "admin/router/update/name/" + serviceResId + "/" + routerResId,
        { name: routerName },
        "put"
    );
  },

  /**
   * 路由发布
   * @param serviceResId
   * @param routerResId
   * @returns {Promise<unknown>}
   */
  putSwitchRelease: (serviceResId, routerResId) => {
    return request("admin/router/switch/release/" + serviceResId + "/" + routerResId, null, "put");
  },

  /**
   * 路由开关
   * @param serviceResId
   * @param routerResId
   * @param enable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (serviceResId, routerResId, enable) => {
    return request(
      "admin/router/switch/enable/" + serviceResId + "/" + routerResId,
      { enable: enable },
      "put"
    );
  },

  /**
   * 路由删除
   * @param serviceResId
   * @param routerResId
   * @returns {Promise<unknown>}
   */
  delete: (serviceResId, routerResId) => {
    return request(
      "admin/router/delete/" + serviceResId + "/" + routerResId,
      null,
      "delete"
    );
  },

};
