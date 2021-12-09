<template>
  <div class="wrapper">
    <notifications></notifications>
    <div class="md-layout login-page">
      <div
        class="
          md-layout-item
          md-size-30
          md-medium-size-33
          md-small-size-70
          md-xsmall-size-100
        "
      >
        <md-card>
          <md-card-header data-background-color="green">
            <img src="../assets/img/logo.png" class="login-logo" />
            <h4 class="title">登录</h4>
          </md-card-header>
          <md-card-content>
            <md-field :class="getValidationClass('email')">
              <md-icon>email</md-icon>
              <label>邮箱...</label>
              <md-input v-model.trim="email" required></md-input>
              <span class="md-error" v-if="!$v.email.required"
                >邮箱不能为空</span
              >
              <span class="md-error" v-if="!$v.email.email"
                >邮箱格式不正确</span
              >
            </md-field>
            <md-field :class="getValidationClass('password')">
              <md-icon>lock_outline</md-icon>
              <label>密码...</label>
              <md-input
                v-model.trim="password"
                type="password"
                required
              ></md-input>
              <span class="md-error" v-if="!$v.password.required"
                >密码不能为空</span
              >
            </md-field>
            <div class="login-button">
              <md-button class="md-raised md-success" @click="login"
                >登录</md-button
              >
            </div>
            <div class="to-login">
              <router-link :to="{ name: 'Register' }">去注册...</router-link>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import ApiUser from "../api/ApiUser";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  validations: {
    email: { required, email },
    password: { required },
  },
  mounted() {},
  methods: {
    getValidationClass: function (fieldName) {
      const field = this.$v[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    login: function () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      ApiUser.login(this.email, this.password).then((res) => {
        if (res.code === 0) {
          this.$store.commit("setToken", res.data["token"]);
          this.$router.push({ name: "Services" });
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
  background: url("../assets/img/login.jpg") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
}

.login-logo {
  width: 80px;
  height: 80px;
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
</style>
