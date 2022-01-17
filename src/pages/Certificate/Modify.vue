<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field :class="getValidationClass('certificate')">
          <label>证书内容</label>
          <md-input v-model="form.certificate" required></md-input>
          <span class="md-error" v-if="!$v.form.certificate.required"
            >证书不能为空</span
          >
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field :class="getValidationClass('private_key')">
          <label>私钥内容</label>
          <md-input v-model="form.private_key" required></md-input>
          <span class="md-error" v-if="!$v.form.private_key.required"
            >私钥内容不能为空</span
          >
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="form-item">
        <label class="form-label">启用：</label>
        <md-switch v-model="form.is_enable" class="md-primary"></md-switch>
      </div>
    </div>
    <div class="service-button">
      <md-button class="md-raised" @click="$emit('closeDrawer')"
        >取消</md-button
      >
      <md-button class="md-raised md-primary" @click="submitForm"
        >保存</md-button
      >
    </div>
  </div>
</template>

<script>
import ApiCertificate from "../../api/ApiCertificate";
import { required } from "vuelidate/lib/validators";

export default {
  name: "CertificateModify",
  props: {
    certificateId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        certificate: null,
        private_key: null,
        is_enable: 1,
      },
    };
  },
  validations: {
    form: {
      certificate: { required },
      private_key: { required },
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getValidationClass: function (fieldName) {
      const field = this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    getInfo: function () {
      if (this.certificateId.length === 0) {
        return;
      }
      ApiCertificate.info(this.certificateId).then((res) => {
        if (res.code === 0) {
          for (let key of Object.keys(this.form)) {
            this.form[key] = res.data[key];
          }
          this.form.is_enable = this.form.is_enable === 1;
        } else {
          this.$notify({ message: res.msg });
          return this.$emit("saveHandle");
        }
      });
    },
    submitForm: function () {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }
      let certificateHttp;
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.is_enable = formData.is_enable === true ? 1 : 2;
      if (this.certificateId) {
        certificateHttp = ApiCertificate.put(this.certificateId, formData);
      } else {
        certificateHttp = ApiCertificate.post(formData);
      }
      certificateHttp.then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "blue" });
          return this.$emit("saveHandle");
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.service-node {
  line-height: 80px;
}
.service-advanced {
  margin-bottom: 40px;
  .service-advanced-click {
    width: 100%;
    text-align: center;
  }
  .form-item {
    overflow: hidden;
    :before {
      clear: both;
      content: "";
    }
    .form-label {
      float: left;
      line-height: 55px;
    }
  }

  .md-layout {
    margin-left: 12px;
  }
}
.service-button {
  width: 100%;
  text-align: right;
  /*    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 99;*/
  button {
    margin-right: 15px;
  }
}
.form-item {
  color: #aaaaaa;
  margin-left: 10px;
  overflow: hidden;
  :before {
    clear: both;
    content: "";
  }
  .form-label {
    float: left;
    line-height: 55px;
  }
}
</style>
