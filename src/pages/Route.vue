<template>
  <div class="content">
    <div class="md-layout">
      <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <list-header :sidebar-item-color="sidebarBackground" icon="icon-lianjie" :title="serviceId" title_href="ServiceDetail"/>
          <md-card-content>
            <div class="service_tab">
              <router-link :to="{ name: 'ServiceDetail', params: { service_id: serviceId } }"
              >服务详情</router-link
              >
              <a class="tab_active" href="javascript:void(0);">路由列表</a>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>启用状态</label>
                  <md-select
                      name="is_enable"
                      id="is_enable"
                      v-model="searchParams.is_enable"
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
                  <label>搜索内容</label>
                  <md-input
                      v-model="searchParams.search"
                      type="text"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item text-right">
                <md-button
                    class="md-raised md-primary addNode"
                    @click="drawerRoute('')"
                ><i class="iconfont icon-addNode" /> 新增路由</md-button
                >
              </div>
            </div>
          </md-card-content>
        </md-card>

        <md-card>
          <md-card-content>
            <md-table>
              <md-table-row class="md-head">
                <md-table-head>ID/名称</md-table-head>
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

              <md-table-row v-for="(item, index) in routeList" :key="index">
                <md-table-cell>
                  {{ item.id }}<br />
                  <span v-if="!item.edit_name">
                    {{ item.route_name }}
                    <i
                        class="iconfont icon-xiugai"
                        @click="editRouteName(item)"
                    >
                      <md-tooltip md-direction="top">修改名称</md-tooltip>
                    </i>
                  </span>
                  <md-field class="field-edit-name" v-else>
                    <md-input
                        v-model="item.route_name"
                        @blur="saveRouteName(item)"
                    />
                  </md-field>
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
                <md-table-cell>{{
                    item.route_path
                  }}</md-table-cell>
                <md-table-cell>
                  <i v-for="(plugin, index) in item.plugin_list" :key="index" class="iconfont" :class="[plugin.icon, plugin.color]" style="margin: 2px;">
                    <md-tooltip md-direction="top">{{ plugin.name }}</md-tooltip>
                  </i>
                </md-table-cell>
                <md-table-cell>
                  <span v-if="item.release_status === 1" class="color-grey font-bold">未发布</span>
                  <span v-if="item.release_status === 2" class="color-orange font-bold">待发布</span>
                  <span v-if="item.release_status === 3" class="color-green font-bold">已发布</span>
                </md-table-cell>
                <md-table-cell>
                  <md-switch
                      v-model="item.is_enable"
                      @change="putSwitchEnable(item)"
                      class="md-primary"
                  ></md-switch>
                </md-table-cell>
                <md-table-cell class="list_manage">
                  <i
                      v-if="item.release_status !== 3"
                      @click="putSwitchRelease(item)"
                      class="iconfont icon-yuntongbu"
                  >
                    <md-tooltip md-direction="top">发布</md-tooltip>
                  </i>
                  <a
                      @click="drawerRoutePlugIn(item.id)"
                      href="javascript:void(0);"
                  >
                    <i class="iconfont icon-chajiangongneng">
                      <md-tooltip md-direction="top">插件</md-tooltip>
                    </i>
                  </a>
                  <a
                      href="javascript:void(0);"
                      @click="drawerRoute(item.id, true)"
                  >
                    <i class="iconfont icon-fuzhi">
                      <md-tooltip md-direction="top">复制</md-tooltip>
                    </i>
                  </a>
                  <i
                      class="iconfont icon-xiugai"
                      @click="drawerRoute(item.id)"
                  ><md-tooltip md-direction="top">修改</md-tooltip></i>
                  <i
                      class="iconfont icon-shanchu"
                      @click="deleteRoute(item.id)"
                  ><md-tooltip md-direction="top">删除</md-tooltip></i>
                </md-table-cell>
              </md-table-row>
            </md-table>

            <Pager
                v-if="total > 0"
                :pageSize="searchParams.page_size"
                :current-page="searchParams.page"
                :totals="total"
                @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>

    <Drawer
        :title="currentRouteId ? '路由编辑' : '新增路由'"
        :display.sync="drawerRouteDisplay"
        width="700px"
        :inner="true"
    >
      <RouteModify
          v-if="isDrawerRouteShow"
          :serviceId="serviceId"
          :routeId="currentRouteId"
          :isCopy="isCopyRoute"
          @closeDrawer="drawerRouteDisplay = false"
          @saveHandle="saveHandle"
      />
    </Drawer>
    <Drawer
        title="插件列表"
        :display.sync="drawerPlugInDisplay"
        :inner="true"
        width="830px"
    >
      <PlugInList
          v-if="isDrawerPlugInShow"
          :serviceId="serviceId"
          :routeId="currentRouteId"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import Drawer from "../components/Common/Drawer";
import ListHeader from "../components/Common/ListHeader";
import RouteModify from "./Route/Modify";
import PlugInList from "./PlugIn/List";
import ApiRoute from "../api/ApiRoute";
import ApiService from "../api/ApiService";

export default {
  components: {
    Drawer,
    Pager,
    RouteModify,
    ListHeader,
    PlugInList,
  },
  data() {
    return {
      serviceId: "",
      searchParams: {
        is_enable: null,
        search: "",
        page: 1,
        page_size: 10,
      },
      total: 0,
      routeList: [],
      currentRouteId: "",
      drawerRouteDisplay: false,
      drawerPlugInDisplay: false,
      isCopyRoute: false,
      isDrawerRouteShow: true,
      isDrawerPlugInShow: true,
      sidebarBackground: "blue",
    };
  },
  mounted() {
    this.getRouteParams();
    this.getList();
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    handleCurrentChange: function (page) {
      this.searchParams.page = page.currentPage;
      this.$store.commit("currentPage", page.currentPage);
    },
    saveHandle: function () {
      this.drawerRouteDisplay = false;
      this.getList();
    },
    /**
     * 获取分页数据
     */
    getList() {
      ApiRoute.getList(this.serviceId, this.searchParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.routeList = res.data["data"];
          this.routeList.forEach(function (item) {
            item.is_enable = item.is_enable === 1;
            item.edit_name = false;
            if (item.plugin_list.length > 0) {
              item.plugin_list.forEach((value, index) => {
                if ((value.is_enable === 1) && (value.release_status === 3)) {
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
    editRouteName: function (item) {
      item.edit_name = true;
      this.$forceUpdate();
    },
    saveRouteName: function (item) {
      ApiRoute.putName(this.serviceId, item.id, item.route_name).then((res) => {
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
     * 路由发布
     */
    putSwitchRelease: function (item) {
      ApiRoute.putSwitchRelease(this.serviceId, item.id).then((res) => {
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
      let status = item.is_enable === true ? 1 : 2;
      ApiRoute.putSwitchEnable(this.serviceId, item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_enable = !item.is_enable;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },
    drawerRoute: function (id = "", isCopy = false) {
      this.isDrawerRouteShow = false; //销毁组件
      this.$nextTick(() => {
        this.isDrawerRouteShow = true; //重建组件
      });
      this.currentRouteId = id;
      this.isCopyRoute = isCopy;
      this.drawerRouteDisplay = true;
      this.getList();
    },
    drawerRoutePlugIn: function (routeId) {
      this.isDrawerPlugInShow = false; //销毁组件
      this.$nextTick(() => {
        this.isDrawerPlugInShow = true; //重建组件
      });
      this.currentRouteId = routeId;
      this.drawerPlugInDisplay = true;
      this.getList();
    },
    /**
     * 删除
     */
    deleteRoute: function (id) {
      this.$dialog
          .modal({
            title: "提示",
            content: "确认要删除路由？",
          })
          .then(() => {
            ApiRoute.delete(this.serviceId, id).then((res) => {
              if (res.code === 0) {
                this.$notify({ message: res.msg, type: "primary" });
                this.getList();
              } else {
                this.$notify({ message: res.msg });
              }
            });
          });
    },
    //获取路由传参数据
    getRouteParams: function () {
      let params = this.$route.params;
      let name = this.$route.name;
      if (Object.keys(params).length === 0) {
        params = this.$store.state.routerParams[name];
      } else {
        this.$store.commit("setRouterParams", { name: name, params: params });
      }
      this.serviceId = params.service_id;
    },
  },
  watch: {
    searchParams: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.list_manage {
  i {
    font-size: 20px;
    margin-right: 8px;
    cursor: pointer;
  }
  i.icon-shanchu {
    color: red;
  }
}
.addNode {
  font-size: 14px;
  i {
    line-height: 17px;
    margin-right: 5px;
  }
}
.service_tab {
  width: 100%;
  border-bottom: 1px solid #c8c8c8;
  margin-bottom: 20px;
  a {
    color: #c8c8c8 !important;
    font-size: 16px;
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  a.tab_active,
  a:hover {
    color: #1e88e5 !important;
    border-bottom: 2px solid #1e88e5;
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
