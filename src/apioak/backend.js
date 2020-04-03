import Vue from "vue";

let ApioakBackend = {};

ApioakBackend.install = function (Vue) {
    let apis = {
        common: {
            projects: '/apioak/admin/projects',

            routers: '/apioak/admin/routers',

            plugins: '/apioak/admin/plugins',

            users: '/apioak/admin/users',

            members: '/apioak/admin/members',
        },

        // Account Apis
        account: {
            login: '/apioak/admin/account/login',

            logout: '/apioak/admin/account/logout',

            register: '/apioak/admin/account/register',

            status: '/apioak/admin/account/status',
        },

        user: {
            created: '/apioak/admin/user',

            deleted: (user_id) => `/apioak/admin/user/${user_id}`,

            enable: (user_id) => `/apioak/admin/user/${user_id}/enable`,

            disable: (user_id) => `/apioak/admin/user/${user_id}/disable`,

            password: (user_id) => `/apioak/admin/user/${user_id}/password`,
        },

        project: {
            query: (project_id) => `/apioak/admin/project/${project_id}`,

            created: `/apioak/admin/project`,

            updated: (project_id) => `/apioak/admin/project/${project_id}`,

            deleted: (project_id) => `/apioak/admin/project/${project_id}`,

            members: (project_id) => `/apioak/admin/project/${project_id}/members`,

            createdMember: (project_id) => `/apioak/admin/project/${project_id}/member`,

            updatedMember: (project_id, user_id) => `/apioak/admin/project/${project_id}/member/${user_id}`,

            deletedMember: (project_id, user_id) => `/apioak/admin/project/${project_id}/member/${user_id}`,

            routers: (project_id) => `/apioak/admin/project/${project_id}/routers`,

            plugins: (project_id) => `/apioak/admin/project/${project_id}/plugins`,

            createdPlugin: (project_id) => `/apioak/admin/project/${project_id}/plugin`,

            deletedPlugin: (project_id, plugin_id) => `/apioak/admin/project/${project_id}/plugin/${plugin_id}`,

            updatedPlugin: (project_id, plugin_id) => `/apioak/admin/project/${project_id}/plugin/${plugin_id}`,
        },

        router: {
            query: (router_id) => `/apioak/admin/router/${router_id}`,

            created: `/apioak/admin/router`,

            updated: (router_id) => `/apioak/admin/router/${router_id}`,

            deleted: (router_id) => `/apioak/admin/router/${router_id}`,

            push: (router_id, env) => `/apioak/admin/router/${router_id}/env/${env}`,

            pull: (router_id, env) => `/apioak/admin/router/${router_id}/env/${env}`,

            plugins: (router_id) => `/apioak/admin/router/${router_id}/plugins`,

            createdPlugin: (router_id) => `/apioak/admin/router/${router_id}/plugin`,

            deletedPlugin: (router_id, plugin_id) => `/apioak/admin/router/${router_id}/plugin/${plugin_id}`,

            updatedPlugin: (router_id, plugin_id) => `/apioak/admin/router/${router_id}/plugin/${plugin_id}`,
        }
    };

    Vue.prototype.$oakBackendApis = apis;
    Vue.$oakBackendApis = apis;
};

export default ApioakBackend;
