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
                    <md-option value="0">ALL</md-option>
                    <md-option value="1">ON</md-option>
                    <md-option value="2">OFF</md-option>
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
            <md-table v-model="routeList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID/名称">
                  {{ item.id }}<br />
                  <span v-if="!item.edit_name">
                    {{ item.route_name }}
                    <i
                        class="iconfont icon-xiugai"
                        @click="editRouteName(item)"
                    />
                  </span>
                  <md-field class="field-edit-name" v-else>
                    <md-input
                        v-model="item.route_name"
                        @blur="saveRouteName(item)"
                    />
                  </md-field>
                </md-table-cell>
                <md-table-cell md-label="方法">
                  <md-button
                      class="md-icon-button md-primary"
                      v-for="(method, index) in item.request_methods"
                      :key="index"
                  >
                    {{ method }}
                  </md-button>
                </md-table-cell>
                <md-table-cell md-label="路径">{{
                    item.route_path
                  }}</md-table-cell>
                <md-table-cell md-label="插件"></md-table-cell>
                <md-table-cell md-label="发布">
                  <md-switch
                      v-if="!item.is_release"
                      v-model="item.is_release"
                      @change="putSwitchRelease(item)"
                      class="md-primary"
                  ></md-switch>
                  <md-button class="md-icon-button md-primary" v-else
                  >已发布</md-button
                  >
                </md-table-cell>
                <md-table-cell md-label="启用">
                  <md-switch
                      v-model="item.is_enable"
                      @change="putSwitchEnable(item)"
                      class="md-primary"
                  ></md-switch>
                </md-table-cell>
                <md-table-cell md-label="操作" class="list_manage">
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
        width="700px"
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
            item.is_release = item.is_release === 1;
            item.is_enable = item.is_enable === 1;
            item.edit_name = false;
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
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },
    /**
     * 路由发布
     */
    putSwitchRelease: function (item) {
      let status = item.is_release === true ? 1 : 2;
      ApiRoute.putSwitchRelease(this.serviceId, item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_release = !item.is_release;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "success" });
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
          item.is_release = false;
          this.$notify({ message: res.msg, type: "success" });
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
    },
    drawerRoutePlugIn: function (routeId) {
      this.isDrawerPlugInShow = false; //销毁组件
      this.$nextTick(() => {
        this.isDrawerPlugInShow = true; //重建组件
      });
      this.currentRouteId = routeId;
      this.drawerPlugInDisplay = true;
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
