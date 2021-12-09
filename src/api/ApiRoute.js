import { request } from "../libs/http.js";

export default {
  /**
   * 路由列表
   * @param serviceId
   * @param params
   * @returns {Promise<unknown>}
   */
  getList: (serviceId, params) => {
    return request("admin/route/list/" + serviceId, params);
  },

  /**
   * 路由详情
   * @param serviceId
   * @param id
   * @returns {Promise<unknown>}
   */
  info: (serviceId, id) => {
    return request("admin/route/info/" + serviceId + "/" + id);
  },

  /**
   * 路由增加
   * @param serviceId
   * @param params
   * @returns {Promise<unknown>}
   */
  post: (serviceId, params) => {
    return request("admin/route/add/" + serviceId, params, "post");
  },

  /**
   * 路由修改
   * @param id
   * @param params
   * @returns {Promise<unknown>}
   */
  put: (id, params) => {
    return request(
      "admin/route/update/" + params.service_id + "/" + id,
      params,
      "put"
    );
  },

  /**
   * 路由修改
   * @param id
   * @param params
   * @returns {Promise<unknown>}
   */
  copy: (id, params) => {
    return request(
      "admin/route/copy/" + params.service_id + "/" + id,
      params,
      "post"
    );
  },

  /**
   * 路由名称更新
   * @param serviceId
   * @param id
   * @param name
   * @returns {Promise<unknown>}
   */
  putName: (serviceId, id, name) => {
    return request(
      "admin/route/update/name/" + serviceId + "/" + id,
      { name: name },
      "put"
    );
  },

  /**
   * 路由发布
   * @param serviceId
   * @param id
   * @param isRelease
   * @returns {Promise<unknown>}
   */
  putSwitchRelease: (serviceId, id, isRelease) => {
    return request(
      "admin/route/switch/release/" + serviceId + "/" + id,
      { is_release: isRelease },
      "put"
    );
  },

  /**
   * 路由开关
   * @param serviceId
   * @param id
   * @param isEnable
   * @returns {Promise<unknown>}
   */
  putSwitchEnable: (serviceId, id, isEnable) => {
    return request(
      "admin/route/switch/enable/" + serviceId + "/" + id,
      { is_enable: isEnable },
      "put"
    );
  },

  /**
   * 路由删除
   * @param serviceId
   * @param id
   * @returns {Promise<unknown>}
   */
  delete: (serviceId, id) => {
    return request(
      "admin/route/delete/" + serviceId + "/" + id,
      null,
      "delete"
    );
  },

  /**
   * 【路由-插件】路由增加插件列表
   * @param serviceId
   * @param routeId
   * @returns {Promise<unknown>}
   */
  addPluginList: (serviceId, routeId) => {
    return request("admin/route/add-plugin/list/" + serviceId + "/" + routeId);
  },

  /**
   * 【路由-插件】路由插件列表（包含配置）
   * @param serviceId
   * @param routeId
   * @returns {Promise<unknown>}
   */
  routePluginList: (serviceId, routeId) => {
    return request("admin/route/plugin/list/" + serviceId + "/" + routeId);
  },

  /**
   * 【路由-插件】路由插件增加
   * @param serviceId
   * @param routeId
   * @param plugInId
   * @param params
   * @returns {Promise<unknown>}
   */
  addRoutePlugin: (serviceId, routeId, plugInId, params) => {
    return request(
      "admin/route/plugin/add/" + serviceId + "/" + routeId + "/" + plugInId,
      params,
      "post"
    );
  },

  /**
   * 【路由-插件】路由插件详情
   * @param serviceId
   * @param routeId
   * @returns {Promise<unknown>}
   */
  routePluginInfo: (routeId, plugInId, routePlugInId) => {
    return request(
      "admin/route/plugin/info/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId
    );
  },

  /**
   * 【路由-插件】路由插件发布更新
   * @param routeId
   * @param plugInId
   * @param routePlugInId
   * @param isRelease
   * @returns {Promise<unknown>}
   */
  putSwitchRoutePluginRelease: (
    routeId,
    plugInId,
    routePlugInId,
    isRelease
  ) => {
    return request(
      "admin/route/plugin/switch/release/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId,
      { is_release: isRelease },
      "put"
    );
  },

  /**
   * 【路由-插件】路由插件开关更新
   * @param routeId
   * @param plugInId
   * @param routePlugInId
   * @param isEnable
   * @returns {Promise<unknown>}
   */
  putSwitchRoutePluginEnable: (routeId, plugInId, routePlugInId, isEnable) => {
    return request(
      "admin/route/plugin/switch/enable/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId,
      { is_enable: isEnable },
      "put"
    );
  },

  /**
   * 【路由-插件】路由插件配置更新
   * @param routeId
   * @param plugInId
   * @param routePlugInId
   * @param params
   * @returns {Promise<unknown>}
   */
  updateRoutePlugin: (routeId, plugInId, routePlugInId, params) => {
    return request(
      "admin/route/plugin/update/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId,
      params,
      "put"
    );
  },

  /**
   * 【路由-插件】路由插件删除
   * @param routeId
   * @param plugInId
   * @param routePlugInId
   * @returns {Promise<unknown>}
   */
  deleteRoutePlugin: (routeId, plugInId, routePlugInId) => {
    return request(
      "admin/route/plugin/delete/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId,
      null,
      "delete"
    );
  },
};
