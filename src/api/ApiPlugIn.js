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
   * 获取增加插件时的插件列表
   * @returns {Promise<unknown>}
   */
  addPluginList: () => {
    return request("admin/plugin/add-list", null);
  },

  /**
   * 插件详情
   * @param resId
   * @returns {Promise<unknown>}
   */
  info: (resId) => {
    return request("admin/plugin/info/" + resId);
  },

  /**
   * 获取目标插件配置列表
   * @param pluginConfigType
   * @param targetResId
   * @returns {Promise<unknown>}
   */
  pluginConfigList: (pluginConfigType, targetResId) => {
    if (pluginConfigType === 1) {
      return request("admin/service/plugin/config/list/" + targetResId, null);
    } else if (pluginConfigType === 2) {
      return request("admin/router/plugin/config/list/" + targetResId, null);
    }
  },

  /**
   * 插件配置增加
   * @param pluginConfigType
   * @param params
   * @returns {Promise<unknown>}
   */
  pluginConfigAdd: (pluginConfigType, params) => {
    if (pluginConfigType === 1) {
      return request("admin/service/plugin/config/add", params, "post");
    } else if (pluginConfigType === 2) {
      return request("admin/router/plugin/config/add", params, "post");
    }
  },

  /**
   * 插件配置更新
   * @param pluginConfigType
   * @param resId
   * @param params
   * @returns {Promise<unknown>}
   */
  pluginConfigUpdate: (pluginConfigType, resId, params) => {
    if (pluginConfigType === 1) {
      return request("admin/service/plugin/config/update/" + resId, params, "put");
    } else if (pluginConfigType === 2) {
      return request("admin/router/plugin/config/update/" + resId, params, "put");
    }
  },

  /**
   * 插件配置开关
   * @param pluginConfigType
   * @param resId
   * @param enable
   * @returns {Promise<unknown>}
   */
  pluginConfigSwitchEnable: (pluginConfigType, resId, enable) => {
    if (pluginConfigType === 1) {
      return request("admin/service/plugin/config/switch/enable/" + resId, { enable : enable }, "put");
    } else if (pluginConfigType === 2) {
      return request("admin/router/plugin/config/switch/enable/" + resId, { enable : enable }, "put");
    }
  },

  /**
   * 插件配置删除
   * @param pluginConfigType
   * @param resId
   * @returns {Promise<unknown>}
   */
  pluginConfigDelete: (pluginConfigType, resId) => {
    if (pluginConfigType === 1) {
      return request("admin/service/plugin/config/delete/" + resId, null, "delete");
    } else if (pluginConfigType === 2) {
      return request("admin/router/plugin/config/delete/" + resId, null, "delete");
    }
  },



};
