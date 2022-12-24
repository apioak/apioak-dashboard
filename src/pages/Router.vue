<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <list-header :sidebar-item-color="sidebarBackground" icon="icon-lianjie" title="路由管理" title_href="Router"/>
          <md-card-content>
            <div class="md-layout md-gutter">

              <div class="md-layout-item">
                <md-field>
                  <label>所属服务</label>
                  <md-select
                      name="bind_service"
                      id="bind_service"
                      v-model="routerParams.service_res_id"
                      md-dense
                  >
                    <md-option value="0">全部</md-option>
                    <md-option v-for="(item, index) in serviceNameList" :key="index" :value=item.res_id >{{ item.name }}</md-option>
                  </md-select>
                </md-field>
              </div>

              <div class="md-layout-item">
                <md-field>
                  <label>启用状态</label>
                  <md-select
                      name="enable"
                      id="enable"
                      v-model="routerParams.enable"
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
                    v-model="routerParams.release"
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
                      v-model="routerParams.search"
                      type="text"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item text-right">
                <md-button
                    class="md-raised md-primary addNode"
                    @click="drawerRouter('')"
                ><i class="iconfont icon-addNode"/> 新增路由
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
                <md-table-head>服务</md-table-head>
                <md-table-head>方法</md-table-head>
                <md-table-head>路径</md-table-head>
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

              <md-table-row v-for="(item, index) in routerList" :key="index">
                <md-table-cell>
                  <span class="font-link-color" @click="drawerRouter(item.res_id)">
                    {{ item.res_id }}
                  </span>

                  <br/>
                  <span v-if="!item.edit_name">
                    {{ item.router_name }}
                    <i
                        class="iconfont icon-xiugai"
                        @click="editRouterName(item)"
                    >
                      <md-tooltip md-direction="top">修改名称</md-tooltip>
                    </i>
                  </span>
                  <md-field class="field-edit-name" v-else>
                    <md-input
                        v-model="item.router_name"
                        @blur="saveRouterName(item)"
                    />
                  </md-field>
                </md-table-cell>
                <md-table-cell>
                  {{item.service_name }}
                </md-table-cell>
                <md-table-cell>
                  <span v-for="(method, index) in item.request_methods" :key="index">
                    <el-tag v-if="method === `ALL`" class="font-block background-color-black"> {{ method }} </el-tag>
                    <el-tag v-if="method === `GET`" class="font-block background-color-green"> {{ method }} </el-tag>
                    <el-tag v-if="method === `POST`" class="font-block background-color-orange"> {{ method }} </el-tag>
                    <el-tag v-if="method === `PUT`" class="font-block background-color-blue"> {{ method }} </el-tag>
                    <el-tag v-if="method === `DELETE`" class="font-block background-color-red"> {{ method }} </el-tag>
                    <el-tag v-if="method === `OPTIONS`" class="font-block background-color-purple"> {{ method }} </el-tag>
                  </span>
                </md-table-cell>
                <md-table-cell>
                  {{item.router_path }}
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
                      @click="drawerRouterPlugin(item.res_id)"
                      href="javascript:void(0);"
                  >
                    <i class="iconfont icon-chajiangongneng">
                      <md-tooltip md-direction="top">插件</md-tooltip>
                    </i>
                  </a>
                  <i
                    class="iconfont icon-xiugai"
                    @click="drawerRouter(item)"
                  >
                    <md-tooltip md-direction="top">修改</md-tooltip>
                  </i>
                  <i
                    class="iconfont icon-shanchu"
                    @click="deleteRouter(item)"
                  >
                    <md-tooltip md-direction="top">删除</md-tooltip>
                  </i>
                </md-table-cell>
              </md-table-row>

            </md-table>
            <Pager
              v-if="total > 0"
              :pageSize="routerParams.page_size"
              :current-pages=currentPage
              :totals="total"
              @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>

    <Drawer
        :title="currentRouterResId ? '路由编辑' : '新增路由'"
        :display.sync="drawerRouterDisplay"
        width="700px"
        :inner="true"
        @refreshList = "refreshList"
    >
      <RouteModify
          v-if="isDrawerRouterShow"
          :serviceId="serviceId"
          :routeId="currentRouterResId"
          :isCopy="isCopyRoute"
          @closeDrawer="drawerRouterDisplay = false"
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
          v-if="isDrawerPluginShow"
          :serviceId="serviceId"
          :routeId="currentRouterResId"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import ListHeader from "../components/Common/ListHeader";
import Drawer from "../components/Common/Drawer";
import RouteModify from "./Route/Modify";
import ApiService from "../api/ApiService";
import ApiRouter from "../api/ApiRouter";

export default {
  components: {
    ListHeader,
    Drawer,
    Pager,
    RouteModify
  },
  data() {
    return {
      sidebarBackground: "blue",
      country: null,
      drawerDisplay: false,
      routerParams: {
        service_res_id: this.$route.params.service_res_id,
        enable: "",
        release: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      routerList: [],
      serviceNameList: [],
      total: 0,
      currentRouterResId: "",
      drawerRouterDisplay: false,
      drawerPluginDisplay: false,
      isDrawerRouterShow: true,
      isDrawerPluginShow: true,
    };
  },
  computed: {
    currentPage () {
      return parseInt(this.$store.state.currentPage);
    }
  },
  mounted() {
    this.routerParams.page = this.$store.state.currentPage;
    // 获取服务名称列表用于筛选
    this.getServiceNameList();

    //获取路由列表
    this.getList();
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    handleCurrentChange: function (page) {
      this.routerParams.page = page.currentPage;
      this.$store.commit("setCurrentPage", page.currentPage);
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      ApiRouter.getList(this.routerParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.routerList = res.data["data"];
          this.routerList.forEach(function (item) {
            item.enable = item.enable === 1;
            item.edit_name = false;
            if (item.plugin_list.length > 0) {
              item.plugin_list.forEach((value, index) => {
                if ((value.enable === 1) && (value.release === 3)) {
                  value.color = "color-plugin-" + value.type;
                } else {
                  value.color = "color-plugin-0";
                }
                if (value.icon.length === 0) {
                  value.icon = "icon-apex_plugin1";
                }
              });
            }
          });
        }
      });
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
     * 打开router的编辑
     */
    drawerRouter: function (item) {
      this.isDrawerRouterShow = false; //销毁组件
      this.$nextTick(() => {
        this.isDrawerRouterShow = true; //重建组件
      });
      this.currentRouterResId = item.res_id;
      this.drawerRouterDisplay = true;
      this.getList();
    },
    drawerRouterPlugin: function (item) {
      this.isDrawerPluginShow = false; //销毁组件
      this.$nextTick(() => {
        this.isDrawerPluginShow = true; //重建组件
      });
      this.currentRouterResId = item.res_id;
      this.drawerPluginDisplay = true;
      this.getList();
    },
    /**
     * 修改名称
     */
    editRouterName: function (item) {
      item.edit_name = true;
      this.$forceUpdate();
    },
    saveRouterName: function (item) {
      ApiRouter.putName(item.service_res_id, item.res_id, item.router_name).then((res) => {
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
    deleteRouter: function (item) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除服务？",
        })
        .then(() => {
          ApiRouter.delete(item.service_res_id, item.res_id).then((res) => {
            if (res.code === 0) {
              this.getList();
            } else {
              this.$notify({ message: res.msg });
            }
          });
        });
    },
    /**
     * 路由发布
     */
    putSwitchRelease: function (item) {
      ApiRouter.putSwitchRelease(item.service_res_id, item.res_id).then((res) => {
        if (res.code !== 0) {
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },
    /**
     * 路由开关
     */
    putSwitchEnable: function (item) {
      let status = item.enable === true ? 1 : 2;
      ApiRouter.putSwitchEnable(item.service_res_id, item.res_id, status).then((res) => {
        if (res.code !== 0) {
          item.enable = !item.enable;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },
    closeDrawer: function () {
      this.drawerDisplay = false;
    },
  },
  watch: {
    routerParams: {
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
