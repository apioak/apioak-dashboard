<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">节点管理</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>状态</label>
                  <md-select
                    name="node_status"
                    id="node_status"
                    v-model="searchParams.node_status"
                    md-dense
                  >
                    <md-option value="0">ALL</md-option>
                    <md-option value="1">健康</md-option>
                    <md-option value="2">异常</md-option>
                  </md-select>
                </md-field>
              </div>
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
                  <md-input v-model="searchParams.search"></md-input>
                </md-field>
              </div>
            </div>
            <md-table v-model="clusterNodeList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="节点IP">{{
                  item.node_ip
                }}</md-table-cell>
                <md-table-cell md-label="状态">{{
                  item.node_status
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
                    class="iconfont icon-shanchu"
                    @click="deleteClusterNode(item.id)"
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
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import ApiClusterNode from "../api/ApiClusterNode";

export default {
  components: {
    Pager,
  },
  data() {
    return {
      searchParams: {
        node_status: "",
        is_enable: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      clusterNodeList: [],
      total: 0,
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
      this.searchParams.page = page.currentPage;
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      ApiClusterNode.getList(this.searchParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.clusterNodeList = res.data["data"];
          this.clusterNodeList.forEach(function (item) {
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
      ApiClusterNode.putSwitchEnable(item.id, status).then((res) => {
        if (res.code === 0) {
          this.$notify({ message: "修改成功", type: "success" });
        } else {
          this.$notify({ message: res.msg });
        }
      });
    },
    deleteClusterNode: function (id) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除节点？",
        })
        .then(() => {
          ApiClusterNode.delete(id).then((res) => {
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
</style>
