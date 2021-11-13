<template>
  <div class="content">
    <div class="md-layout">
      <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">证书管理</h4>
          </md-card-header>
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
              <div class="md-layout-item">
                <md-button
                    class="md-raised md-success addNode"
                    @click="drawerCertificate('')"
                ><i class="iconfont icon-addNode" /> 新增证书</md-button
                >
              </div>
            </div>
            <md-table v-model="certificateList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="服务名称">{{
                    item.sni
                  }}</md-table-cell>
                <md-table-cell md-label="过期时间">{{
                    item.expired_at | formatTime
                  }}</md-table-cell>
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
                  />
                  <i
                      class="iconfont icon-shanchu"
                      @click="deleteCertificate(item.id)"
                  />
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
        :mask="false"
        width="500px"
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
import CertificateModify from "./Certificate/Modify";
import ApiCertificate from "../api/ApiCertificate";

export default {
  components: {
    Drawer,
    Pager,
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
            item.is_enable = item.is_enable === 1;
          });
        }
      });
    },
    /**
     * 证书开关
     */
    putSwitchEnable: function (item) {
      let status = item.is_enable === true ? 1 : 2;
      ApiCertificate.putSwitchEnable(item.id, status).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: "修改成功", type: "success" });
        } else {
          this.$notify({ message: res.msg });
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
</style>
