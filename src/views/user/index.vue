<template>
    <div class="service">
        <div class="service-list">
            <div class="service-title">
                <el-button class="service-add fl" type="primary" @click="openCreatedUser" style="margin-right:10px;">
                    新建用户
                </el-button>
                <el-form :inline="true" :model="userQueryData" class="user-form-inline">
                    <el-form-item label="">
                        <el-input v-model="userQueryData.email" placeholder="输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="executeQueryUserByEmail">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="app-content" v-if="userCount > 0">
                <el-table class="service-table" :data="userTableLists">
                    <el-table-column label="用户ID" prop="id" width="100px"></el-table-column>
                    <el-table-column label="用户名" prop="name"></el-table-column>
                    <el-table-column label="邮箱" prop="email"></el-table-column>
                    <el-table-column label="启用">
                        <template slot-scope="user">
                            <el-switch active-color="#13ce66" v-model="user.row.is_enable"
                                       @change='executeUpdatedUserStatus(user.row)' :active-value="1"
                                       :inactive-value="0"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="user">

                            <el-button type="primary" size="small" style="margin-right:12px;"
                                       @click="openPasswordUser(user.row)">修改密码
                            </el-button>

                            <el-popconfirm
                                    confirmButtonText='确定'
                                    cancelButtonText='取消'
                                    icon="el-icon-info"
                                    iconColor="red"
                                    @onConfirm="executeRemoveUser(user.row)"
                                    title="确定删除该项目吗？" style="margin-right:10px;">
                                <el-button slot="reference" type="danger" size="small">删除
                                </el-button>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>

                <div class="main-pagination-box">
                    <el-pagination @size-change="changePageSize" @current-change="changePageNumber"
                                   :current-page="pageNum" :page-sizes="pageSizes" :page-size="pageSize"
                                   layout="total, sizes, prev, pager, next, jumper" :total="userCount"></el-pagination>
                </div>
            </div>

            <div class="empty-content" v-else>
                <img src="@/assets/empty-background.png" class="empty-background">
            </div>

            <user-created @changeCreatedUser="changeCreatedUser" :userId="optionCreatedUserId"
                          :open="optionCreatedUserOpen"></user-created>

            <user-password @changePasswordUser="changePasswordUser" :userId="optionPasswordUserId"
                           :open="optionPasswordUserOpen"></user-password>
        </div>
    </div>
</template>
<script>

    import UserCreated from './updated';
    import UserPassword from './password';

    export default {
        components: {
            UserCreated,
            UserPassword,
        },
        data() {

            return {
                // User Created
                optionCreatedUserOpen: false,
                optionCreatedUserId: 0,

                //TODO: this version not backend apis
                // User Updated
                optionUpdatedUserOpen: false,
                optionUpdatedUserId: 0,

                // User Password
                optionPasswordUserOpen: false,
                optionPasswordUserId: 0,

                userLists: [],
                userCount: 0,
                userTableLists: [],

                userQueryData: {
                    email: '',
                },

                pageNum: 1,

                pageSize: 10,

                pageSizes: [10, 15, 20]
            };
        },
        created() {
            this.getUsers();
        },
        methods: {
            openCreatedUser() {
                this.optionCreatedUserOpen = true;
                this.optionCreatedUserId = 0;
            },
            changeCreatedUser(value) {
                this.optionCreatedUserOpen = false;
                this.optionCreatedUserId = 0;
                this.getUsers();
            },

            //TODO: this version not backend apis
            openUpdatedUser(user) {
                this.optionUpdatedUserOpen = true;
                this.optionUpdatedUserId = user.id;
            },
            //TODO: this version not backend apis
            changeUpdatedUser(value) {
                this.optionUpdatedUserOpen = false;
                this.optionUpdatedUserId = 0;
            },

            openPasswordUser(user) {
                this.optionPasswordUserOpen = true;
                this.optionPasswordUserId = user.id;
            },

            changePasswordUser(value) {
                this.optionPasswordUserOpen = false;
                this.optionPasswordUserId = 0;
            },

            changePageSize(val) {
                this.pageSize = val;
                this.initTable();
            },

            changePageNumber(val) {
                this.pageNum = val;
                this.initTable();
            },

            initTable() {
                this.userTableLists = [];
                this.pageNum = this.pageNum > 1 ? this.pageNum : 1;

                let beginIndex = (this.pageNum - 1) * this.pageSize;

                let endIndex = beginIndex + this.pageSize;

                if (endIndex > this.userCount) {
                    endIndex = this.userCount;
                }

                for (let i = beginIndex; i < endIndex; i++) {
                    if (this.userLists[i]) {
                        this.userTableLists.push(this.userLists[i]);
                    }
                }
            },

            executeUpdatedUserStatus(user) {
                let user_id = user.id || 0;
                if (user.is_enable === 0) {
                    this.$oakRequest.put(this.$oakBackendApis.user.disable(user_id)).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: "success",
                                message: "账户已禁用"
                            });
                        }
                    });
                }
                if (user.is_enable === 1) {
                    this.$oakRequest.put(this.$oakBackendApis.user.enable(user_id)).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: "success",
                                message: "账户已启用"
                            });
                        }
                    });
                }
            },

            getUsers() {
                this.$oakRequest.get(this.$oakBackendApis.common.users).then(res => {
                    if (res.status === 200) {
                        let users = res.data.users;
                        let userCount = Object.keys(users).length;
                        if (userCount > 0) {
                            this.userLists = users;
                            this.userCount = userCount;
                        } else {
                            this.userLists = [];
                            this.userCount = 0;
                        }
                        this.pageNum = 1;
                        this.initTable();
                        return true;
                    }
                });
            },

            executeQueryUserByEmail() {
                let email = this.userQueryData.email;
                if (email) {
                    this.userLists = this.userLists.filter(ele => {
                        return ele.email === email.trim();
                    });
                    this.initTable();
                } else {
                    this.getUsers();
                }
            },

            executeRemoveUser(user) {
                this.$oakRequest.delete(this.$oakBackendApis.user.deleted(user.id)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                    }
                    this.getUsers();
                });
            },
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
</style>
<style lang="scss" scoped>
    .service {
        &-add {
            margin-bottom: 16px;
        }

        &-list {
            margin: 20px 32px;

            .service-title {
                width: 100%;
                height: 40px;
            }
        }

        &-table {
            padding: 16px 24px;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
        }

        &-drawer {
            &_tit {
                padding: 24px;
                font-size: 20px;
                font-weight: 700;

                i {
                    cursor: pointer;
                }
            }

            .node-item {
                width: 100px;
                margin-right: 12px;
            }
        }

        &-form {
            padding: 0 24px;
        }

        &-upstreams {
            padding-left: 32px;
            color: #606266;
            font-size: 14px;
        }

        .plugin-card {
            text-align: center;

            h3 {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 12px;
            }

            p {
                text-align: left;
                color: #666;
                margin-bottom: 12px;
            }
        }

        .main-pagination-box {
            width: 100%;
            height: 30px;
            padding: 10px 0;
            background-color: #fff;
        }
    }
</style>
