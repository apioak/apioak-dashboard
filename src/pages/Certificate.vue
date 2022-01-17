<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <list-header :sidebar-item-color="sidebarBackground" icon="icon-zhengshu-copy" title="证书管理" title_href="Certificate"/>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>启用状态</label>
                  <md-select
                    name="is_enable"
                    id="is_enable"
                    v-model="certParams.is_enable"
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
                  <md-input v-model="certParams.search"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item text-right">
                <md-button
                  class="md-raised md-primary addNode"
                  @click="drawerCertificate('')"
                  ><i class="iconfont icon-addNode" /> 新增证书</md-button
                >
              </div>
            </div>
          </md-card-content>
        </md-card>

        <md-card>
          <md-card-content>
            <md-table v-model="certificateList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="服务名称">{{
                  item.sni
                }}</md-table-cell>
                <md-table-cell md-label="过期时间">{{
                  item.expired_at | formatTime
                }}</md-table-cell>
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
                  <i
                    class="iconfont icon-xiugai"
                    @click="drawerCertificate(item.id)"
                  ><md-tooltip md-direction="top">修改</md-tooltip></i>
                  <i
                    class="iconfont icon-shanchu"
                    @click="deleteCertificate(item.id)"
                  ><md-tooltip md-direction="top">删除</md-tooltip></i>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <Pager
              v-if="total > 0"
              :pageSize="certParams.page_size"
              :current-page="certParams.page"
              :totals="total"
              @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>
    <Drawer
      title="新增证书"
      :display.sync="drawerDisplay"
      :inner="true"
      width="700px"
    >
      <CertificateModify
        v-if="isShow"
        @closeDrawer="drawerDisplay = false"
        :certificateId="currentCertificateId"
        @saveHandle="saveHandle"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import Drawer from "../components/Common/Drawer";
import ListHeader from "../components/Common/ListHeader";
import CertificateModify from "./Certificate/Modify";
import ApiCertificate from "../api/ApiCertificate";
import ApiRoute from "../api/ApiRoute";

export default {
  components: {
    Drawer,
    Pager,
    ListHeader,
    CertificateModify,
  },
  data() {
    return {
      certParams: {
        is_enable: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      certificateList: [],
      total: 0,
      isShow: true,
      drawerDisplay: false,
      currentCertificateId: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    handleCurrentChange: function (page) {
      this.certParams.page = page.currentPage;
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      ApiCertificate.getList(this.certParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.certificateList = res.data["data"];
          this.certificateList.forEach(function (item) {
            item.is_release = item.is_release === 1;
            item.is_enable = item.is_enable === 1;
          });
        }
      });
    },
    /**
     * 证书发布
     */
    putSwitchRelease: function (item) {
      let status = item.is_release === true ? 1 : 2;
      ApiCertificate.putSwitchRelease(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_release = !item.is_release;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "primary" });
        }
      });
    },
    /**
     * 证书开关
     */
    putSwitchEnable: function (item) {
      let status = item.is_enable === true ? 1 : 2;
      ApiCertificate.putSwitchEnable(item.id, status).then((res) => {
        if (res.code !== 0) {
          item.is_enable = !item.is_enable;
          this.$notify({ message: res.msg });
        } else {
          item.is_release = false;
          this.$notify({ message: res.msg, type: "primary" });
        }
      });
    },
    drawerCertificate: function (id) {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentCertificateId = id;
      this.drawerDisplay = true;
    },
    deleteCertificate: function (id) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除证书？",
        })
        .then(() => {
          ApiCertificate.delete(id).then((res) => {
            if (res.code === 0) {
              this.getList();
            } else {
              this.$notify({ message: res.msg });
            }
          });
        });
    },
  },
  watch: {
    certParams: {
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
.md-gutter {
  margin-top: -5px;
  margin-bottom: -20px;
}
</style>
