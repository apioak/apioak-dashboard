<template>
  <div class="register">
    <div class="content">
      <div class="registerImg"></div>
      <div class="registerForm">
        <div class="logo">
          <img src="../../assets/img/apioak-logo.png" />
          <span>欢迎注册APIOAK</span>
        </div>
        <a-form
          class="form"
          :model="form"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 14 }"
          autocomplete="off"
          @finish="onFinish"
        >
          <a-form-item
            label="昵称"
            name="name"
            :rules="[
              { required: true, message: '请输入昵称!' },
              { pattern: /^[A-Za-z\d_]+$/, message: '昵称仅包含字母数字下划线字符!' },
              { max: 15, message: '昵称最长15个字符' }
            ]"
          >
            <a-input v-model:value="form.name" />
          </a-form-item>

          <a-form-item
            label="邮箱"
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱!' },
              {
                pattern: /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/,
                message: '邮箱格式错误！!'
              }
            ]"
          >
            <a-input v-model:value="form.email" />
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            :rules="[
              { required: true, message: '请输入密码!' },
              { min: 8, message: '密码最小8个字符' },
              { max: 16, message: '密码最长16个字符' }
            ]"
          >
            <a-input-password v-model:value="form.password" />
          </a-form-item>

          <a-form-item
            label="确认密码"
            :rules="[
              { required: true, message: '请输入确认密码!' },
              {
                validator: confirmPassValidator
              }
            ]"
            name="re_password"
          >
            <a-input-password v-model:value="form.re_password" />
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 5, span: 15 }">
            <a-button type="primary" html-type="submit">注册</a-button>
          </a-form-item>
        </a-form>

        <a-anchor-link style="margin-left: 130px" href="#login" title="已有账号，去登录>" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { $register } from '@/api'
import router from '@/router'

export default {
  setup() {
    // 表单数据
    const form = reactive({
      name: null,
      email: null,
      password: null,
      re_password: null
    })

    // 注册事件
    const onFinish = async () => {
      const { code, msg } = await $register(form)
      if (code == 0) {
        message.success('注册成功，请登录')
        router.replace('/login')
      } else {
        message.error(msg)
      }
    }

    // 校验确认密码
    const confirmPassValidator = async (_, value) => {
      if (value.length !== 0 && value !== form.password) {
        return Promise.reject('两次密码输入不匹配！')
      } else {
        return Promise.resolve().callback
      }
    }

    return { form, onFinish, confirmPassValidator }
  }
}
</script>

<style lange="scss" scoped>
.register {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: #e8efff;
  justify-content: center;
  align-items: center;
  display: flex;
}

.register .content {
  height: 430px;
  width: 900px;
  justify-content: center;
  align-items: center;
}

.register .content .registerImg {
  height: 420px;
  width: 400px;
  display: inline-flex;
  background: url('../../assets/img/index.jpg') no-repeat;
  background-size: 400px 450px;
  background-position: left center;
}

.register .content .registerForm {
  height: 470px;
  width: 350px;
  float: right;
  display: block;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.register .content .registerForm .logo {
  display: block;
  margin-top: 20px;
  width: 330px;
  height: 100px;
  margin-bottom: 20px;
  font-size: 20px;
}

.register .content .registerForm .logo img {
  display: block;
  width: 55px;
  margin-left: 145px;
  margin-bottom: 10px;
}
</style>
