// let PREFIX = "//49.232.143.79:10080";
let api = {
    // 服务列表
    serviceList: '/api/apioak/admin/services',
    // 创建服务
    creatService:'/api/apioak/admin/service',
    // 更新服务（编辑）
    editService: (service_id) => `/api/apioak/admin/service/${service_id}`
}
export default api