<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <list-header :sidebar-item-color="sidebarBackground" icon="icon-fuwuqi" title="服务管理" title_href="Services"/>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>协议类型</label>
                  <md-select
                      name="protocol"
                      id="protocol"
                      v-model="serviceParams.protocol"
                      md-dense
                  >
                    <md-option value="0">全部</md-option>
                    <md-option value="1">HTTP</md-option>
                    <md-option value="2">HTTPS</md-option>
                    <md-option value="3">HTTP&HTTPS</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>启用状态</label>
                  <md-select
                      name="enable"
                      id="enable"
                      v-model="serviceParams.enable"
                      md-dense
                  >
                    <md-option value="0">全部</md-option>
                    <md-option value="1">启用</md-option>
                    <md-option value="2">停用</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>发布状态</label>
                  <md-select
                    name="release"
                    id="release"
                    v-model="serviceParams.release"
                    md-dense
                  >
                    <md-option value="0">全部</md-option>
                    <md-option value="1">未发布</md-option>
                    <md-option value="2">待发布</md-option>
                    <md-option value="3">已发布</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-field>
                  <label>搜索内容</label>
                  <md-input
                      v-model="serviceParams.search"
                      type="text"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item text-right">
                <md-button
                    class="md-raised md-primary addNode"
                    @click="drawerService('')"
                ><i class="iconfont icon-addNode"/> 新增服务
                </md-button>
              </div>
            </div>
          </md-card-content>
        </md-card>

        <md-card>
          <md-card-content>
            <md-table>
              <md-table-row class="md-head">
                <md-table-head>ID/名称</md-table-head>
                <md-table-head>域名</md-table-head>
                <md-table-head>协议</md-table-head>
                <md-table-head>插件</md-table-head>
                <md-table-head>
                  发布
                  <i class="iconfont icon-help color-orange">
                    <md-tooltip md-direction="top">
                      未发布：新增但未发布到数据面<br/>
                      待发布：当前配置与数据面不符<br/>
                      已发布：当前配置已发布数据面
                    </md-tooltip>
                  </i>
                </md-table-head>
                <md-table-head>启用</md-table-head>
                <md-table-head>操作</md-table-head>
              </md-table-row>

              <md-table-row v-for="(item, index) in serviceList" :key="index">
                <md-table-cell>
                  <span class="font-link-color" @click="drawerService(item)">
                    {{ item.res_id }}
                  </span>
                  <br/>
                  <span v-if="!item.edit_name">
                    {{ item.name }}
                    <i
                        class="iconfont icon-xiugai"
                        @click="editServiceName(item)"
                    >
                      <md-tooltip md-direction="top">修改名称</md-tooltip>
                    </i>
                  </span>
                  <md-field class="field-edit-name" v-else>
                    <md-input
                        v-model="item.name"
                        @blur="saveServiceName(item)"
                    />
                  </md-field>
                </md-table-cell>
                <md-table-cell>
                  <div style="cursor: pointer">
                    {{ item.service_domains[0] }}<span v-if="Object.keys(item.service_domains).length > 1">...</span>
                    <md-tooltip md-direction="top">
                      <div
                          v-for="(domain, domainIndex) in item.service_domains"
                          :key="domainIndex"
                      >
                        {{ domain }}
                      </div>
                    </md-tooltip>
                  </div>
                </md-table-cell>
                <md-table-cell>{{
                    item.protocol | protocolName
                  }}
                </md-table-cell>
                <md-table-cell>
                  <i v-for="(plugin, index) in item.plugin_list" :key="index" class="iconfont" :class="[plugin.icon, plugin.color]" style="margin: 2px;">
                    <md-tooltip md-direction="top">{{ plugin.name }}</md-tooltip>
                  </i>
                </md-table-cell>
                <md-table-cell>
                  <span v-if="item.release === 1" class="color-grey font-bold">未发布</span>
                  <span v-if="item.release === 2" class="color-orange font-bold">待发布</span>
                  <span v-if="item.release === 3" class="color-green font-bold">已发布</span>
                </md-table-cell>

                <md-table-cell>
                  <md-switch
                      v-model="item.enable"
                      @change="putSwitchEnable(item)"
                      class="md-primary"
                  ></md-switch>
                </md-table-cell>
                <md-table-cell class="list_manage">
                  <i
                      v-if="item.release !== 3"
                      @click="putSwitchRelease(item)"
                      class="iconfont icon-yuntongbu"
                  >
                    <md-tooltip md-direction="top">发布</md-tooltip>
                  </i>
                  <a
                      @click="drawerPlugin(item.res_id)"
                      href="javascript:void(0);"
                  >
                    <i class="iconfont icon-chajiangongneng">
                      <md-tooltip md-direction="top">插件</md-tooltip>
                    </i>
                  </a>
                  <router-link
                    :to="{
                      name: 'Router',
                      params: { service_res_id: item.res_id },
                    }">
                    <i class="iconfont icon-lianjie">
                      <md-tooltip md-direction="top">路由</md-tooltip>
                    </i>
                  </router-link>
                  <i
                    class="iconfont icon-xiugai"
                    @click="drawerService(item)"
                  >
                    <md-tooltip md-direction="top">修改</md-tooltip>
                  </i>
                  <i
                    class="iconfont icon-shanchu"
                    @click="deleteService(item)"
                  >
                    <md-tooltip md-direction="top">删除</md-tooltip>
                  </i>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <Pager
              v-if="total > 0"
              :pageSize="serviceParams.page_size"
              :current-pages=currentPage
              :totals="total"
              @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>

    <Drawer
      :title="currentServiceResId ? '编辑服务' : '新增服务'"
      width="700px"
      :display.sync="drawerDisplay"
      :inner="true"
    >
      <ServiceModify
        v-if="isShow"
        @closeDrawer="closeDrawer"
        :serviceResId="currentServiceResId"
        @saveHandle="saveHandle"
      />
    </Drawer>

    <Drawer
        title="插件列表"
        :display.sync="drawerPluginDisplay"
        :inner="true"
        width="830px"
        @refreshList = "refreshList"
    >
      <PlugInList
          v-if="isShow"
          :serviceResId="currentServiceResId"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import ListHeader from "../components/Common/ListHeader";
import Drawer from "../components/Common/Drawer";
import ServiceModify from "./Service/Modify";
import ApiService from "../api/ApiService";

export default {
  components: {
    ListHeader,
    Drawer,
    Pager,
    ServiceModify,
  },
  data() {
    return {
      sidebarBackground: "blue",
      country: null,
      drawerDisplay: false,
      drawerPluginDisplay: false,
      serviceParams: {
        protocol: "",
        is_enable: "",
        release_status: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      serviceList: [],
      total: 0,
      currentServiceResId: "",
      isShow: true,
      active: false,
    };
  },
  computed: {
    currentPage () {
      return parseInt(this.$store.state.currentPage);
    }
  },
  mounted() {
    this.serviceParams.page = this.$store.state.currentPage;
    //获取服务列表
    this.getList();
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    handleCurrentChange: function (page) {
      this.serviceParams.page = page.currentPage;
      this.$store.commit("setCurrentPage", page.currentPage);
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
    },
    closeDrawer: function () {
      this.drawerDisplay = false;
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      ApiService.getList(this.serviceParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.serviceList = res.data["data"];
          this.serviceList.forEach(function (item) {
            item.enable = item.enable === 1;
            item.edit_name = false;
          });
        }
      });
    },
    /**
     * 打开service的编辑
     */
    drawerService: function (item) {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentServiceResId = item.res_id;
      this.drawerDisplay = true;
    },
    /**
     * 打开插件列表
     */
    drawerPlugin: function (item) {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentServiceResId = item.res_id;
      this.drawerPluginDisplay = true;
    },
    /**
     * 修改名称
     */
    editServiceName: function (item) {
      item.edit_name = true;
      this.$forceUpdate();
    },
    saveServiceName: function (item) {
      ApiService.putName(item.res_id, item.name).then((res) => {
        if (res.code !== 0) {
          this.$notify({ message: res.msg });
        } else {
          item.edit_name = false;
          this.$forceUpdate();
          this.$notify({ message: res.msg, type: "primary" });
        }
      });
    },
    /**
     * 删除
     */
    deleteService: function (item) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除服务？",
        })
        .then(() => {
          ApiService.delete(item.res_id).then((res) => {
            if (res.code === 0) {
              this.getList();
            } else {
              this.$notify({ message: res.msg });
              this.getList();
            }
          });
        });
    },
    /**
     * 服务发布
     */
    putSwitchRelease: function (item) {
      ApiService.putSwitchRelease(item.res_id).then((res) => {
        if (res.code !== 0) {
          this.$notify({ message: res.msg });
          this.getList();
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },
    /**
     * 服务开关
     */
    putSwitchEnable: function (item) {
      let status = item.enable === true ? 1 : 2;
      ApiService.putSwitchEnable(item.res_id, status).then((res) => {
        if (res.code !== 0) {
          item.enable = !item.enable;
          this.$notify({ message: res.msg });
          this.getList();
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },
  },
  watch: {
    serviceParams: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.addNode {
  font-size: 14px;
  i {
    line-height: 17px;
    margin-right: 5px;
  }
}

.icon-xiugai {
  cursor: pointer;
}

.md-gutter {
  margin-top: -5px;
  margin-bottom: -20px;
}

</style>
