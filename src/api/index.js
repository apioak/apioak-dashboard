// let PREFIX = "//49.232.143.79:10080";
let api = {
    // 服务列表
    serviceList: '/apioak/admin/services',
    // 创建服务
    creatService:'/apioak/admin/service',
    // 更新服务（编辑）
    editService: (service_id) => `/apioak/admin/service/${service_id}`,
    // 删除服务
    delService: (service_id) => `/apioak/admin/service/${service_id}`,
    // 路由列表
    routersList:'/apioak/admin/routers'
}
export default api