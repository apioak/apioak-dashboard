<template>
  <div>
    <form>
      <div>
        <md-field>
          <label>服务名称</label>
          <md-input v-model="form.name" />
        </md-field>
      </div>

      <div v-if="Object.keys(form.service_domains).length > 0">
        <div
          class="md-layout md-gutter"
          v-for="(item, index) in $v.form.service_domains.$each.$iter"
          :key="index"
        >
          <div class="md-layout-item">
            <md-field :class="getValidationClass('service_domains')">
              <label>域名</label>
              <md-input v-model.trim="form.service_domains[index]" required />
              <i class="iconfont icon-tianjia" @click="addDomain" />
              <i
                class="iconfont icon-jian"
                @click="removeDomain(index)"
                v-if="index != 0"
              />
              <span class="md-error" v-if="!item.required">域名不能为空</span>
            </md-field>
          </div>
        </div>
      </div>

      <div class="service-advanced">
        <div class="form-item">
          <label class="form-label">请求协议：</label>
          <md-radio v-model="form.protocol" value="1">HTTP</md-radio>
          <md-radio v-model="form.protocol" value="2">HTTPS</md-radio>
          <md-radio v-model="form.protocol" value="3">HTTP&HTTPS</md-radio>
        </div>

        <div class="form-item">
          <label class="form-label">启用：</label>
          <md-switch v-model="form.enable" class="md-primary"></md-switch>
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
    </form>
  </div>
</template>

<script>
import ApiService from "../../api/ApiService";
import {
  required,
} from "vuelidate/lib/validators";
export default {
  name: "ServiceModify",
  props: {
    serviceResId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        name: "",
        service_domains: [],
        protocol: "1",
        enable: 2,
      },
    };
  },
  validations: {
    form: {
      service_domains: {
        $each: { required },
      },
      protocol: {
        required,
      },
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getValidationClass: function (fieldName, parent = "") {
      const field = parent
        ? this.$v.form[parent][fieldName]
        : this.$v.form[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    getInfo: function () {
      this.form.service_domains = [""];
      if (this.serviceResId.length === 0) {
        return;
      }

      ApiService.info(this.serviceResId).then((res) => {
        if (res.code === 0) {
          let serviceDetail = res.data;
          for (let key of Object.keys(this.form)) {
            this.form[key] = serviceDetail[key];
          }
          this.form.protocol = this.form.protocol.toString();
          this.form.enable = this.form.enable == 1;
          //设置默认信息
          if (this.form.service_domains.length === 0) {
            this.form.service_domains = [""];
          }

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
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.protocol = parseInt(formData.protocol);
      formData.enable = formData.enable === true ? 1 : 2;
      let serviceHttp;
      if (this.serviceResId) {
        serviceHttp = ApiService.put(this.serviceResId, formData);
      } else {
        serviceHttp = ApiService.post(formData);
      }
      serviceHttp.then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "primary" });
          return this.$emit("saveHandle");
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
    addDomain: function () {
      this.form.service_domains.push("");
    },
    removeDomain: function (index) {
      this.$delete(this.form.service_domains, index);
    },
  },
};
</script>

<style lang="scss" scoped>
.service-node {
  position: relative;
  top: 0;
  left: 0;
  line-height: 80px;
}
.service-advanced {
  margin-bottom: 40px;
  .service-advanced-click {
    width: 100%;
    text-align: center;
    cursor: pointer;
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
  button {
    margin-right: 15px;
  }
}
.icon-tianjia {
  z-index: 99;
  color: #1e88e5;
  cursor: pointer !important;
}
.icon-jian {
  z-index: 99;
  color: red;
  cursor: pointer !important;
}
</style>
