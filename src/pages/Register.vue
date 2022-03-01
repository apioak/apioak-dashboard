<template>
  <div class="wrapper">
    <notifications></notifications>
    <div class="md-layout login-page">
      <div class="login-card">
        <md-card>
          <div class="logo">
            <div><img src="../assets/img/logo.png" class="login-logo" /></div>
            <h1>欢迎注册APIOAK</h1>
          </div>
          <md-card-content>
            <md-field :class="getValidationClass('name')">
              <md-icon>face</md-icon>
              <label>用户...</label>
              <md-input v-model="form.name" id="name" required></md-input>
              <span class="md-error" v-if="!$v.form.name.required"
              >用户不能为空</span
              >
            </md-field>
            <md-field :class="getValidationClass('email')">
              <md-icon>email</md-icon>
              <label>邮箱...</label>
              <md-input v-model="form.email" id="email" required></md-input>
              <span class="md-error" v-if="!$v.form.email.required"
              >邮箱不能为空</span
              >
              <span class="md-error" v-if="!$v.form.email.email"
              >邮箱格式不正确</span
              >
            </md-field>
            <md-field :class="getValidationClass('password')">
              <md-icon>lock_outline</md-icon>
              <label>密码...</label>
              <md-input
                  v-model="form.password"
                  type="password"
                  id="password"
                  required
              ></md-input>
              <span class="md-error" v-if="!$v.form.password.required"
              >密码不能为空</span
              >
            </md-field>
            <md-field :class="getValidationClass('re_password')">
              <md-icon>lock_outline</md-icon>
              <label>确认密码...</label>
              <md-input
                  v-model="form.re_password"
                  type="password"
                  id="re_password"
                  required
              ></md-input>
              <span class="md-error" v-if="!$v.form.re_password.required"
              >确认密码不能为空</span
              >
              <span class="md-error" v-if="!$v.form.re_password.sameAsPassword"
              >密码不一致</span
              >
            </md-field>
            <div class="login-button">
              <md-button class="md-raised md-primary" @click="register"
              >注册</md-button
              >
            </div>
            <div class="to-login">
              <router-link :to="{ name: 'Login' }"
              >已有账号，去登录 ></router-link
              >
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import ApiUser from "../api/ApiUser";
import { required, email, sameAs } from "vuelidate/lib/validators";

export default {
  name: "Register",
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        re_password: "",
      },
    };
  },
  validations: {
    form: {
      name: { required },
      email: { required, email },
      password: { required },
      re_password: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  mounted() {},
  methods: {
    getValidationClass: function (fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    register: function () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      ApiUser.register(this.form).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: "注册成功，请登录", type: "success" });
          this.$router.push({ name: "Login" });
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.md-layout {
  justify-content: center;
}

.login-page {
  height: 100%;
  background: #E8EFFF;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
}

.logo {
  text-align: center;
  margin-top: 20px;
  .login-logo {
    width: 60px;
    height: 60px;
  }
  h1 {
    font-size: 20px;
    margin: 10px 0 0;
  }
}

.md-card {
  margin-top: 50px;
}
.md-card-header {
  overflow: hidden;

  h4 {
    line-height: 80px;
    font-size: 30px;
  }
}
.login-button {
  width: 100%;
  text-align: center;
}
.md-card-header > img {
  border-radius: 0 !important;
}
.to-login {
  width: 100%;
  text-align: right;
  margin-right: 15px;
}
.login-card {
  margin-top: -100px;
  width: 1000px;
  background: url("../assets/img/login.jpg") no-repeat;
  background-size: 400px 450px;
  background-position: left center;
  display: flex;
  align-items: center;
  .md-card{
    margin-top: 50px;
    width: 350px !important;
    height: 470px;
    margin-left: 520px;
    box-shadow: 2px 3px 10px rgba(0,0,0,0.2);
    .md-field {
      margin: 4px 0 !important;
    }
  }
}
</style>
54