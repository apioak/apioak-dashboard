<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="service-drawer" :userId="userId">
        <p class="service-drawer_tit">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelSaveUser"></i>
        </p>
        <el-form class="service-form" :rules="userRules" ref="userForms" :model="userForms" label-width="80px"
                 lable-position="left">

            <el-form-item label="用户名" prop="name">
                <el-input placeholder="输入用户名" v-model="userForms.name"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input placeholder="输入邮箱" v-model="userForms.email"></el-input>
            </el-form-item>

            <el-form-item label="启用" prop="is_enable">
                <el-switch v-model="userForms.is_enable" active-color="#13ce66" :active-value=1 :inactive-value=0>
                </el-switch>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input placeholder="输入密码，长度限制（6 - 16）" type="password" v-model="userForms.password"
                          show-password></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="valid_password">
                <el-input placeholder="再次确认密码" type="password" v-model="userForms.valid_password"
                          show-password></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="executeSaveUser('userForms')">保存</el-button>
                <el-button @click="cancelSaveUser">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script>
    export default {
        props: {
            userId: {
                type: Number,
                default: 0,
            },
            size: {
                type: String,
                default: "50%"
            },
            direction: {
                type: String,
                default: "rtl"
            },
            open: {
                type: Boolean,
                default: false,
            },
            withHeader: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(value) {
                    if (this.userOperateAction === 'CREATED') {
                        this.$emit('changeCreatedUser', value);
                    }
                    if (this.userOperateAction === 'UPDATED') {
                        this.$emit('changeUpdatedUser', value);
                    }
                    this.userForms = {};
                    this.$refs['userForms'].resetFields();
                },
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.userId > 0) {
                        this.title = '编辑用户';
                        this.userOperateAction = 'UPDATED';
                    } else {
                        this.title = '新增用户';
                        this.userOperateAction = 'CREATED';
                        this.getUser();
                    }
                }
            }
        },
        methods: {
            getUser() {
                //TODO: this version not backend apis
            },
            executeSaveUser(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }

                    if (this.userOperateAction === 'UPDATED') {
                        //TODO: this version not backend apis
                    }

                    if (this.userOperateAction === 'CREATED') {
                        this.$oakRequest.post(this.$oakBackendApis.user.created, this.userForms).then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "新增用户成功"
                                });
                                this.cancelSaveUser();
                                return true;
                            }
                        });
                    }
                    return false;
                });
            },
            cancelSaveUser() {
                this.open_ = false;
            },
        },
        data() {
            return {
                title: '',
                userOperateAction: '',

                userForms: {
                    id: 0,
                    name: '',
                    email: '',
                    is_enable: 1,
                    password: '',
                    valid_password: ''
                },

                userRules: {
                    id: [
                        {
                            type: 'number',
                            min: 0,
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: "昵称长度限制（4 - 16）",
                            min: 4,
                            max: 16,
                            type: 'string',
                            trigger: 'change',
                        }
                    ],
                    email: [
                        {
                            required: true,
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value.length === 0) {
                                    return callback(new Error('输入登录邮箱'));
                                }
                                let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                                if (!reg.test(value)) {
                                    return callback(new Error('邮箱格式不合法'));
                                }
                                return callback();
                            },
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "密码长度限制（6 - 16）",
                            min: 6,
                            max: 16,
                            type: 'string',
                            trigger: 'change',
                        }
                    ],
                    valid_password: [
                        {
                            required: true,
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value.length === 0) {
                                    return callback(new Error('输入确认密码'));
                                }
                                if (this.userForms.password !== value) {
                                    return callback(new Error('密码输入不一致'));
                                }
                                return callback();
                            },
                        }
                    ],
                },
            }
        },
    }
</script>

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
