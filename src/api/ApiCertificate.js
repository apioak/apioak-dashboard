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
   * @param id
   * @returns {Promise<unknown>}
   */
  info: (id) => {
    return request("admin/certificate/info/" + id);
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
   * @param id
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (id, params) => {
    return request("admin/certificate/update/" + id, params, "put");
  },

  /**
   * 证书发布
   * @param id
   * @param isRelease
   * @returns {Promise<unknown>}
   */
  putSwitchRelease: (id, isRelease) => {
    return request(
      "admin/certificate/switch/release/" + id,
      { is_release: isRelease },
      "put"
    );
  },

  /**
   * 证书开关
   * @param id
   * @param isEnable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (id, isEnable) => {
    return request(
      "admin/certificate/switch/enable/" + id,
      { is_enable: isEnable },
      "put"
    );
  },

  /**
   * 证书删除
   * @param id
   * @returns {Promise<unknown>}
   */
  delete: (id) => {
    return request("admin/certificate/delete/" + id, null, "delete");
  },
};
