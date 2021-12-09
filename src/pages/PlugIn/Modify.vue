<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>插件名称</label>
          <md-input v-model="form.name" required></md-input>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>插件描述</label>
          <md-input v-model="form.description" required></md-input>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>插件类型</label>
          <md-select
            v-model="form.type"
            name="request_methods"
            id="request_methods"
          >
            <md-option
              v-for="(item, index) in plugInTypeList"
              :key="index"
              :value="index"
              >{{ item }}</md-option
            >
          </md-select>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>插件标识</label>
          <md-input v-model="form.tag" required></md-input>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>插件ICON</label>
          <md-input v-model="form.icon" required></md-input>
        </md-field>
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
import ApiPlugIn from "../../api/ApiPlugIn";

export default {
  name: "PlugInModify",
  props: {
    plugInId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      plugInTypeList: {},
      form: {
        name: "",
        description: "",
        tag: "",
        icon: "",
        type: 0,
      },
    };
  },
  mounted() {
    this.getInfo();
    this.getPlugInType();
  },
  methods: {
    getInfo: function () {
      if (this.plugInId.length === 0) {
        return;
      }
      ApiPlugIn.info(this.plugInId).then((res) => {
        if (res.code === 0) {
          for (let key of Object.keys(this.form)) {
            this.form[key] = res.data[key];
          }
        } else {
          this.$notify({ message: res.msg });
          return this.$emit("saveHandle");
        }
      });
    },
    getPlugInType: function () {
      return ApiPlugIn.typeList().then((res) => {
        let typeEnum = {};
        if (res.code === 0) {
          res.data.forEach(function (item, index) {
            typeEnum[item.id] = item.name;
          });
        }
        this.plugInTypeList = typeEnum;
      });
    },
    submitForm: function () {
      let plugInHttp;
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.type = parseInt(formData.type);
      if (this.plugInId) {
        plugInHttp = ApiPlugIn.put(this.plugInId, formData);
      } else {
        plugInHttp = ApiPlugIn.post(formData);
      }
      plugInHttp.then((res) => {
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
.md-list-item-text {
  line-height: 50px !important;
  text-indent: 50px !important;
}
</style>
