import { request } from "../libs/http.js";

export default {
  /**
   * 节点列表
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (params) => {
    return request("admin/cluster-node/list", params);
  },

  /**
   * 节点开关
   * @param id
   * @param isEnable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (id, isEnable) => {
    return request(
      "admin/cluster-node/switch/enable/" + id,
      { is_enable: isEnable },
      "put"
    );
  },

  /**
   * 节点删除
   * @param id
   * @returns {Promise<unknown>}
   */
  delete: (id) => {
    return request("admin/cluster-node/delete/" + id, null, "delete");
  },
};
