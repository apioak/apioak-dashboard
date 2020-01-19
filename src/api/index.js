let api = {
    // 服务列表
    serviceList: '/apioak/admin/services',
    // 创建服务
    creatService: '/apioak/admin/service',
    // 更新服务（编辑）
    editService: (service_id) => `/apioak/admin/service/${service_id}`,
    // 删除服务
    delService: (service_id) => `/apioak/admin/service/${service_id}`,
    // 路由列表
    routersList: '/apioak/admin/routers',
    // 创建路由
    creatRouter: 'apioak/admin/router',
    // 更新路由
    updateRouter: (routerid) => `apioak/admin/router/${routerid}`,
    // 发布路由
    publishRouter: (routerid, env) => `apioak/admin/router/${routerid}/env/${env}`,
    // 获取插件列表
    pluginList: 'apioak/admin/plugins',
    // 服务插件保存
    saveServicePlugin: (service_id) => `/apioak/admin/service/${service_id}/plugin`,
    // 服务插件删除
    delServicePlugin: (service_id, key) => `/apioak/admin/service/${service_id}/plugin/${key}`,
    // 路由插件保存
    saveRouterPlugin: (routerid) => `/apioak/admin/router/${routerid}/plugin`,
    // 路由插件删除
    delRouterPlugin: (routerid, key) => `/apioak/admin/router/${routerid}/plugin/${key}`
}
export default api
