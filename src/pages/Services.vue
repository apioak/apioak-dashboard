<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">服务管理</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>协议类型</label>
                  <md-select
                    name="protocol_type"
                    id="protocol_type"
                    v-model="serviceParams.protocol"
                    md-dense
                  >
                    <md-option value="0">ALL</md-option>
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
                    name="is_enable"
                    id="is_enable"
                    v-model="serviceParams.is_enable"
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
                    v-model="serviceParams.search"
                    type="text"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item text-right">
                <md-button
                  class="md-raised md-success addNode"
                  @click="drawerService('')"
                ><i class="iconfont icon-addNode" /> 新增服务</md-button
                >
              </div>
            </div>
            <md-table v-model="serviceList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID/名称">
                  <router-link :to="{ name: 'ServiceDetail', params: { service_id: item.id } }">
                    {{ item.id }}
                  </router-link><br />
                  <span v-if="!item.edit_name">
                    {{ item.name }}
                    <i
                      class="iconfont icon-xiugai"
                      @click="editServiceName(item)"
                    />
                  </span>
                  <md-field class="field-edit-name" v-else>
                    <md-input
                      v-model="item.name"
                      @blur="saveServiceName(item)"
                    />
                  </md-field>
                </md-table-cell>
                <md-table-cell md-label="域名">
                  <div style="cursor: pointer">
                    {{item.service_domains[0]}}<span v-if="Object.keys(item.service_domains).length > 1">...</span>
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
                <md-table-cell md-label="协议">{{
                  item.protocol | protocolName
                }}</md-table-cell>
                <md-table-cell md-label="负载均衡">{{
                  item.load_balance | loadBalanceName
                }}</md-table-cell>
                <md-table-cell md-label="健康检查">
                  <md-switch
                    class="md-primary"
                    v-model="item.health_check"
                    @change="putSwitchHealthCheck(item)"
                  ></md-switch>
                </md-table-cell>
                <md-table-cell md-label="WebSocket">
                  <md-switch
                    v-model="item.web_socket"
                    @change="putSwitchWebsocket(item)"
                    class="md-primary"
                  ></md-switch>
                </md-table-cell>
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
                  <router-link
                    :to="{
                      name: 'ServiceRoute',
                      params: { service_id: item.id },
                    }"
                  ><i class="iconfont icon-lianjie">
                    <md-tooltip md-direction="top">路由</md-tooltip>
                  </i>
                  </router-link>
                  <i
                    class="iconfont icon-xiugai"
                    @click="drawerService(item.id)"
                  ><md-tooltip md-direction="top">修改</md-tooltip></i>
                  <i
                    class="iconfont icon-shanchu"
                    @click="deleteService(item.id)"
                  ><md-tooltip md-direction="top">删除</md-tooltip></i>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <Pager
              v-if="total > 0"
              :pageSize="serviceParams.page_size"
              :current-page="serviceParams.page"
              :totals="total"
              @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>

    <Drawer
      :title="currentServiceId ? '编辑服务' : '新增服务'"
      width="500px"
      v-if="isShow"
      :display.sync="drawerDisplay"
      :inner="true"
    >
      <ServiceModify
        v-if="isShow"
        @closeDrawer="drawerDisplay = false"
        :serviceId="currentServiceId"
        @saveHandle="saveHandle"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import Drawer from "../components/Common/Drawer";
import ServiceModify from "./Service/Modify";
import ApiService from "../api/ApiService";
import ApiRoute from "../api/ApiRoute";

export default {
  components: {
    Drawer,
    Pager,
    ServiceModify,
  },
  data() {
    return {
      country: null,
      drawerDisplay: false,
      serviceParams: {
        protocol: "",
        is_enable: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      serviceList: [],
      total: 0,
      currentServiceId: "",
      isShow: true,
      active: false,
    };
  },
  mounted() {
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
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
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
            item.health_check = item.health_check === 1;
            item.web_socket = item.web_socket === 1;
            item.is_release = item.is_release === 1;
            item.is_enable = item.is_enable === 1;
            item.edit_name = false;
          });
        }
      });
    },
    /**
     * 打开service的编辑
     */
    drawerService: function (id = "add") {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentServiceId = id;
      this.drawerDisplay = true;
    },
    /**
     * 修改名称
     */
    editServiceName: function (item) {
      item.edit_name = true;
      this.$forceUpdate();
    },
    saveServiceName: function (item) {
      ApiService.putName(item.id, item.name).then((res) => {
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
     * 删除
     */
    deleteService: function (id) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除服务？",
        })
        .then(() => {
          ApiService.delete(id).then((res) => {
            if (res.code === 0) {
              this.getList();
            } else {
              this.$notify({ message: res.msg });
            }
          });
        });
    },
    /**
     * 健康检查
     */
    putSwitchHealthCheck: function (item) {
      let status = item.health_check === true ? 1 : 2;
      ApiService.putSwitchHealthCheck(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.health_check = !item.health_check;
          this.$notify({ message: res.msg });
        } else {
          item.is_release = false;
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },
    /**
     * Websocket
     */
    putSwitchWebsocket: function (item) {
      let status = item.web_socket === true ? 1 : 2;
      ApiService.putSwitchWebsocket(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.web_socket = !item.web_socket;
          this.$notify({ message: res.msg });
        } else {
          item.is_release = false;
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },
    /**
     * 服务发布
     */
    putSwitchRelease: function (item) {
      let status = item.is_release === true ? 1 : 2;
      ApiService.putSwitchRelease(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_release = !item.is_release;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },
    /**
     * 服务开关
     */
    putSwitchEnable: function (item, index) {
      let status = item.is_enable === true ? 1 : 2;
      ApiService.putSwitchEnable(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_enable = !item.is_enable;
          this.$notify({ message: res.msg });
        } else {
          item.is_release = false;
          this.$notify({ message: res.msg, type: "success" });
        }
      });
    },
    closeDrawer: function () {
      this.drawerDisplay = false;
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
</style>
