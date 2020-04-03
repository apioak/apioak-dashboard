import Vue from "vue";
import axios from "axios";

const Axios = axios.create({
    timeout: 6000
});

Axios.interceptors.request.use(function (config) {
    let adminTokenKey = Vue.$oakConst.cookies.APIOAK_ADMIN_TOKEN || '';
    let adminToken = Vue.$cookies.get(adminTokenKey);
    if (adminToken && adminToken.length > 0) {
        config.headers[adminTokenKey] = adminToken;
    }
    return config;
});

Axios.interceptors.response.use(function (response) {
    return Promise.resolve(response)
}, function (error) {
    let response = error.response;
    if (response.status === 401) {
        Object.keys(Vue.$oakConst.cookies).forEach(cookieKey => {
            Vue.$cookies.remove(cookieKey);
        });
        Vue.prototype.$message({
            type: "error",
            message: response.data.err_message,
        });
        return Vue.prototype.$oakRouter.push({
            path: '/account/login',
        });
    } else {
        Vue.prototype.$message({
            type: "error",
            message: response.data.err_message,
        });
        return Promise.reject(response);
    }
});

let ApioakRequest = {};

ApioakRequest.install = function (Vue) {
    Vue.prototype.$oakRequest = this;
    Vue.$oakRequest = this;
};

ApioakRequest._request = function (method, url, params) {
    return new Promise((resolve, reject) => {
        let options = {
            method: method,
            url: url,
        };
        if (method === 'GET' || method === 'DELETE') {
            if (params && Object.keys(params).length > 0) {
                options.params = params;
            }
        }
        if (method === 'PUT' || method === 'POST') {
            if (params && Object.keys(params).length > 0) {
                options.data = params;
            }
        }
        Axios(options).then(
            res => {
                resolve(res);
            },
            err => {
                reject(err);
            }
        );
    });
};

ApioakRequest.get = function (url, params) {
    return this._request('GET', ...arguments);
};

ApioakRequest.post = function (url, params) {
    return this._request('POST', ...arguments);
};

ApioakRequest.put = function (url, params) {
    return this._request('PUT', ...arguments);
};

ApioakRequest.delete = function (url, params) {
    return this._request('DELETE', ...arguments);
};

export default ApioakRequest;
