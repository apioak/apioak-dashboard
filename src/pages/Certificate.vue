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
                  <md-select  md-dense v-model="certParams.enable" id="certParams.enable" name="certParams.enable">
                    <md-option value="0">全部</md-option>
                    <md-option value="1">启用</md-option>
                    <md-option value="2">停用</md-option>
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
            <md-table>
              <md-table-row class="md-head">
                <md-table-head>ID</md-table-head>
                <md-table-head>域名</md-table-head>
                <md-table-head>过期时间</md-table-head>
                <md-table-head>启用</md-table-head>
                <md-table-head>操作</md-table-head>
              </md-table-row>

              <md-table-row v-for="(item, index) in certificateList" :key="index">
                <md-table-cell>
                  {{ item.res_id }}
                </md-table-cell>
                <md-table-cell>
                  {{ item.sni }}
                </md-table-cell>
                <md-table-cell v-if="newTimeStamp > item.expired_at" class="color-red">
                  {{ item.expired_at | formatTime }}
                </md-table-cell>
                <md-table-cell v-else>
                  {{ item.expired_at | formatTime }}
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
                    class="iconfont icon-xiugai"
                    @click="drawerCertificate(item)"
                  ><md-tooltip md-direction="top">修改</md-tooltip></i>
                  <i
                    class="iconfont icon-shanchu"
                    @click="deleteCertificate(item)"
                  ><md-tooltip md-direction="top">删除</md-tooltip></i>
                </md-table-cell>
              </md-table-row>

            </md-table>

            <Pager
              v-if="total > 0"
              :pageSize="page_size"
              :current-page="page"
              :totals="total"
              @current-change="handleCurrentChange"
              :tab="isTab"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>
    <Drawer
      :title="currentCertificateId ? '编辑证书' : '新增证书'"
      :display.sync="drawerDisplay"
      :inner="true"
      width="700px"
    >
      <CertificateModify
        v-if="isShow"
        @closeDrawer="drawerDisplay = false"
        :certificateResId="currentCertificateId"
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
        enable: null,
        search: "",
      },
      page: 1,
      page_size: 2,
      certificateList: [],
      total: 0,
      isTab: false,
      isShow: true,
      drawerDisplay: false,
      currentCertificateId: "",
      newTimeStamp: 0,
      sidebarBackground: "blue",
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
      this.page = page.currentPage;
      this.getList()
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      let params = JSON.parse(JSON.stringify(this.certParams));
      params.page = this.page
      params.page_size = this.page_size

      ApiCertificate.getList(params).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.certificateList = res.data["data"];
          this.certificateList.forEach(function (item) {
            item.enable = item.enable === 1;
          });
          this.newTimeStamp = Math.floor(new Date().getTime() / 1000);
        }
      });
    },

    /**
     * 证书开关
     */
    putSwitchEnable: function (item) {
      let status = item.enable === true ? 1 : 2;
      ApiCertificate.putSwitchEnable(item.res_id, status).then((res) => {
        if (res.code !== 0) {
          item.enable = !item.enable;
          this.$notify({ message: res.msg });
        } else {
          this.$notify({ message: res.msg, type: "primary" });
          this.getList();
        }
      });
    },

    /**
     * 证书编辑
     * @param item
     */
    drawerCertificate: function (item) {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentCertificateId = item.res_id;
      this.drawerDisplay = true;
    },

    /**
     * 证书删除
     * @param item
     */
    deleteCertificate: function (item) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除证书？",
        })
        .then(() => {
          ApiCertificate.delete(item.res_id).then((res) => {
            if (res.code === 0) {
              this.$notify({ message: res.msg, type: "primary" });
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
        this.page = 1;
        this.currentPage = 1;
        this.getList();
        this.isTab = true;
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
