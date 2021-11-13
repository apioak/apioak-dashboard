import { request } from "../libs/http.js";

export default {
  /**
   * 插件类型
   * @returns {Promise<unknown>}
   */
  typeList: () => {
    return request("admin/plugin/type-list");
  },

  /**
   * 插件列表
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (params) => {
    return request("admin/plugin/list", params);
  },

  /**
   * 插件详情
   * @param id
   * @returns {Promise<unknown>}
   */
  info: (id) => {
    return request("admin/plugin/info/" + id);
  },

  /**
   * 插件增加
   * @param params
   * @returns {Promise<unknown>}
   */
  post: (params) => {
    return request("admin/plugin/add", params, "post");
  },

  /**
   * 插件修改
   * @param id
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (id, params) => {
    return request("admin/plugin/update/" + id, params, "put");
  },

  /**
   * 插件删除
   * @param id
   * @returns {Promise<unknown>}
   */
  delete: (id) => {
    return request("admin/plugin/delete/" + id, null, "delete");
  },
};
