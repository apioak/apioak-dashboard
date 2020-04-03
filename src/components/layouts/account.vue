<template>
    <div class="account-container">
        <div class="login-main">
            <div class="login-title">
                <img src="../../assets/logo.png" class="login-logo"/>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: "account",
    };
</script>

<style lang="scss" scoped>
    .account-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('../../assets/account-background.png'),
        linear-gradient(
                        360deg,
                        rgba(255, 255, 255, 1) 30%,
                        rgba(249, 251, 255, 1) 100%
        );
        background-repeat: no-repeat;

        .login-main {
            width: 400px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.04);
            border-radius: 16px;
            padding: 32px 24px;
            box-sizing: border-box;

            .login-title {
                font-size: 28px;
                text-align: center;
                line-height: 40px;
                margin-bottom: 20px;
            }

            .login-logo {
                width: 80px;
            }
        }
    }
</style>
