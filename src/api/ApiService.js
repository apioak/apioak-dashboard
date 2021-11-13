import { request } from "../libs/http.js";

export default {
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
   * @param id
   * @returns {Promise<unknown>}
   */
  info: (id) => {
    return request("admin/service/info/" + id);
  },

  /**
   * 服务负载均衡列表
   * @param id
   * @param healthCheck
   * @returns {Promise<unknown>}
   */
  getBalanceList: (id, healthCheck) => {
    return request("admin/service/common/load-balance/list");
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
   * @param id
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (id, params) => {
    return request("admin/service/update/" + id, params, "put");
  },

  /**
   * 服务名称更新
   * @param id
   * @param name
   * @returns {Promise<unknown>}
   */
  putName: (id, name) => {
    return request("admin/service/update/name/" + id, { name: name }, "put");
  },

  /**
   * 服务开关
   * @param id
   * @param isEnable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (id, isEnable) => {
    return request(
      "admin/service/switch/enable/" + id,
      { is_enable: isEnable },
      "put"
    );
  },

  /**
   * 服务WebSocket开关
   * @param id
   * @param websocket
   * @returns {Promise<unknown>}
   */
  putSwitchWebsocket: (id, websocket) => {
    return request(
      "admin/service/switch/websocket/" + id,
      { web_socket: websocket },
      "put"
    );
  },

  /**
   * 服务HealthCheck开关
   * @param id
   * @param healthCheck
   * @returns {Promise<unknown>}
   */
  putSwitchHealthCheck: (id, healthCheck) => {
    return request(
      "admin/service/switch/health-check/" + id,
      { health_check: healthCheck },
      "put"
    );
  },

  /**
   * 服务删除
   * @param id
   * @returns {Promise<unknown>}
   */
  delete: (id) => {
    return request("admin/service/delete/" + id, null, "delete");
  },
};
