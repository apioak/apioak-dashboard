<template>
    <div class="login-container">
        <div class="login-content">
            <el-form :model="loginForms" :rules="loginRules" ref="loginForms" label-position="left"
                     label-width="0px"
                     class="register-form">
                <el-form-item prop="email">
                    <el-input type="text" v-model="loginForms.email" placeholder="邮箱"
                              @keyup.enter.native="executeAccountLogin('loginForms')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForms.password" placeholder="密码"
                              @keyup.enter.native="executeAccountLogin('loginForms')" show-password></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" :loading="executeLoginLoading"
                               @click="executeAccountLogin('loginForms')">登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="toggle-box">
            <div class="toggle-btn sign" @click="redirectRegisterPage">注册账户</div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                executeLoginLoading: false,

                loginForms: {
                    email: '',
                    password: '',
                },

                loginRules: {
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
                            trigger: 'change',
                            min: 6,
                            max: 16,
                            message: '密码长度限制（6 - 16）',
                        }
                    ],
                },
            };
        },
        methods: {
            redirectRegisterPage: function () {
                this.$router.push({
                    path: '/account/register',
                });
            },
            executeAccountLogin(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.executeLoginLoading = true;
                    this.$oakRequest.put(this.$oakBackendApis.account.login, this.loginForms).then(res => {
                        if (res.status === 200) {
                            let user = res.data.user;
                            if (Object.keys(user).length > 0) {
                                this.$message({
                                    type: "success",
                                    message: '登录成功'
                                });
                                this.$cookies.set(this.$oakConst.cookies.APIOAK_ADMIN_TOKEN, user.token);
                                this.$cookies.set(this.$oakConst.cookies.APIOAK_ADMIN_ID, user.id);
                                this.$cookies.set(this.$oakConst.cookies.APIOAK_ADMIN_NAME, user.name);
                                this.$cookies.set(this.$oakConst.cookies.APIOAK_ADMIN_OWNER, user.is_owner);
                                this.$router.push({
                                    path: '/projects',
                                });
                                return true;
                            }
                        }
                    }).catch(err => {
                        this.$message({
                            type: "error",
                            message: "登录失败"
                        })
                    });
                    this.executeLoginLoading = false;
                    return false;
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    .login-container {
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
