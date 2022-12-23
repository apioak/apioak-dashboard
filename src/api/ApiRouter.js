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
    routePlugInId
  ) => {
    return request(
      "admin/route/plugin/switch/release/" +
        routeId +
        "/" +
        plugInId +
        "/" +
        routePlugInId,
      null,
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
