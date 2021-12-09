<template>
  <div>
    <form>
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
      <div v-if="form.service_nodes.length > 0">
        <div
          class="md-layout md-gutter"
          v-for="(item, index) in $v.form.service_nodes.$each.$iter"
          :key="index"
        >
          <div class="md-layout-item md-size-40">
            <md-field :class="getValidationClass('service_nodes')">
              <label>上游节点</label>
              <md-input
                v-model.trim="form.service_nodes[index].node_ip"
                required
              />
              <span class="md-error" v-if="!item.node_ip.required"
                >上游节点不能为空</span
              >
              <span class="md-error" v-if="!item.node_ip.ipAddress"
                >上游节点格式有误</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-20">
            <md-field :class="getValidationClass('service_nodes')">
              <label>端口</label>
              <md-input
                v-model.number="form.service_nodes[index].node_port"
                required
              />
              <span class="md-error" v-if="!item.node_port.required"
                >端口不能为空</span
              >
              <span class="md-error" v-if="!item.node_port.between"
                >端口范围应在1~65535之间</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-20">
            <md-field :class="getValidationClass('service_nodes')">
              <label>权重</label>
              <md-input
                v-model.number="form.service_nodes[index].node_weight"
              />
              <span class="md-error" v-if="!item.node_weight.between"
                >端口范围应在1~100之间</span
              >
            </md-field>
          </div>
          <div class="md-layout-item md-size-20 service-node">
            <i class="iconfont icon-tianjia" @click="addNode" />
            <i
              class="iconfont icon-jian"
              @click="removeNode(index)"
              v-if="index != 0"
            />
          </div>
        </div>
      </div>
      <div class="service-advanced">
        <div class="service-advanced-click" @click="isAdvanced = !isAdvanced">
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
            <label class="form-label">请求协议：</label>
            <md-radio v-model="form.protocol" value="1">HTTP</md-radio>
            <md-radio v-model="form.protocol" value="2">HTTPS</md-radio>
            <md-radio v-model="form.protocol" value="3">HTTP&HTTPS</md-radio>
          </div>
          <div class="form-item">
            <label class="form-label">健康检查：</label>
            <md-switch
              v-model="form.health_check"
              class="md-primary"
            ></md-switch>
          </div>
          <div class="form-item">
            <label class="form-label">启用：</label>
            <md-switch v-model="form.is_enable" class="md-primary"></md-switch>
          </div>
          <div class="form-item">
            <md-field>
              <label>负载均衡</label>
              <md-select
                name="load_balance"
                id="load_balance"
                v-model.number="form.load_balance"
                md-dense
              >
                <md-option value="1">加权轮询(Weighted Round Robin)</md-option>
                <md-option value="2">ip_hash</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="form-item">
            <md-field
              :class="getValidationClass('connection_timeout', 'timeouts')"
            >
              <label>链接超时（毫秒）</label>
              <md-input
                v-model.number="form.timeouts.connection_timeout"
                required
              ></md-input>
              <span
                class="md-error"
                v-if="!$v.form.timeouts.connection_timeout.required"
                >链接超时不能为空</span
              >
              <span
                class="md-error"
                v-if="!$v.form.timeouts.connection_timeout.integer"
                >链接超时内容必须为数字</span
              >
            </md-field>
          </div>
          <div class="form-item">
            <md-field :class="getValidationClass('send_timeout', 'timeouts')">
              <label>发送超时（毫秒）</label>
              <md-input
                v-model.number="form.timeouts.send_timeout"
                required
              ></md-input>
              <span
                class="md-error"
                v-if="!$v.form.timeouts.send_timeout.required"
                >发送超时不能为空</span
              >
              <span
                class="md-error"
                v-if="!$v.form.timeouts.send_timeout.integer"
                >发送超时内容必须为数字</span
              >
            </md-field>
          </div>
          <div class="form-item">
            <md-field :class="getValidationClass('read_timeout', 'timeouts')">
              <label>读取超时（毫秒）</label>
              <md-input
                v-model.number="form.timeouts.read_timeout"
                required
              ></md-input>
              <span
                class="md-error"
                v-if="!$v.form.timeouts.read_timeout.required"
                >读取超时不能为空</span
              >
              <span
                class="md-error"
                v-if="!$v.form.timeouts.read_timeout.integer"
                >读取超时内容必须为数字</span
              >
            </md-field>
          </div>
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
    </form>
  </div>
</template>

<script>
import ApiService from "../../api/ApiService";
import {
  required,
  between,
  ipAddress,
  integer,
} from "vuelidate/lib/validators";
export default {
  name: "ServiceModify",
  props: {
    serviceId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isAdvanced: false,
      form: {
        name: "",
        service_domains: [],
        service_nodes: [],
        protocol: 1,
        health_check: 2,
        web_socket: 2,
        is_enable: 1,
        load_balance: 2,
        timeouts: {
          connection_timeout: 3000,
          send_timeout: 3000,
          read_timeout: 3000,
        },
      },
    };
  },
  validations: {
    form: {
      service_domains: {
        $each: { required },
      },
      service_nodes: {
        $each: {
          node_ip: {
            required,
            ipAddress,
          },
          node_port: {
            required,
            between: between(1, 65535),
          },
          node_weight: {
            between: between(1, 100),
          },
        },
      },
      timeouts: {
        connection_timeout: {
          required,
          integer,
        },
        send_timeout: {
          required,
          integer,
        },
        read_timeout: {
          required,
          integer,
        },
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
      let defaultNodeList = [
        {
          node_ip: "",
          node_port: "",
          node_weight: "",
        },
      ];
      this.form.service_domains = [""];
      this.form.service_nodes = defaultNodeList;
      if (this.serviceId.length === 0) {
        return;
      }
      ApiService.info(this.serviceId).then((res) => {
        if (res.code === 0) {
          let serviceDetail = res.data;
          for (let key of Object.keys(this.form)) {
            this.form[key] = serviceDetail[key];
          }
          this.form.protocol = this.form.protocol.toString();
          this.form.health_check = this.form.health_check == 1;
          this.form.is_enable = this.form.is_enable == 1;
          //设置默认信息
          if (this.form.service_domains.length === 0) {
            this.form.service_domains = [""];
          }
          if (this.form.service_nodes.length === 0) {
            this.form.service_nodes = defaultNodeList;
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
      formData.health_check = formData.health_check === true ? 1 : 2;
      formData.is_enable = formData.is_enable === true ? 1 : 2;
      formData.service_nodes.forEach((item, index) => {
        item.node_weight = item.node_weight || 0;
      });
      let serviceHttp;
      if (this.serviceId) {
        serviceHttp = ApiService.put(this.serviceId, formData);
      } else {
        serviceHttp = ApiService.post(formData);
      }
      serviceHttp.then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "success" });
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
    addNode: function () {
      this.form.service_nodes.push({
        node_ip: "",
        node_port: "",
        node_weight: "",
      });
    },
    removeNode: function (index) {
      this.$delete(this.form.service_nodes, index);
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
  color: #66bb6a;
  cursor: pointer !important;
}
.icon-jian {
  z-index: 99;
  color: red;
  cursor: pointer !important;
}
</style>
