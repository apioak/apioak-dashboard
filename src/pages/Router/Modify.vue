<template>
  <form>
    <div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>路由名称</label>
          <md-input v-model="form.router_name" />
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter" v-if="this.routerResId.length === 0">
      <div class="md-layout-item service_res_id">
        <md-field :class="getValidationClass('service_res_id')">
          <label>所属服务</label>
          <md-select
              name="service_res_id"
              id="service_res_id"
              v-model="form.service_res_id"
              md-dense
              required
          >
            <md-option v-for="(item, index) in serviceNameList" :key="index" :value=item.res_id >{{ item.name }}</md-option>

          </md-select>
          <span class="md-error" v-if="!$v.form.service_res_id.required"
          >所属服务不能为空</span
          >
        </md-field>
      </div>
    </div>

    <div class="md-layout md-gutter">
      <div class="md-layout-item router_path">
        <md-field :class="getValidationClass('router_path')">
          <label>路由路径</label>
          <md-input v-model="form.router_path" required />
          <span class="md-error" v-if="!$v.form.router_path.required"
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
        <md-switch v-model="form.enable" class="md-primary" />
      </div>
    </div>

    <div v-if="form.upstream_nodes.length > 0">
      <div
          class="md-layout md-gutter"
          v-for="(item, index) in $v.form.upstream_nodes.$each.$iter"
          :key="index"
      >
        <div class="md-layout-item md-size-40">
          <md-field :class="getValidationClass('upstream_nodes')">
            <label>上游节点</label>
            <md-input
                v-model.trim="form.upstream_nodes[index].node_ip"
            />
            <span class="md-error" v-if="!item.node_ip.ipAddress"
            >上游节点格式有误</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-size-20">
          <md-field :class="getValidationClass('upstream_nodes')">
            <label>端口</label>
            <md-input
                v-model.number="form.upstream_nodes[index].node_port"
            />
            <span class="md-error" v-if="!item.node_port.between"
            >端口范围应在1~65535之间</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-size-20">
          <md-field :class="getValidationClass('upstream_nodes')">
            <label>权重</label>
            <md-input
                v-model.number="form.upstream_nodes[index].node_weight"
            />
            <span class="md-error" v-if="!item.node_weight.between"
            >端口范围应在1~100之间</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-size-20 upstream-node-op">
          <i class="iconfont icon-tianjia" @click="addNode" />
          <i class="iconfont icon-jian" @click="removeNode(index)" v-if="index != 0"/>
        </div>
      </div>
    </div>

    <div class="modify-advanced">
      <div class="modify-advanced-click" @click="isAdvanced = !isAdvanced">
        高级配置
        <i
            class="iconfont"
            :class="{
              'icon-xiajiantou': isAdvanced === false,
              'icon-shangjiantou': isAdvanced === true,
            }"
        ></i>
      </div>
      <div v-show="isAdvanced">

        <div class="form-item">
          <md-field>
            <label>负载均衡</label>
            <md-select
                name="load_balance"
                id="load_balance"
                v-model.number="form.load_balance"
                md-dense
            >
              <md-option value="1">加权轮询（Round Robin）</md-option>
              <md-option value="2">一致性Hash（CHash）</md-option>
            </md-select>
          </md-field>
        </div>

        <div class="form-item">
          <md-field
              :class="getValidationClass('connect_timeout')"
          >
            <label>连接超时（毫秒）</label>
            <md-input
                v-model.number="form.connect_timeout"
            ></md-input>
            <span
                class="md-error"
                v-if="!$v.form.connect_timeout.integer"
            >连接超时内容必须为1~600000的数字</span
            >
          </md-field>
        </div>
        <div class="form-item">
          <md-field :class="getValidationClass('write_timeout')">
            <label>写超时（毫秒）</label>
            <md-input
                v-model.number="form.write_timeout"
            ></md-input>
            <span
                class="md-error"
                v-if="!$v.form.write_timeout.integer"
            >写超时内容必须为1~600000的数字</span
            >
          </md-field>
        </div>
        <div class="form-item">
          <md-field :class="getValidationClass('read_timeout')">
            <label>读超时（毫秒）</label>
            <md-input
                v-model.number="form.read_timeout"
            ></md-input>
            <span
                class="md-error"
                v-if="!$v.form.read_timeout.integer"
            >读超时内容必须为1~600000的数字</span
            >
          </md-field>
        </div>
      </div>
    </div>


    <div class="modify-button">
      <md-button class="md-raised" @click="$emit('closeDrawer')"
        >取消</md-button
      >
      <md-button class="md-raised md-primary" @click="submitForm"
        >保存</md-button
      >
    </div>
  </div>
  </form>
</template>

<script>
import ApiService from "../../api/ApiService";
import ApiRoute from "../../api/ApiRouter";
import {
  required,
  between,
  ipAddress,
  integer,
} from "vuelidate/lib/validators";

export default {
  name: "RouterModify",
  props: {
    serviceResId: {
      type: String,
      default: "",
    },
    routerResId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isAdvanced: false,
      form: {
        router_name: "",
        service_res_id: this.$serviceResId,
        request_methods: [],
        router_path: "",
        enable: 2,
        upstream_res_id: "",
        upstream_nodes: [],
        load_balance: 1,
        read_timeout: 3000,
        write_timeout: 3000,
        connect_timeout: 3000,
      },
      serviceNameList: [],
    };
  },
  validations: {
    form: {
      service_res_id: { required },
      router_path: { required },
      request_methods: { required },
      upstream_nodes: {
        $each: {
          node_ip: {
            ipAddress,
          },
          node_port: {
            between: between(1, 65535),
          },
          node_weight: {
            between: between(1, 100),
          },
        },
      },
      load_balance: {
        between: between(1, 2),
      },
      read_timeout: {
        integer,
        between: between(1, 600000),
      },
      write_timeout: {
        integer,
        between: between(1, 600000),
      },
      connect_timeout: {
        integer,
        between: between(1, 600000),
      },
    },
  },
  mounted() {
    if (this.routerResId) {
      this.isAdvanced = true;
    }
    this.getInfo();
    this.getServiceNameList();
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
    /**
     * 获取服务名称列表
     */
    getServiceNameList: function () {
      ApiService.getNameList().then((res) => {
        if (res.code === 0) {
          this.serviceNameList = res.data;
        }
      });
    },
    /**
     * 获取路由详情
     */
    getInfo: function () {
      let defaultNodeList = [
        {
          node_ip: "",
          node_port: "",
          node_weight: "",
        },
      ];
      this.form.upstream_nodes = defaultNodeList;
      if (this.routerResId.length === 0) {
        return;
      }
      ApiRoute.info(this.serviceResId, this.routerResId).then((res) => {
        if (res.code === 0) {
          for (let key of Object.keys(this.form)) {
            this.form[key] = res.data[key];
          }
          this.form.enable = this.form.enable === 1;

          if (res.data.upstream_nodes.length === 0) {
            this.form.upstream_nodes = defaultNodeList;
          }

          if (res.data.upstream_res_id.length === 0) {
            this.form.load_balance = "";
            this.form.read_timeout = "";
            this.form.write_timeout = "";
            this.form.connect_timeout = "";
          } else {
            this.form.load_balance = res.data.upstream.algorithm;
            this.form.read_timeout = res.data.upstream.read_timeout;
            this.form.write_timeout = res.data.upstream.write_timeout;
            this.form.connect_timeout = res.data.upstream.connect_timeout;
          }

        } else {
          this.$notify({ message: res.msg });
          return this.$emit("saveHandle");
        }
      });
    },

    /**
     * 提交数据
     */
    submitForm: function () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let routeHttp;
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.enable = formData.enable === true ? 1 : 2;
      formData.request_methods = formData.request_methods.join(",");

      let form_upstream_nodes = formData.upstream_nodes;
      formData.upstream_nodes = [];
      if (form_upstream_nodes.length > 0) {
        for (let key of Object.keys(form_upstream_nodes)) {
          if (form_upstream_nodes[key].node_ip.length > 0) {
            formData.upstream_nodes.push(form_upstream_nodes[key])
          }
        }
      }

      if (typeof formData.load_balance === "string") {
        formData.load_balance = 1;
      }

      let defaultTomeOut = 3000;
      if (typeof formData.read_timeout === "string") {
        formData.read_timeout = defaultTomeOut;
      }
      if (typeof formData.write_timeout === "string") {
        formData.write_timeout = defaultTomeOut;
      }
      if (typeof formData.connect_timeout === "string") {
        formData.connect_timeout = defaultTomeOut;
      }

      if (this.routerResId) { //修改
        routeHttp = ApiRoute.put(formData.service_res_id, this.routerResId, formData);
      } else { //添加
        routeHttp = ApiRoute.post(formData);
      }
      routeHttp.then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "primary" });
          return this.$emit("saveHandle");
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
    addNode: function () {
      this.form.upstream_nodes.push({
        node_ip: "",
        node_port: "",
        node_weight: "",
      });
    },
    removeNode: function (index) {
      this.$delete(this.form.upstream_nodes, index);
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
.modify-advanced {
  margin-bottom: 40px;
  .modify-advanced-click {
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
.upstream-node-op {
  position: relative;
  top: 0;
  left: 0;
  line-height: 80px;
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
.modify-button {
  width: 100%;
  text-align: right;
  button {
    margin-right: 15px;
  }
}
</style>
