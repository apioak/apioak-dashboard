<template>
    <div class="apilist-container">
        <div class="apilist-top">
            <el-button class="apilist-add fl" type="primary" @click="openCreatedRouter" style="margin-right:10px;"
                       icon="el-icon-edit">新建路由
            </el-button>
            <el-form :inline="true" :model="routerQueryData" class="apilist-form-inline">
                <el-select v-model="selectedProjectId" filterable placeholder="请选择项目" style="margin-right: 10px;">
                    <el-option :key="0" label="选择项目" :value="0">
                    </el-option>
                    <el-option v-for="project in projectLists" :key="project.id" :label="project.name"
                               :value="project.id">
                    </el-option>
                </el-select>

                <el-form-item>
                    <el-input v-model="routerQueryData.name" placeholder="输入路由名称"
                              prefix-icon="el-icon-search" @keyup.enter.native="queryRouterByName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryRouterByName" icon="el-icon-search">查询</el-button>
                </el-form-item>
            </el-form>
        </div>


        <div class="apilist-table app-content" v-if="routerCount > 0">
            <el-table :data="routerTableLists" class="list-table">
                <el-table-column width="40px">
                    <template slot-scope="router">
                        <div>
                            <img @click="openPluginRouter(router.row)"
                                 style="width:24px;cursor:pointer;vertical-align: middle;"
                                 src="../../assets/plugin-icon.png" alt="plugin"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="160px" prop="name"></el-table-column>
                <el-table-column label="路径">
                    <template slot-scope="router">
                        <div>
                            <div :class="`request-method-${router.row.request_method}`">{{ router.row.request_method
                                ===
                                "DELETE" ? "DEL" : router.row.request_method }}
                            </div>
                            <span>{{ router.row.request_path }}</span>
                        </div>
                        <div></div>
                    </template>
                </el-table-column>

                <el-table-column label="所属项目" width="100px" prop="project_name">
                    <template slot-scope="router">
                        <el-tag size="medium">{{ router.row.project_name }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="环境" width="100px;">
                    <template slot-scope="router">
                        <div>
                            <p v-if="parseInt(router.row['env_prod_publish']) === 1" style="color:#67C23A;">
                                <i class="dot dot-on"></i>
                                生产环境
                            </p>
                            <p v-else>
                                <i class="dot dot-off"></i>
                                生产环境
                            </p>
                            <p v-if="parseInt(router.row['env_beta_publish']) === 1" style="color:#67C23A;">
                                <i class="dot dot-on"></i>
                                预发环境
                            </p>
                            <p v-else>
                                <i class="dot dot-off"></i>
                                预发环境
                            </p>
                            <p v-if="parseInt(router.row['env_test_publish']) === 1" style="color:#67C23A;">
                                <i class="dot dot-on"></i>
                                测试环境
                            </p>
                            <p v-else>
                                <i class="dot dot-off"></i>
                                测试环境
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="450px">
                    <template slot-scope="router">
                        <div>
                            <el-dropdown>
                                <span class="el-dropdown-link" style="margin-right: 10px">
                                    复制<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="executeCopyRoutePath(router.row,'PROD')">
                                        <div>生产环境</div>
                                    </el-dropdown-item>

                                    <el-dropdown-item @click.native="executeCopyRoutePath(router.row,'BETA')">
                                        <div>预发环境</div>
                                    </el-dropdown-item>

                                    <el-dropdown-item @click.native="executeCopyRoutePath(router.row,'TEST')">
                                        <div>测试环境</div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                            <el-dropdown>
                                <span class="el-dropdown-link" style="margin-right: 10px">
                                    发布<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="executePushRouter(router.row,'PROD')">
                                        <div>生产环境</div>
                                    </el-dropdown-item>

                                    <el-dropdown-item @click.native="executePushRouter(router.row,'BETA')">
                                        <div>预发环境</div>
                                    </el-dropdown-item>

                                    <el-dropdown-item @click.native="executePushRouter(router.row,'TEST')">
                                        <div>测试环境</div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                            <el-dropdown>
                                <span class="el-dropdown-link" style="margin-right: 10px">
                                    下线
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="executePullRouter(router.row,'PROD')">
                                        <div>生产环境</div>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click.native="executePullRouter(router.row,'BETA')">
                                        <div>预发环境</div>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click.native="executePullRouter(router.row,'TEST')">
                                        <div>测试环境</div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button type="primary" size="small" @click="openUpdatedRouter(router.row)">编辑
                            </el-button>
                            <el-button type="success" size="small" @click="openDetailRouter(router.row)"
                                       style="margin-right:10px;">详情
                            </el-button>

                            <el-popconfirm
                                    confirmButtonText='确定'
                                    cancelButtonText='取消'
                                    icon="el-icon-info"
                                    iconColor="red"
                                    @onConfirm="removeRouter(router.row)"
                                    title="确认删除该路由吗？" style="margin-right:10px;">
                                <el-button slot="reference" type="danger" size="small">删除</el-button>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="changePageSize" @current-change="changePageNumber"
                           :current-page="pageNum" :page-sizes="pageSizes" :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="routerCount"
                           class="myGroup-pagination">
            </el-pagination>
        </div>

        <div class="empty-content" v-else>
            <img src="@/assets/empty-background.png" class="empty-background">
        </div>

        <router-detail :routerId="optionDetailRouterId" :open="optionDetailRouterOpen"
                       @changeDetailRouter="changeDetailRouter"></router-detail>

        <router-plugin :routerId="optionPluginRouterId" :open="optionPluginRouterOpen"
                       @changePluginRouter="changePluginRouter"></router-plugin>

        <router-created :routerId="optionCreatedRouterId" :open="optionCreatedRouterOpen"
                        :projectId="optionCreatedRouterProjectId"
                        @changeCreatedRouter="changeCreatedRouter"></router-created>

        <router-updated :routerId="optionUpdatedRouterId" :open="optionUpdatedRouterOpen"
                        @changeUpdatedRouter="changeUpdatedRouter"></router-updated>
    </div>
</template>
<script>

    import RouterUpdated from './updated';
    import RouterCreated from './updated';
    import RouterDetail from './detail';
    import RouterPlugin from './plugin';

    export default {
        components: {
            RouterDetail,
            RouterPlugin,
            RouterCreated,
            RouterUpdated,
        },
        data() {
            return {
                // Router Detail
                optionDetailRouterOpen: false,
                optionDetailRouterId: 0,

                // Router Plugin
                optionPluginRouterOpen: false,
                optionPluginRouterId: 0,

                // Router Updated
                optionUpdatedRouterOpen: false,
                optionUpdatedRouterId: 0,

                // Router Created
                optionCreatedRouterOpen: false,
                optionCreatedRouterId: 0,
                optionCreatedRouterProjectId: 0,

                // Project selected by default
                selectedProjectId: 0,

                routerQueryData: {
                    name: '',
                },
                routerLists: [],
                routerCount: 0,
                routerTableLists: [],

                projectLists: [],

                pageNum: 1, // current page number

                pageSize: 10,

                pageSizes: [10, 15, 20]
            };
        },
        created() {
            this.getProjects();
            this.selectedProjectId = this.$route.params.projectId || 0;
            this.getRouters();
        },
        watch: {
            selectedProjectId() {
                this.getRouters();
            }
        },
        methods: {
            queryRouterByName() {
                let name = this.routerQueryData.name.trim();
                if (name) {
                    this.routerLists = this.routerLists.filter(ele => {
                        return ele.name.includes(name);
                    });
                    this.initTable();
                } else {
                    this.getRouters();
                }
            },
            changePageSize(val) {
                this.pageSize = val;
                this.initTable();
            },
            changePageNumber(val) {
                this.pageNum = val;
                this.initTable();
            },
            // 初始化数据
            initTable() {
                this.routerTableLists = [];
                this.pageNum = this.pageNum > 1 ? this.pageNum : 1;

                let beginIndex = (this.pageNum - 1) * this.pageSize;

                let endIndex = beginIndex + this.pageSize;

                if (endIndex > this.routerCount) {
                    endIndex = this.routerCount;
                }

                for (let i = beginIndex; i < endIndex; i++) {
                    if (this.routerLists[i]) {
                        this.routerTableLists.push(this.routerLists[i]);
                    }
                }
            },

            getRouters() {
                let getRouterApi = this.$oakBackendApis.common.routers;
                if (this.selectedProjectId > 0) {
                    getRouterApi = this.$oakBackendApis.project.routers(this.selectedProjectId);
                }
                this.$oakRequest.get(getRouterApi).then(res => {
                    if (res.status === 200) {
                        let routers = res.data.routers;
                        let routerCount = Object.keys(routers).length;
                        if (routerCount > 0) {
                            routers.forEach(ele => {
                                ele.is_del = false;
                            });
                            this.routerLists = routers;
                            this.routerCount = routerCount;
                            this.pageNum = 1;
                            this.initTable();
                        } else {
                            this.routerLists = [];
                            this.routerCount = 0;
                            this.pageNum = 1;
                            this.initTable();
                        }
                    }
                });
            },

            executePushRouter(router, env) {
                let router_id = router.id;
                this.$oakRequest.post(this.$oakBackendApis.router.push(router_id, env)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: `${env} 环境发布成功`
                        });
                        this.getRouters();
                    }
                });
            },

            executePullRouter(router, env) {
                let router_id = router.id;
                this.$oakRequest.delete(this.$oakBackendApis.router.pull(router_id, env)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: `${env} 环境下线成功`
                        });
                        this.getRouters();
                    }
                });
            },

            executeCopyRoutePath(router, env) {
                let requestCode = 'curl';
                requestCode = requestCode.concat(" -X " + router.request_method);
                if (env === 'TEST') {
                    requestCode = requestCode.concat(" -H 'APIOAK-API-ENV: TEST'");
                }
                if (env === 'BETA') {
                    requestCode = requestCode.concat(" -H 'APIOAK-API-ENV: BETA'");
                }
                let requestApi = window.location.origin + router.project_path + router.request_path;
                requestCode = requestCode.concat(" '" + requestApi + "'");
                let oInput = document.createElement("input");
                oInput.value = requestCode;
                document.body.appendChild(oInput);
                oInput.select();
                document.execCommand("Copy");
                this.$message({
                    message: "复制成功",
                    type: "success"
                });
                oInput.remove();
            },

            removeRouter(router) {
                let router_id = router.id;
                this.$oakRequest.delete(this.$oakBackendApis.router.deleted(router_id)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "删除API成功"
                        });
                        this.getRouters();
                    }
                });
            },

            getProjects() {
                this.$oakRequest.get(this.$oakBackendApis.common.projects).then(res => {
                    if (res.status === 200) {
                        let projects = res.data.projects;
                        if (Object.keys(projects).length > 0) {
                            this.projectLists = projects;
                        }
                    }
                });
            },

            openDetailRouter(router) {
                this.optionDetailRouterOpen = true;
                this.optionDetailRouterId = router.id;
            },

            changeDetailRouter(val) {
                this.optionDetailRouterOpen = false;
                this.optionDetailRouterId = 0;
            },

            openPluginRouter(router) {
                this.optionPluginRouterOpen = true;
                this.optionPluginRouterId = router.id;
            },

            changePluginRouter(val) {
                this.optionPluginRouterOpen = false;
                this.optionPluginRouterId = 0;
            },

            openUpdatedRouter(router) {
                this.optionUpdatedRouterOpen = true;
                this.optionUpdatedRouterId = router.id;
            },

            changeUpdatedRouter(val) {
                this.optionUpdatedRouterOpen = false;
                this.optionUpdatedRouterId = 0;
            },

            openCreatedRouter() {
                this.optionCreatedRouterOpen = true;
                this.optionCreatedRouterId = 0;
                this.optionCreatedRouterProjectId = this.selectedProjectId;
            },

            changeCreatedRouter(val) {
                this.optionCreatedRouterOpen = false;
                this.optionCreatedRouterId = 0;
                this.optionCreatedRouterProjectId = 0;
                this.getRouters();
            }
        }
    };
</script>
<style lang="css">
    .el-drawer__body {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 160px;
        color: #99a9bf;
        text-align: right !important;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

    .table-expand .el-form-item__content {
        padding-left: 160px;
    }

    .apilist-table /deep/ .el-dropdown-menu__item {
        padding: 0 0 !important;
    }

    .fe-inline-table .resizeInputClass /deep/ .el-form-item__content {
        margin-left: 0 !important;
    }

    .fe-inline-table .resizeInputClass.el-form-item {
        margin-bottom: 0 !important;
    }
</style>

<style lang="scss" scoped>
    .apilist-container {
        width: 100%;
        height: 100%;

        .apilist-top {
            padding: 20px 32px 1px;
            box-sizing: border-box;
        }

        .apilist-table {
            padding: 0px 32px;
            box-sizing: border-box;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);

            .list-table {
                background-color: #fff;
                padding: 16px 24px;
            }

            .myGroup-pagination {
                background-color: #fff;
                padding: 8px 24px;
            }
        }

        .request-method-GET {
            color: #67C23A;
            font-weight: bold;
            font-size: 10px;
            margin-left: 10px;
            float: left;
            width: 40px;
        }

        .request-method-POST {
            color: #E6A23C;
            font-weight: bold;
            font-size: 10px;
            margin-left: 10px;
            float: left;
            width: 40px;
        }

        .request-method-PUT {
            color: #409EFF;
            font-weight: bold;
            font-size: 10px;
            margin-left: 10px;
            float: left;
            width: 40px;
        }

        .request-method-DELETE {
            color: #F56C6C;
            font-weight: bold;
            font-size: 10px;
            margin-left: 10px;
            float: left;
            width: 40px;
        }

        .empty-content {
            width: 100%;
            height: calc(100vh - 64px);
            position: relative;

            .empty-background {
                width: 500px;
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>
