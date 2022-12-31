<template>
  <div>
    <div class="plugin-button">
      <md-button class="md-raised md-primary addNode" @click="addPluginForm"
        ><i class="iconfont icon-addNode" /> 新增插件</md-button
      >
    </div>
    <md-card class="plug-card" v-show="addPlugin">
      <div class="plug_tab">
        <span
          @click="plugTab('plugAddInfo')"
          :class="{ tab_active: plugAddInfo }"
          >插件信息</span
        >
        <span
          @click="plugTab('plugAddSetting')"
          :class="{ tab_active: plugAddSetting }"
          >插件配置</span
        >
      </div>
      <div v-show="plugAddInfo">

        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>选择插件</label>
              <md-select
                name="plugin_id"
                id="plugin_id"
                @md-selected="pluginChange"
                md-dense
                v-model="form.plugin_id"
              >
                <md-option
                  v-for="(item, index) in pluginSettingList"
                  :key="index"
                  :value="item.res_id"
                  >{{ item.plugin_key }}</md-option
                >
              </md-select>
            </md-field>
          </div>
        </div>

        <div
          class="md-layout md-gutter"
          v-if="plugInInfo && Object.keys(pluginTypeList).length > 0"
        >
          <div class="md-layout-item">
            <md-field>
              <label>插件类型</label>
              <md-select
                name="plugin_type"
                id="plugin_type"
                v-model="plugInInfo.type"
                disabled
                md-dense
              >
                <md-option
                  v-for="(item, index) in pluginTypeList"
                  :key="index"
                  :value="index"
                  >{{ item }}</md-option
                >
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter" v-if="plugInInfo">
          <div class="md-layout-item">
            <md-field>
              <label>插件描述</label>
              <md-input :value="plugInInfo.description" disabled></md-input>
            </md-field>
          </div>
        </div>
      </div>

      <div v-show="plugAddSetting">
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>名称</label>
              <md-input v-model="form.name"></md-input>
            </md-field>
          </div>
        </div>

        <div v-if="plugInInfo">

          <div
            class="md-layout md-gutter"
            v-for="(item, index) in form.config"
            :key="index"
          >
            <div class="md-layout-item" v-if="index === `http_headers`">
              <label>{{ index }}</label>
              <div v-if="form.config['http_headers'].length > 0" style="padding-left: 30px;">
                <div
                    class="md-layout md-gutter"
                    v-for="(header_item, header_index) in form.config['http_headers']"
                    :key="header_index"
                >
                  <div class="md-layout-item md-size-20">
                    <md-field>
                      <label>key</label>
                      <md-input v-model.trim="form.config['http_headers'][header_index].key"/>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-40">
                    <md-field>
                      <label>value</label>
                      <md-input v-model.trim="form.config['http_headers'][header_index].value"/>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-20 header-op">
                    <i class="iconfont icon-tianjia" @click="addHeader" />
                    <i class="iconfont icon-jian" @click="removeHeader(header_index)" v-if="header_index != 0" />
                  </div>
                </div>
              </div>
            </div>

            <div class="md-layout-item" v-else-if="index === `allow_credential`">
              <label class="form-label">allow_credential：</label>
              <md-switch v-model="form.config.allow_credential" class="md-primary " />
            </div>

            <div class="md-layout-item" v-else>
              <md-field>
                <label>{{ index }}</label>
                <md-input v-model="form.config[index]"></md-input>
              </md-field>
            </div>

          </div>

        </div>

        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <label class="form-label">启用：</label>
            <md-switch v-model="form.enable" class="md-primary" />
          </div>
        </div>

      </div>

      <div class="service-button">
        <md-button class="md-raised md-mini" @click="addPlugin = false"
          >取消</md-button
        >
        <md-button class="md-raised md-mini md-primary" @click="submitForm"
          >保存</md-button
        >
      </div>
    </md-card>

    <div class="plug-table md-clear top-20">
      <div class="plug-thtr">
        <div class="plug-th" style="width: 45px">展开</div>
        <div class="plug-th" style="width: 40px"></div>
        <div class="plug-th" style="width: 250px">名称</div>
        <div class="plug-th" style="width: 110px">标识</div>
        <div class="plug-th" style="width: 60px">类型</div>
        <div class="plug-th" style="width: 240px">描述</div>
        <div class="plug-th" style="width: 70px">启用</div>
        <div class="plug-th" style="width: 100px">操作</div>
      </div>

      <div class="plug-tr" v-for="(item, index) in pluginList" :key="index">
        <div class="plug-td" style="width: 45px; cursor: pointer">
          <i
            class="iconfont"
            :class="arrowClass(item.is_edit)"
            @click="editShow(item, !item.is_edit)"
          ></i>
        </div>
        <div class="plug-td" style="width: 40px">
          <i class="iconfont" :class="[item.icon, item.color]"></i>
        </div>
        <div class="plug-td font-bold" style="width: 250px">
          {{ item.name }}
        </div>
        <div class="plug-td" :class="[item.color]" style="width: 110px">
          {{ item.plugin_key }}
        </div>
        <div class="plug-td" :class="[item.color]" style="width: 60px">
          {{ item.type_name }}
        </div>
        <div class="plug-td" style="width: 240px">
          {{ item.plugin_description }}
        </div>
        <div class="plug-td" style="width: 70px">
          <md-switch
            v-model="item.enable"
            class="md-primary"
            @change="putSwitchEnable(item)"
          ></md-switch>
        </div>
        <div class="plug-td list_manage" style="width: 100px">
          <i class="iconfont icon-xiugai" @click="editShow(item, true)">
            <md-tooltip md-direction="top">修改</md-tooltip>
          </i>
          <i
            class="iconfont icon-shanchu"
            @click="deleteRoutePlugin(item)"
          >
            <md-tooltip md-direction="top">删除</md-tooltip>
          </i>
        </div>

        <div class="plug-tr-form" v-if="item.is_edit" :key="item.res_id">

          <div class="md-layout md-gutter">
            <div class="md-layout-item">
              <md-field>
                <label>名称</label>
                <md-input v-model="item.name"></md-input>
              </md-field>
            </div>
          </div>

          <md-field v-for="(value, label) in item.config" :key="label">

            <div v-if="label === `http_headers`">
              <label>{{ label }}</label>
              <div v-if="item.config['http_headers'].length > 0" style="padding-left: 30px; padding-top: 30px;">
                <div
                    class="md-layout md-gutter"
                    v-for="(header_item, header_index) in item.config['http_headers']"
                    :key="header_index"
                >
                  <div class="md-layout-item md-size-30">
                    <md-field>
                      <label>key</label>
                      <md-input v-model.trim="item.config['http_headers'][header_index].key"/>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-60">
                    <md-field>
                      <label>value</label>
                      <md-input v-model.trim="item.config['http_headers'][header_index].value"/>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-10 header-op">
                    <i class="iconfont icon-tianjia" @click="addEditHeader(index)" />
                    <i class="iconfont icon-jian" @click="removeEditHeader(index, header_index)" v-if="header_index != 0" />
                  </div>
                </div>
              </div>
            </div>

            <div class="md-layout md-gutter" v-else-if="label === `allow_credential`">
              <div class="md-layout-item">
                <label class="form-label">allow_credential：</label>
                <md-switch v-model="item.config.allow_credential" class="md-primary" style="margin-left: 120px; margin-top: 10px;" />
              </div>
            </div>

            <div class="md-layout-item" v-else>
              <label>{{ label }}</label>
              <md-input v-model="item.config[label]" />
            </div>

          </md-field>

          <div class="service-button">
            <md-button class="md-raised" @click="editShow(item, false)"
            >取消</md-button
            >
            <md-button class="md-raised md-primary" @click="configSubmit(item)"
            >保存</md-button
            >
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiPlugIn from "../../api/ApiPlugIn";

export default {
  name: "List",
  props: {
    pluginConfigType: {
      type: Number,
      default: 0,
    },
    targetResId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addPlugin: false,
      plugAddInfo: true,
      plugAddSetting: false,
      pluginList: [],
      pluginSettingList: [],
      pluginTypeList: {},
      plugInInfo: null,
      pluginMockHeader: {
        key: "",
        value: "",
      },
      pluginKey: "",
      form: {
        name: "",
        plugin_id: "",
        type: this.pluginConfigType,
        target_id: this.targetResId,
        enable: 2,
        config: {},
      },
    };
  },
  mounted() {
    if (this.targetResId) {
      this.getPluginType().then(() => {
        if (this.targetResId.length > 0 && this.pluginConfigType !== 0) {
          this.getList();
        }
      });
    }
  },
  methods: {
    /**
     * 获取插件类型列表数据
     */
    getPluginType: function () {
      return ApiPlugIn.typeList().then((res) => {
        let typeEnum = {};
        if (res.code === 0) {
          res.data.forEach(function (item, index) {
            typeEnum[item.id] = item.name;
          });
        }
        this.pluginTypeList = typeEnum;
      });
    },

    /**
     * 获取路由下的插件列表
     */
    getList: function () {
      ApiPlugIn.pluginConfigList(this.pluginConfigType, this.targetResId).then((res) => {

        if (res.code === 0) {
          this.pluginList = res.data['list'] || [];
          if (this.pluginList.length > 0) {
            this.pluginList.forEach((item, index) => {
              item.is_edit = false;
              item.type_name = this.pluginTypeList[item.plugin_type] || "";
              item.enable = item.enable === 1;
              if (item.enable === true) {
                item.color = "color-plugin-" + item.plugin_type;
              } else {
                item.color = "color-plugin-0";
              }
              if (item.icon.length === 0) {
                item.icon = "icon-apex_plugin1";
              }

              if (item.plugin_key === "mock") {
                let httpHeaders = item.config.http_headers;
                item.config.http_headers = [];

                let httpHeadersKeys = Object.keys(httpHeaders);
                if (httpHeadersKeys.length > 0) {
                  httpHeadersKeys.forEach((header_item, header_index) => {
                    item.config.http_headers.push({
                      key: header_item,
                      value: httpHeaders[header_item],
                    })
                  });
                } else {
                  item.config.http_headers.push(this.pluginMockHeader)
                }
              }
            });
          }
        }
      });
    },
    addPluginForm: function () {
      this.addPlugin = true;
      this.getAddPluginList();
    },
    /**
     * 获取插件列表
     */
    getAddPluginList: function () {
      ApiPlugIn.addPluginList(this.serviceId, this.routeId).then((res) => {
        if (res.code === 0) {
          this.pluginSettingList = res.data || [];
        }
      });
    },
    /**
     * 增加插件时插件的选择
     */
    pluginChange: function (pluginResId) {
      this.plugInInfo = null;
      ApiPlugIn.info(pluginResId).then((res) => {
        if (res.code === 0) {
          this.plugInInfo = res.data;
          this.plugInInfo.enable = false;
          this.form.config = res.data.config;
          this.pluginKey = this.plugInInfo.plugin_key;

          if (this.plugInInfo.plugin_key === "mock") {
            let pluginMockHeader = this.plugInInfo.config.http_headers;
            this.plugInInfo.config.http_headers = [];

            let pluginMockHeaderKeys = Object.keys(pluginMockHeader);
            if (pluginMockHeaderKeys.length > 0) {
              pluginMockHeaderKeys.forEach((header_item, header_index) => {
                this.plugInInfo.config.http_headers.push({
                  key: header_item,
                  value: pluginMockHeader[header_item],
                })
              });
            } else {
              this.plugInInfo.config.http_headers.push(this.pluginMockHeader)
            }
          }

        } else {
          this.$notify({ message: res.msg });
        }
      });
    },

    /**
     * mock插件中的header数据增加
     */
    addHeader: function () {
      this.form.config['http_headers'].push({
        key: "",
        value: "",
      });
    },
    /**
     * mock插件中的header数据的减少
     */
    removeHeader: function (index) {
      this.$delete(this.form.config['http_headers'], index);
    },

    /**
     * 保存插件数据
     */
    submitForm: function () {
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.enable = formData.enable === true ? 1 : 2;

      if (formData.config.http_headers) {
        let allow_headers = formData.config.http_headers;
        formData.config.http_headers = {};
        if (allow_headers.length > 0) {
          for (let key of Object.keys(allow_headers)) {
            if ((allow_headers[key].key.length > 0) && (allow_headers[key].value.length > 0)) {
              formData.config.http_headers[allow_headers[key].key] = allow_headers[key].value
            }
          }
        }
      }

      if (formData.config.http_code) {
        formData.config.http_code = formData.config.http_code - 0;
      }
      if (formData.config.max_age) {
        formData.config.max_age = formData.config.max_age - 0;
      }
      if (formData.config.rate) {
        formData.config.rate = formData.config.rate - 0;
      }
      if (formData.config.burst) {
        formData.config.burst = formData.config.burst - 0;
      }
      if (formData.config.time_window) {
        formData.config.time_window = formData.config.time_window - 0;
      }
      if (formData.config.count) {
        formData.config.count = formData.config.count - 0;
      }
      if (formData.config.default_conn_delay) {
        formData.config.default_conn_delay = formData.config.default_conn_delay - 0;
      }

      ApiPlugIn.pluginConfigAdd(this.pluginConfigType, formData).then((res) => {
        if (res.code === 0) {
          this.addPlugin = false;
          this.getList();
          this.$notify({ message: res.msg, type: "primary" });
          this.$emit("refreshList");
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },

    /**
     * 路由插件开关
     */
    putSwitchEnable: function (item) {
      let status = item.enable === true ? 1 : 2;

      ApiPlugIn.pluginConfigSwitchEnable(this.pluginConfigType, item.res_id, status).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
          this.$emit("refreshList");
        } else {
          item.enable = !item.enable;
          this.$notify({ message: res.msg });
        }
      });
    },

    /**
     * 插件配置删除
     * @param item
     */
    deleteRoutePlugin: function (item) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除插件？",
        })
        .then(() => {
          ApiPlugIn.pluginConfigDelete(this.pluginConfigType, item.res_id).then((res) => {
            if (res.code === 0) {
              this.$notify({ message: res.msg, type: "primary" });
              this.getList();
              this.$emit("refreshList");
            } else {
              this.$notify({ message: res.msg });
            }
          });
        });
    },

    /**
     * 插件配置编辑
     */
    editShow: function (item, isEdit) {
      item.is_edit = isEdit;
      this.$forceUpdate();
    },

    /**
     * mock插件中的header数据增加
     */
    addEditHeader: function (index) {
      this.pluginList[index].config['http_headers'].push({
        key: "",
        value: "",
      });
    },
    /**
     * mock插件中的header数据的减少
     */
    removeEditHeader: function (index, header_index) {
      this.$delete(this.pluginList[index].config['http_headers'], header_index);
    },

    configSubmit: function (item) {
      let configParams = {
        name: item.name,
        config: item.config,
      };

      if (configParams.config.http_headers) {
        let allow_headers = configParams.config.http_headers;
        configParams.config.http_headers = {};
        if (allow_headers.length > 0) {
          for (let key of Object.keys(allow_headers)) {
            if ((allow_headers[key].key.length > 0) && (allow_headers[key].value.length > 0)) {
              configParams.config.http_headers[allow_headers[key].key] = allow_headers[key].value
            }
          }
        }
      }

      if (configParams.config.http_code) {
        configParams.config.http_code = configParams.config.http_code - 0;
      }
      if (configParams.config.max_age) {
        configParams.config.max_age = configParams.config.max_age - 0;
      }
      if (configParams.config.rate) {
        configParams.config.rate = configParams.config.rate - 0;
      }
      if (configParams.config.burst) {
        configParams.config.burst = configParams.config.burst - 0;
      }
      if (configParams.config.time_window) {
        configParams.config.time_window = configParams.config.time_window - 0;
      }
      if (configParams.config.count) {
        configParams.config.count = configParams.config.count - 0;
      }
      if (configParams.config.default_conn_delay) {
        configParams.config.default_conn_delay = configParams.config.default_conn_delay - 0;
      }

      ApiPlugIn.pluginConfigUpdate(this.pluginConfigType, item.res_id, configParams).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
          this.$emit("refreshList");
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },

    plugTab: function (tabName) {
      this.plugAddInfo = false;
      this.plugAddSetting = false;
      this[tabName] = true;
    },
    arrowClass: function (isEdit) {
      return isEdit ? "icon-xiajiantou" : "icon-arrowright";
    },
  },
};
</script>

<style lang="scss" scoped>
.plug-table {
  width: 100%;
  .plug-tr,
  .plug-thtr {
    display: flex;
    flex-wrap: wrap;
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: background-color, font-weight;
    will-change: background-color, font-weight;
  }
  .plug-tr:hover {
    background: #f5f5f5 !important;
  }
  .plug-th {
    font-size: 1.0625rem;
    padding-left: 8px;
    font-weight: 300;
    height: 28px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.54);
    color: var(
      --md-theme-default-text-accent-on-background,
      rgba(0, 0, 0, 0.54)
    );
  }
  .plug-td {
    flex-shrink: 0;
    padding: 12px 8px;
    font-size: 14px;
    height: 68px;
    line-height: 28px;
    position: relative;
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid;
    border-top-color: rgba(0, 0, 0, 0.06) !important;

    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;

    .md-switch {
      position: relative;
      top: -25%;
    }
  }
  .plug-tr-form {
    opacity: 1;
    transition: opacity 0.5s;
    padding: 10px;
    flex-shrink: 0;
    width: 100%;
    overflow: hidden;
    .service-button {
      text-align: center;
      button {
        margin: 5px;
      }
    }
  }
}
.plugin-button {
  width: 100%;
  text-align: right;
  .addNode {
    font-size: 14px;
    i {
      line-height: 17px;
      margin-right: 5px;
    }
  }
}
.plug-card {
  padding: 10px;
  .plug_tab {
    width: 100%;
    text-align: center;
    span {
      display: inline-block;
      width: 80px;
      height: 35px;
      line-height: 35px;
      background: #ffffff;
      border-radius: 3px 0 0 3px;
      color: #666666;
      border: 1px solid #c8c8c8;
      cursor: pointer;
    }
    span:last-child {
      border-radius: 0 3px 3px 0;
    }
    span.tab_active {
      background: #1e88e5;
      color: #ffffff;
      border: 1px solid #1e88e5;
    }
  }
  .service-button {
    text-align: center;
  }
}
.list_manage {
  i {
    margin: 0 4px;
  }
}
.word-break {
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.top-20 {
  margin-top: 20px;
}
.header-op {
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
</style>
