<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="service-drawer" :userId="userId">
        <p class="service-drawer_tit">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelSavePassword"></i>
        </p>
        <el-form class="service-form" :rules="passwordRules" ref="passwordForms" :model="passwordForms"
                 label-width="80px"
                 lable-position="left">

            <el-form-item label="新密码" prop="password">
                <el-input placeholder="输入密码，长度限制（6 - 16）" type="password" v-model="passwordForms.password"
                          show-password></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="valid_password">
                <el-input placeholder="再次确认密码" type="password" v-model="passwordForms.valid_password"
                          show-password></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="executeUpdatedPassword('passwordForms')">保存</el-button>
                <el-button @click="cancelSavePassword">取消</el-button>
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
                    this.$emit('changePasswordUser', value);
                    this.passwordForms = {};
                    this.$refs['passwordForms'].resetFields();
                },
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.userId > 0) {
                        this.title = '修改密码';
                    } else {
                        this.cancelSavePassword();
                    }
                }
            }
        },
        methods: {
            cancelSavePassword() {
                this.open_ = false;
            },
            executeUpdatedPassword(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.$oakRequest.put(this.$oakBackendApis.user.password(this.userId), this.passwordForms).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: "success",
                                message: "密码修改成功"
                            });
                            this.cancelSavePassword();
                            return true;
                        }
                    });
                    return false;
                });
            },
        },
        data() {
            return {
                title: '',

                passwordForms: {
                    password: '',
                    valid_password: '',
                },

                passwordRules: {
                    id: [
                        {
                            type: 'number',
                            min: 0,
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
                                if (this.passwordForms.password !== value) {
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
