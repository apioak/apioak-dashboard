<template>
  <div>
    <el-drawer
      class="service-drawer"
      :title="title"
      :visible.sync="pluginDrawer"
      :direction="direction"
      :with-header="false"
      size="50%"
    >
      <p class="service-drawer_tit">
        <span v-html="title"></span>
        <i class="el-icon-close fr" @click="pluginDrawer = false"></i>
      </p>
      <el-button
        type="primary"
        size="small"
        v-if="!showAddPlugins"
        style="margin-right:32px;"
        class="fr"
        @click="addPlugin"
      >添加</el-button>
      <div style="background:#fafafa;padding:12px;" v-if="showAddPlugins">
        <h3
          style="font-size:16px;font-weight:bold;margin-bottom:20px;margin-left:12px;"
        >{{ pluginText }}</h3>
        <el-form
          label-width="160px"
          ref="pluginForm"
          v-model="pluginForm"
          :rules="pluginRules"
          size="small"
        >
          <el-form-item label="conn" prop="conn">
            <el-input-number v-model="pluginForm.config.conn"></el-input-number>
          </el-form-item>
          <el-form-item label="burst" prop="burst">
            <el-input-number v-model="pluginForm.config.burst"></el-input-number>
          </el-form-item>
          <el-form-item label="key" prop="key">
            <el-select v-model="pluginForm.config.key">
              <el-option label="remote_addr" value="remote_addr"></el-option>
              <el-option label="server_addr" value="server_addr"></el-option>
              <el-option label="http_x_real_ip" value="http_x_real_ip"></el-option>
              <el-option label="http_x_forwarded_for" value="http_x_forwarded_for"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="default_conn_delay" prop="default_conn_delay">
            <el-input-number v-model="pluginForm.config.default_conn_delay"></el-input-number>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="pluginForm.config.desc"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-left:160px;">
          <el-button type="primary" plain size="small" @click="savePlugin('pluginForm')">提交</el-button>
          <el-button plain size="small" @click="cancelPlugin('pluginForm')">取消</el-button>
        </div>
      </div>
      <div style="padding:0 32px;margin-top:24px;">
        <el-table :data="curServicePlugins">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand" size="small">
                <el-form-item label="conn">
                  <span>{{ props.row.conn }}</span>
                </el-form-item>
                <el-form-item label="burst">
                  <span>{{ props.row.burst }}</span>
                </el-form-item>
                <el-form-item label="key">
                  <span>{{ props.row.key }}</span>
                </el-form-item>
                <el-form-item label="default_conn_delay">
                  <span>{{ props.row.default_conn_delay }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="配置名称" prop="name"></el-table-column>
          <el-table-column label="描述" prop="desc"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain @click="editPlugin(scope)">编辑</el-button>
              <el-button type="danger" size="mini" plain @click="delPlugin(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-dialog title="插件列表" :visible.sync="allPluginList">
      <el-row :gutter="20">
        <el-col
          v-for="(item,index) in pluginsList"
          :key="`plu${index}`"
          :span="8"
          style="margin-bottom:20px"
        >
          <el-card shadow="hover" class="plugin-card">
            <h3>{{ item.name }}</h3>
            <p>{{ item.desc }}</p>
            <el-button
              type="primary"
              size="small"
              @click="pluginForm.key = item.key,showAddPlugins = true,pluginText = `添加 ${item.key} 插件`,allPluginList = false"
            >添加</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      direction: "rtl",
      pluginDrawer: false,
      allPluginList: false,
      pluginsList: [], // 所有插件列表
      pluginText: "",
      curServicePlugins: [],
      pluginForm: {
        key: "",
        config: {
          conn: "",
          burst: "",
          key: "",
          default_conn_delay: "",
          desc: ""
        }
      }
    };
  },
  methods: {
    /**
     * 查看服务插件
     */
    showServicePlugins(scope) {
      this.curServicePlugins = [];
      this.pluginDrawer = true;
      this.curServiceId = this.serviceListIds[scope.$index];
      for (let i in scope.row.plugins) {
        scope.row.plugins[i]["name"] = i;
        this.curServicePlugins.push(scope.row.plugins[i]);
      }
      this.title = `${scope.row.name} 插件列表`;
    },
    async addPlugin() {
      this.allPluginList = true;
      const { status, data } = await this.$http.get(api.pluginList);
      if (status == 200) {
        this.pluginsList = data;
      }
    },
    /**
     * 编辑plugin
     */
    editPlugin(scope) {
      this.showAddPlugins = true;
      this.pluginText = `编辑 ${scope.row.name} 插件`;
      this.pluginForm = {
        key: scope.row.name,
        config: {
          conn: scope.row.conn,
          burst: scope.row.burst,
          key: scope.row.key,
          default_conn_delay: scope.row.default_conn_delay,
          desc: scope.row.desc || ""
        }
      };
    },
    /**
     * 取消保存
     */
    cancelPlugin(scope) {
      this.showAddPlugins = false;
      // this.$refs[scope].resetFields();
    },
    /**
     * 保存服务插件
     */
    async savePlugin(scope) {
      const { status, data } = await this.$http.post(
        api.saveServicePlugin(this.curServiceId),
        this.pluginForm
      );
      if (status == 200) {
        this.curServicePlugins = [];
        for (let i in data.value.plugins) {
          data.value.plugins[i]["name"] = i;
          this.curServicePlugins.push(data.value.plugins[i]);
        }
        this.showAddPlugins = false;
        this.pluginForm = {
          key: "",
          config: {
            conn: "",
            burst: "",
            key: "",
            default_conn_delay: "",
            desc: ""
          }
        };
      }
      // this.$refs[scope].validate(async valid => {
      //   if (valid) {

      //   }
      // });
    },
    /**
     * 删除服务插件
     */
    async delPlugin(scope) {
      this.$confirm("此操作将永久删除, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { status, data } = await this.$http.delete(
            api.delServicePlugin(this.curServiceId, scope.row.name)
          );
          if (status == 200) {
            this.$message({
              type: "success",
              message: `${scope.row.name}插件删除成功`
            });
            this.$delete(this.curServicePlugins, scope.$index);
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scpoed>
</style>