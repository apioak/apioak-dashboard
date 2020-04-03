let ApioakConst = {};

ApioakConst.install = function (Vue) {
    let constants = {
        cookies: {
            APIOAK_ADMIN_TOKEN: 'APIOAK-ADMIN-TOKEN',
            APIOAK_ADMIN_ID: 'APIOAK-ADMIN-ID',
            APIOAK_ADMIN_NAME: 'APIOAK-ADMIN-NAME',
            APIOAK_ADMIN_OWNER: 'APIOAK-ADMIN-OWNER',
        }
    };
    Vue.prototype.$oakConst = constants;
    Vue.$oakConst = constants;
};

export default ApioakConst;
