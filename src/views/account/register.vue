<template>
    <div class="register-container">
        <div class="login-content">
            <el-form :model="registerForms" :rules="registerRules" ref="registerForms" label-position="left"
                     label-width="0px"
                     class="sign-form">
                <el-form-item prop="name">
                    <el-input type="text" v-model="registerForms.name" placeholder="昵称"
                              @keyup.enter.native="executeAccountRegister('registerForms')"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input type="text" v-model="registerForms.email" placeholder="邮箱"
                              @keyup.enter.native="executeAccountRegister('registerForms')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="registerForms.password"
                              placeholder="请输入6-16位密码，区分大小写" show-password
                              @keyup.enter.native="executeAccountRegister('registerForms')"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" v-model="registerForms.valid_password"
                              placeholder="确认密码" show-password
                              @keyup.enter.native="executeAccountRegister('registerForms')"></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;"
                               @click="executeAccountRegister('registerForms')" :loading="executeRegisterLoading">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="toggle-box">
            <div class="toggle-btn login" @click="redirectLoginPage">登录帐户</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                registerForms: {
                    name: '',
                    email: '',
                    password: '',
                    valid_password: '',
                },
                registerRules: {
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
                                if (this.registerForms.password !== value) {
                                    return callback(new Error('密码输入不一致'));
                                }
                                return callback();
                            },
                        }
                    ],
                },

                executeRegisterLoading: false,
            };
        },
        methods: {
            redirectLoginPage() {
                this.$router.push({
                    path: '/account/login',
                });
            },
            executeAccountRegister(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.executeRegisterLoading = true;
                    this.$oakRequest.post(this.$oakBackendApis.account.register, this.registerForms).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: 'success',
                                message: '注册成功'
                            });
                            this.$router.push({
                                path: '/account/login',
                            });
                            return true;
                        }
                    }).catch(err => {
                        this.$message({
                            type: 'error',
                            message: '注册失败'
                        });
                    });
                    this.executeRegisterLoading = false;
                    return false;
                });
            },
        }
    };
</script>

<style lang="scss" scoped>
    .register-container {
        width: 100%;

        .toggle-box {
            line-height: 20px;
            font-size: 14px;

            .toggle-btn {
                color: #4c91ff;
                float: right;
                cursor: pointer;
                text-align: right;
            }

            .sign {
                width: 60px;
            }

            .login {
                width: 120px;
            }
        }

    }
</style>
