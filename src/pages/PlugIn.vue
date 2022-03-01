<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">插件管理</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <md-field>
                  <label>搜索内容</label>
                  <md-input v-model="plugInParams.search"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item">
                <md-button
                  class="md-raised md-primary addNode"
                  @click="drawerPlugIn('')"
                  ><i class="iconfont icon-addNode" /> 新增插件</md-button
                >
              </div>
            </div>
            <md-table v-model="plugInList">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="ID/名称"
                  >{{ item.id }}<br />{{ item.name }}</md-table-cell
                >
                <md-table-cell md-label="ICON">{{ item.icon }}</md-table-cell>
                <md-table-cell md-label="TAG">{{ item.tag }}</md-table-cell>
                <md-table-cell md-label="类型">{{
                  item.type_cn
                }}</md-table-cell>
                <md-table-cell md-label="描述">{{
                  item.description
                }}</md-table-cell>
                <md-table-cell md-label="操作" class="list_manage">
                  <i
                    class="iconfont icon-xiugai"
                    @click="drawerPlugIn(item.id)"
                  />
                  <i
                    class="iconfont icon-shanchu"
                    @click="deletePlugIn(item.id)"
                  />
                </md-table-cell>
              </md-table-row>
            </md-table>
            <Pager
              v-if="total > 0"
              :pageSize="plugInParams.page_size"
              :current-page="plugInParams.page"
              :totals="total"
              @current-change="handleCurrentChange"
            />
          </md-card-content>
        </md-card>
      </div>
    </div>
    <Drawer
      title="新增插件"
      :display.sync="drawerDisplay"
      :inner="true"
      width="700px"
    >
      <PlugInModify
        v-if="isShow"
        @closeDrawer="drawerDisplay = false"
        :plugInId="currentPlugInId"
        @saveHandle="saveHandle"
      />
    </Drawer>
  </div>
</template>

<script>
import Pager from "../components/Common/Pager";
import Drawer from "../components/Common/Drawer";
import PlugInModify from "./PlugIn/Modify";
import ApiPlugIn from "../api/ApiPlugIn";

export default {
  components: {
    Drawer,
    Pager,
    PlugInModify,
  },
  data() {
    return {
      plugInParams: {
        is_enable: "",
        search: "",
        page: 1,
        page_size: 10,
      },
      plugInList: [],
      plugInTypeList: {},
      total: 0,
      isShow: true,
      drawerDisplay: false,
      currentPlugInId: "",
    };
  },
  mounted() {
    this.getPlugInType().then(() => {
      this.getList();
    });
  },
  methods: {
    /**
     * 切换分页
     * @param page
     */
    handleCurrentChange: function (page) {
      this.plugInParams.page = page.currentPage;
    },
    saveHandle: function () {
      this.drawerDisplay = false;
      this.getList();
    },
    /**
     * 获取分页数据
     */
    getList: function () {
      ApiPlugIn.getList(this.plugInParams).then((res) => {
        if (res.code === 0) {
          this.total = res.data["total"];
          this.plugInList = res.data["data"];
          this.plugInList.forEach((item) => {
            item.is_enable = item.is_enable === 1;
            item.type_cn = this.plugInTypeList[item.type] || "";
          });
        }
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
    drawerPlugIn: function (id) {
      this.isShow = false; //销毁组件
      this.$nextTick(() => {
        this.isShow = true; //重建组件
      });
      this.currentPlugInId = id;
      this.drawerDisplay = true;
    },
    deletePlugIn: function (id) {
      this.$dialog
        .modal({
          title: "提示",
          content: "确认要删除插件？",
        })
        .then(() => {
          ApiPlugIn.delete(id).then((res) => {
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
    plugInParams: {
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
