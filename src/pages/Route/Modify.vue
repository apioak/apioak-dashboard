<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field v-if="routeId">
          <label>路由名称</label>
          <md-input v-model="form.route_name" required />
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field :class="getValidationClass('route_path')">
          <label>路由路径</label>
          <md-input v-model="form.route_path" required />
          <span class="md-error" v-if="!$v.form.route_path.required"
            >路由路径不能为空</span
          >
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item request_methods">
        <md-field :class="getValidationClass('request_methods')">
          <label>请求方法</label>
          <md-select
            v-model="form.request_methods"
            name="request_methods"
            id="request_methods"
            md-dense
            multiple
            required
          >
            <md-option value="ALL">ALL</md-option>
            <md-option value="GET">GET</md-option>
            <md-option value="POST">POST</md-option>
            <md-option value="PUT">PUT</md-option>
            <md-option value="DELETE">DELETE</md-option>
          </md-select>
          <span class="md-error" v-if="!$v.form.request_methods.required"
            >请求方法不能为空</span
          >
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="form-item">
        <label class="form-label">启用：</label>
        <md-switch v-model="form.is_enable" class="md-primary" />
      </div>
    </div>
    <div class="service-button">
      <md-button class="md-raised" @click="$emit('closeDrawer')"
        >取消</md-button
      >
      <md-button class="md-raised md-success" @click="submitForm"
        >保存</md-button
      >
    </div>
  </div>
</template>

<script>
import ApiRoute from "../../api/ApiRoute";
import { required } from "vuelidate/lib/validators";

export default {
  name: "RouteModify",
  props: {
    serviceId: {
      type: String,
      default: "",
    },
    routeId: {
      type: String,
      default: "",
    },
    isCopy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        service_id: "",
        route_name: "",
        request_methods: [],
        route_path: "",
        is_enable: 1,
      },
    };
  },
  mounted() {
    this.getInfo();
  },
  validations: {
    form: {
      route_path: { required },
      request_methods: { required },
    },
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
      if (this.routeId.length === 0) {
        return;
      }
      ApiRoute.info(this.serviceId, this.routeId).then((res) => {
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
      let routeHttp;
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.is_enable = formData.is_enable === true ? 1 : 2;
      formData.service_id = this.serviceId;
      formData.request_methods = formData.request_methods.join(",");
      if (this.isCopy) { //复制
        routeHttp = ApiRoute.copy(this.routeId, formData);
      } else if (this.routeId) { //修改
        routeHttp = ApiRoute.put(this.routeId, formData);
      } else { //添加
        routeHttp = ApiRoute.post(this.serviceId, formData);
      }
      routeHttp.then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "success" });
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
.service-button {
  width: 100%;
  text-align: right;
  button {
    margin-right: 15px;
  }
}
</style>
