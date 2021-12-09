<template>
  <div>
    <div class="plugin-button">
      <md-button class="md-raised md-success addNode" @click="addPlugInForm"
        ><i class="iconfont icon-addNode" /> 新增插件</md-button
      >
    </div>
    <md-card class="plug-card" v-show="addPlugIn">
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
              >
                <md-option
                  v-for="(item, index) in plugInSettingList"
                  :key="index"
                  :value="item.id"
                  >{{ item.name }}</md-option
                >
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter" v-if="plugInInfo">
          <div class="md-layout-item">
            <md-field>
              <label>插件标识</label>
              <md-input :value="plugInInfo.tag" disabled></md-input>
            </md-field>
          </div>
        </div>
        <div
          class="md-layout md-gutter"
          v-if="plugInInfo && Object.keys(plugInTypeList).length > 0"
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
                  v-for="(item, index) in plugInTypeList"
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
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <label class="form-label">启用：</label>
            <md-switch v-model="form.is_enable" class="md-primary" />
          </div>
        </div>
      </div>
      <div v-show="plugAddSetting">
        <div v-if="plugInInfo">
          <div
            class="md-layout md-gutter"
            v-for="(item, index) in form.config"
            :key="index"
          >
            <div class="md-layout-item">
              <md-field>
                <label>{{ index }}</label>
                <md-input v-model="form.config[index]"></md-input>
              </md-field>
            </div>
          </div>
        </div>
      </div>
      <div class="service-button">
        <md-button class="md-raised md-mini" @click="addPlugIn = false"
          >取消</md-button
        >
        <md-button class="md-raised md-mini md-success" @click="submitForm"
          >保存</md-button
        >
      </div>
    </md-card>
    <div class="plug-table md-clear">
      <div class="plug-thtr">
        <div class="plug-th" style="width: 50px">展示</div>
        <div class="plug-th" style="width: 130px">ID/名称</div>
        <div class="plug-th" style="width: 100px">标识</div>
        <div class="plug-th" style="width: 80px">类型</div>
        <div class="plug-th" style="width: 150px">描述</div>
        <div class="plug-th" style="width: 60px">发布</div>
        <div class="plug-th" style="width: 60px">启用</div>
        <div class="plug-th" style="width: 100px">操作</div>
      </div>
      <div class="plug-tr" v-for="(item, index) in plugInList" :key="index">
        <div class="plug-td" style="width: 50px; cursor: pointer">
          <i
            class="iconfont"
            :class="arrowClass(item.is_edit)"
            @click="editShow(item, !item.is_edit)"
          ></i>
        </div>
        <div class="plug-td" style="width: 130px">{{ item.name }}</div>
        <div class="plug-td" style="width: 100px">{{ item.tag }}</div>
        <div class="plug-td" style="width: 80px">{{ item.type_cn }}</div>
        <div class="plug-td" style="width: 150px">{{ item.description }}</div>
        <div class="plug-td" style="width: 60px">
          <md-switch
            v-if="!item.is_release"
            v-model="item.is_release"
            class="md-primary"
            @change="putSwitchRelease(item)"
          ></md-switch>
          <md-button class="md-icon-button md-primary" v-else>已发布</md-button>
        </div>
        <div class="plug-td" style="width: 60px">
          <md-switch
            v-model="item.is_enable"
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
            @click="deleteRoutePlugin(item.id, item.plugin_id)"
          ><md-tooltip md-direction="top">删除</md-tooltip></i>
        </div>
        <div class="plug-tr-form" v-if="item.is_edit" :key="item.id">
          <md-field v-for="(value, label) in item.config" :key="label">
            <label>{{ label }}</label>
            <md-input v-model="item.config[label]" />
          </md-field>
          <div class="service-button">
            <md-button class="md-raised" @click="editShow(item, false)"
              >取消</md-button
            >
            <md-button class="md-raised md-success" @click="configSubmit(item)"
              >保存</md-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiRoute from "../../api/ApiRoute";
import ApiPlugIn from "../../api/ApiPlugIn";

export default {
  name: "List",
  props: {
    serviceId: {
      type: String,
      default: "",
    },
    routeId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addPlugIn: false,
      plugAddInfo: true,
      plugAddSetting: false,
      plugInList: [],
      plugInSettingList: [],
      plugInTypeList: {},
      plugInInfo: null,
      form: {
        config: {},
        is_enable: 2,
        order: 10,
      },
    };
  },
  mounted() {
    this.getPlugInType().then(() => {
      if (this.routeId) {
        this.getList();
      }
    });
  },
  methods: {
    /**
     * 获取路由下的插件列表
     */
    getList: function () {
      ApiRoute.routePluginList(this.serviceId, this.routeId).then((res) => {
        if (res.code === 0) {
          this.plugInList = res.data || [];
          if (this.plugInList.length > 0) {
            this.plugInList.forEach((item, index) => {
              item.is_release = item.is_release === 1;
              item.is_enable = item.is_enable === 1;
              item.is_edit = false;
              item.type_cn = this.plugInTypeList[item.type] || "";
              item.config = JSON.parse(item.config || "[]");
            });
          }
        }
      });
    },
    addPlugInForm: function () {
      this.addPlugIn = true;
      this.getAddPluginList();
    },
    /**
     * 获取插件列表
     */
    getAddPluginList: function () {
      ApiRoute.addPluginList(this.serviceId, this.routeId).then((res) => {
        if (res.code === 0) {
          this.plugInSettingList = res.data || [];
        }
      });
    },
    pluginChange: function (value) {
      this.plugInInfo = null;
      ApiPlugIn.info(value).then((res) => {
        if (res.code === 0) {
          this.plugInInfo = res.data;
          this.plugInInfo.is_enable = this.plugInInfo.is_enable === 1;
          this.form.config = res.data.config;
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },

    /**
     * 路由插件发布
     */
    putSwitchRelease: function (item) {
      let status = item.is_release === true ? 1 : 2;
      ApiRoute.putSwitchRoutePluginRelease(
        this.routeId,
        item.plugin_id,
        item.id,
        status
      ).then((res) => {
        if (res.code !== 0) {
          item.is_release = !item.is_release;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },

    /**
     * 路由插件开关
     */
    putSwitchEnable: function (item) {
      let status = item.is_enable === true ? 1 : 2;
      ApiRoute.putSwitchRoutePluginEnable(
        this.routeId,
        item.plugin_id,
        item.id,
        status
      ).then((res) => {
        if (res.code === 0) {
          item.is_release = false;
          this.$notify({ message: "修改成功", type: "success" });
        } else {
          item.is_enable = !item.is_enable;
          this.$notify({ message: res.msg });
        }
      });
    },
    editShow: function (item, isEdit) {
      item.is_edit = isEdit;
      this.$forceUpdate();
    },
    configSubmit: function (item) {
      let configParams = {
        is_enable: item.is_enable === true ? 1 : 2,
        order: 10,
        config: item.config,
      };
      ApiRoute.updateRoutePlugin(
        this.routeId,
        item.plugin_id,
        item.id,
        configParams
      ).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: "修改成功", type: "success" });
          this.getList();
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
    deleteRoutePlugin: function (id, pluginId) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除插件？",
        })
        .then(() => {
          ApiRoute.deleteRoutePlugin(this.routeId, pluginId, id).then((res) => {
            if (res.code === 0) {
              this.$notify({ message: "删除成功", type: "success" });
              this.getList();
            } else {
              this.$notify({ message: res.msg });
            }
          });
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
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.is_enable = formData.is_enable === true ? 1 : 2;
      ApiRoute.addRoutePlugin(
        this.serviceId,
        this.routeId,
        this.plugInInfo.id,
        formData
      ).then((res) => {
        if (res.code === 0) {
          this.addPlugIn = false;
          this.getList();
          this.$notify({ message: res.msg, type: "success" });
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
      background: #4caf50;
      color: #ffffff;
      border: 1px solid #4caf50;
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
</style>
