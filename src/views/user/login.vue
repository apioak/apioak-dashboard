<template>
  <div class="login">
    <div class="content">
      <div class="loginImg"></div>
      <div class="loginForm">
        <div class="logo">
          <img src="../../assets/img/apioak-logo.png" />
          <span>欢迎使用APIOAK</span>
        </div>
        <a-form
          class="form"
          :model="form"
          name="basic"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 14 }"
          autocomplete="off"
          @finish="loginFn"
        >
          <a-form-item label="邮箱" name="email" :rules="schemaUser.email">
            <a-input v-model:value="form.email" />
          </a-form-item>

          <a-form-item label="密码" name="password" :rules="schemaUser.password">
            <a-input-password v-model:value="form.password" />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 5, span: 15 }">
            <a-button type="primary" html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>

        <a-anchor-link style="margin-left: 130px" href="#register" title="暂无账号，去注册>" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import router from '@/router'
import { message } from 'ant-design-vue'
import { $login } from '@/api'
import store from '@/store'
import { schemaUser } from '@/schema'

export default {
  setup() {
    // 定义表单数据
    const form = reactive({
      email: null,
      password: null
    })

    // 登录事件
    const loginFn = async () => {
      const { code, msg, data } = await $login(form)
      if (code == -1) {
        message.error(msg)
      } else {
        if (data.token.length != 0) {
          store.commit('user/setToken', { token: data.token, email: form.email })
          router.replace('/')
          return
        }
        message.error('登录失败，请联系管理员')
      }
    }

    return {
      form,
      loginFn,
      schemaUser
    }
  }
}
</script>

<style lange="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #e8efff;
  justify-content: center;
  align-items: center;
}

.login .content {
  height: 430px;
  width: 900px;
  justify-content: center;
  align-items: center;
}

.login .content .loginImg {
  height: 420px;
  width: 400px;
  display: inline-flex;
  background: url('../../assets/img/index.jpg') no-repeat;
  background-size: 400px 450px;
  background-position: left center;
}

.login .content .loginForm {
  height: 350px;
  width: 350px;
  float: right;
  display: block;
  margin-top: 60px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.login .content .loginForm .logo {
  display: block;
  margin-top: 20px;
  width: 330px;
  height: 100px;
  margin-bottom: 20px;
  font-size: 20px;
}

.login .content .loginForm .logo img {
  display: block;
  width: 55px;
  margin-left: 145px;
  margin-bottom: 10px;
}
</style>
