<template>
    <div class="dash_header">
        <div class="left-box" @click.stop="SetOpenSidebar(!openSidebar)">
            <div class="fold-box">
                <i :class="openSidebar ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
            </div>
        </div>

        <div class="user-box">
            <el-menu class="el-menu-demo" mode="horizontal" @select="selectedMenuAction" background-color="#0f2443"
                     text-color="#ffffff" active-text-color="#ffffff" style="height: 100%">
                <el-submenu index="account">
                    <template slot="title">{{name}}</template>
                    <el-menu-item index="account-logout">退出登录</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        computed: {
            ...mapState({
                openSidebar: state => state.global.openSidebar,
            }),
        },
        created() {
            let name = this.$cookies.get(this.$oakConst.cookies.APIOAK_ADMIN_NAME);
            if (name) {
                this.name = name;
            }
        },
        methods: {
            ...mapActions('global', [
                'SetOpenSidebar'
            ]),
            // 退出
            layoutClick() {
                this.layout = false;
            },
            layoutShow() {
                this.layout = true;
            },
            /**
             * 退出登录
             */
            executeAccountLogout() {
                this.$oakRequest.delete(this.$oakBackendApis.account.logout).then(res => {
                    Object.keys(this.$oakConst.cookies).forEach(cookieKey => {
                        this.$cookies.remove(cookieKey);
                    });
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "退出登录"
                        });
                    }
                    this.$router.push({
                        path: '/account/login'
                    });
                });
            },
            selectedMenuAction(action) {
                if (action === 'account-logout') {
                    this.executeAccountLogout();
                    return true;
                }
            }
        },
        data() {
            return {
                name: "",
                layout: false, // 是否退出
                isCollapse: false,
            };
        }
    };
</script>
<style scoped>
    /* 修改下拉框选中的颜色 */
    .dash_header /deep/ .selected-option .el-select-dropdown__item:hover {
        background: rgba(15, 36, 67, 0.03) !important;
    }

    .dash_header /deep/ .el-select .el-input.is-focus .el-input__inner {
        border-color: #0f2443 !important;
    }

    .dash_header /deep/ .el-input--suffix .el-input__inner {
        color: #fff;
        background-color: #0f2443 !important;
    }

    .dash_header /deep/ .el-input__inner {
        border-color: #0f2443 !important;
        font-size: 18px !important;
    }

    .dash_header /deep/ .el-input__inner:hover {
        border-left-color: #DCDFE6 !important;
        border-right-color: #DCDFE6 !important;
    }
</style>

<style lang="scss" scoped>
    .dash_header {
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: space-between;
        background-color: #0f2443;

        .left-box {
            //width: 300px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .fold-box {
            width: 30px;
            height: 30px;
            margin-right: 30px;

            i {
                width: 30px;
                height: 30px;
                font-size: 26px;
                cursor: pointer;
                color: #fff;
            }
        }

        .group-box {
            width: 200px;
        }

        .user-box {
            //width: 120px;
            height: 100%;
            position: relative;

            .user-name {
                // width: 120px;
                height: 24px;
                margin-top: 20px;
                margin-right: 30px;
                line-height: 24px;
                color: #fff;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
            }

            .layout {
                width: 80px;
                height: 34px;
                line-height: 34px;
                position: absolute;
                top: 60px;
                right: 40px;
                background-color: #fff;
                color: #606266;
                font-size: 14px;
                border-radius: 4px;
                text-align: center;
                border-radius: 4px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
                cursor: pointer;

                &:hover {
                    //background-color: #ecf5ff;
                    // color: #66b1ff;
                    background-color: #66b1ff;
                    color: #fff;

                    &::before {
                        border-bottom: 5px solid #66b1ff;
                    }
                }

                &:before {
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 5px solid #fff;
                    content: "";
                    position: absolute;
                    top: -5px;
                    left: 30px;
                    width: 0px;
                    height: 0px;
                }
            }
        }
    }
</style>
