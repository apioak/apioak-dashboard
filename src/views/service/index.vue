<template>
  <div class="service">
    <view-header name="服务"></view-header>
    <div class="service-list">
      <el-button
        class="service-add fl"
        type="primary"
        @click="editId = 0,drawer = true , title = '添加服务'"
      >新建服务</el-button>
      <el-table class="service-table" :data="serviceList">
        <el-table-column width="40px">
          <template slot-scope="scope">
            <div v-if="scope.row.plugins">
              <img
                @click="showServicePlugins(scope)"
                style="width:24px;cursor:pointer;vertical-align: middle;"
                src="../../assets/apex_plugin.png"
                alt="plugin"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务名称">
          <template slot-scope="scope">
            <el-link type="primary" @click="goDetail(scope)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="服务前缀" prop="prefix"></el-table-column>
        <el-table-column label="备注" prop="desc"></el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="small"
              style="margin-right:12px;"
              @click="editService(scope),drawer = true , title = '编辑服务'"
            >编辑</el-button>
            <el-popover width="160" placement="bottom" v-model="delPop[scope.$index]">
              <p>确认删除该服务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="cancel(scope.$index)">取消</el-button>
                <el-button type="primary" size="mini" @click="delService(scope.$index)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" plain size="small">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      class="service-drawer"
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      size="50%"
    >
      <p class="service-drawer_tit">
        <span v-html="title"></span>
        <i class="el-icon-close fr" @click="drawer = false"></i>
      </p>
      <el-form class="service-form" :rules="rules" ref="ruleForm" :model="form" label-width="80px">
        <el-form-item label="服务名称" prop="name">
          <el-input placeholder="请输入服务名称" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="URL前缀" prop="prefix">
          <el-input placeholder="请输入服务前缀" v-model="form.prefix"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col
            :span="4"
            style="padding-top:8px;font-size:16px;color:#606266;padding-right:0;"
          >upstreams</el-col>
          <el-col :span="20" style="padding-left:0;">
            <el-tabs class="service-tab" v-model="activeEnv">
              <el-tab-pane label="dev" name="dev">
                <el-form-item label="环境域名" prop="host">
                  <el-input v-model="form.upstreams.dev.host" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="Type" prop="type">
                  <el-select v-model="form.upstreams.dev.type" placeholder="请选择">
                    <el-option label="roundrobin" value="roundrobin"></el-option>
                    <el-option label="chash" value="chash"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="key" prop="key">
                  <el-input
                    type="text"
                    :disabled="form.upstreams.dev.type == 'roundrobin'"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item :inline="true" label="Node" prop="node">
                  <div v-for="(node,index) in form.upstreams.dev.nodes" style="margin-bottom:12px">
                    <el-input type="text" placeholder="IP" class="node-item" v-model="node.ip"></el-input>
                    <el-input
                      type="text"
                      placeholder="Port"
                      class="node-item"
                      v-model.number="node.port"
                    ></el-input>
                    <el-input
                      type="text"
                      placeholder="Weights"
                      class="node-item"
                      v-model.number="node.weight"
                    ></el-input>
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      @click="addNode('dev')"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-remove-outline"
                      :disabled="form.upstreams.dev.nodes.length == 1"
                      @click="delNode('dev',index)"
                    ></el-button>
                  </div>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="beta" name="beta">
                <el-form-item label="环境域名" prop="host">
                  <el-input v-model="form.upstreams.beta.host" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="Type" prop="type">
                  <el-select v-model="form.upstreams.beta.type" placeholder="请选择">
                    <el-option label="roundrobin" value="roundrobin"></el-option>
                    <el-option label="chash" value="chash"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="key" prop="key">
                  <el-input
                    type="text"
                    :disabled="form.upstreams.beta.type == 'roundrobin'"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item :inline="true" label="Node" prop="node">
                  <div v-for="(node,index) in form.upstreams.beta.nodes" style="margin-bottom:12px">
                    <el-input type="text" placeholder="IP" class="node-item" v-model="node.ip"></el-input>
                    <el-input
                      type="text"
                      placeholder="Port"
                      class="node-item"
                      v-model.number="node.port"
                    ></el-input>
                    <el-input
                      type="text"
                      placeholder="Weights"
                      class="node-item"
                      v-model.number="node.weight"
                    ></el-input>
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      @click="addNode('beta')"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-remove-outline"
                      :disabled="form.upstreams.dev.nodes.length == 1"
                      @click="delNode('beta',index)"
                    ></el-button>
                  </div>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="prod" name="prod">
                <el-form-item label="环境域名" prop="host">
                  <el-input v-model="form.upstreams.prod.host" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="Type" prop="type">
                  <el-select v-model="form.upstreams.prod.type" placeholder="请选择">
                    <el-option label="roundrobin" value="roundrobin"></el-option>
                    <el-option label="chash" value="chash"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="key" prop="key">
                  <el-input
                    type="text"
                    :disabled="form.upstreams.prod.type == 'roundrobin'"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <el-form-item :inline="true" label="Node" prop="node">
                  <div v-for="(node,index) in form.upstreams.prod.nodes" style="margin-bottom:12px">
                    <el-input type="text" placeholder="IP" class="node-item" v-model="node.ip"></el-input>
                    <el-input
                      type="text"
                      placeholder="Port"
                      class="node-item"
                      v-model.number="node.port"
                    ></el-input>
                    <el-input
                      type="text"
                      placeholder="Weights"
                      class="node-item"
                      v-model.number="node.weight"
                    ></el-input>
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      @click="addNode('prod')"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-remove-outline"
                      :disabled="form.upstreams.dev.nodes.length == 1"
                      @click="delNode('prod',index)"
                    ></el-button>
                  </div>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveService">保存</el-button>
          <el-button @click="drawer = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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
          <el-form-item v-for="(item,key) in pluginParam" :key="key" :label="key">
            <span v-if="item.type == 'number'">
              <el-input-number v-model="pluginForm.config[key]" :min="item.minimum"></el-input-number>
            </span>
            <span v-if="item.type == 'string'">
              <el-input type="text" v-model="pluginForm.config[key]"></el-input>
            </span>
            <span v-if="item.type == 'array'">
              <el-select v-model="pluginForm.config[key]">
                <el-option
                  v-for="(op,index) in item.options"
                  :key="`op${index}`"
                  :label="op"
                  :value="op"
                ></el-option>
              </el-select>
            </span>
          </el-form-item>
        </el-form>
        <div style="margin-left:160px;">
          <el-button type="primary" plain size="small" @click="savePlugin('pluginForm')">提交</el-button>
          <el-button plain size="small" @click="cancelPlugin('pluginForm')">取消</el-button>
        </div>
      </div>
      <div style="padding:0 32px;margin-top:24px;">
        <el-table :data="curPluginsList">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand" size="small">
                <el-form-item v-for="(plu,pluIndex) in props.row" :key="`serviceplugin${pluIndex}`" :label="pluIndex" v-show="pluIndex !='name' && pluIndex != 'desc'">
                  <span>{{ plu }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="配置名称" prop="name" width="120px"></el-table-column>
          <el-table-column label="描述" prop="desc"></el-table-column>
          <el-table-column label="操作" width="160px">
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
            <el-button type="primary" size="small" @click="getPluginParam(item)">添加</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api";
export default {
  name: "Service",
  data() {
    return {
      direction: "rtl",
      drawer: false,
      pluginDrawer: false,
      allPluginList: false,
      pluginsList: [], // 所有插件列表
      pluginText: "",
      title: "添加服务",
      activeEnv: "dev", // tab默认选中
      serviceList: [],
      serviceListIds: [],
      delPop: [],
      curPluginsList: [],
      editId: 0, // 当前编辑id
      curServiceId: "", // 当前服务id
      showAddPlugins: false,
      form: {
        name: "",
        prefix: "",
        desc: "",
        upstreams: {
          prod: {
            host: "",
            type: "",
            nodes: [
              {
                port: "",
                ip: "",
                weight: ""
              }
            ]
          },
          dev: {
            host: "",
            type: "",
            nodes: [
              {
                port: "",
                ip: "",
                weight: ""
              }
            ]
          },
          beta: {
            host: "",
            type: "",
            nodes: [
              {
                port: "",
                ip: "",
                weight: ""
              }
            ]
          }
        }
      },
      pluginForm: {},
      pluginParam: {},
      rules: {
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        prefix: [{ required: true, message: "请输入前缀", trigger: "blur" }],
        host: [{ required: true, message: "请输入host", trigger: "blur" }],
        type: [{ required: true, message: "请输入type", trigger: "blur" }]
      },
      pluginRules: {
        conn: [{ required: true, message: "必填", trigger: "blur" }],
        burst: [{ required: true, message: "必填", trigger: "blur" }],
        key: [{ required: true, message: "必填", trigger: "blur" }],
        default_conn_delay: [
          { required: true, message: "必填", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getServiceList();
  },
  methods: {
    /**
     *  获取服务列表
     */
    getServiceList() {
      this.$http.get(api.serviceList).then(res => {
        if (res.status == 200) {
          let list = []; // 存放服务列表
          let listIds = []; // 存放服务id
          let pop = [];
          res.data.nodes.forEach(el => {
            if (el.value) {
              list.push(el.value);
              listIds.push(el.key.split("/")[3]);
              pop.push(false);
            }
          });
          this.serviceList = list;
          this.serviceListIds = listIds;
          this.delPop = pop;
        }
      });
    },
    /**
     *  保存&编辑服务
     */
    saveService() {
      if (this.editId) {
        // 有id为更新（修改）
        this.$http.put(api.editService(this.editId), this.form).then(res => {
          if (res.status == 200) {
            this.$message({
              type: "sucess",
              message: "编辑成功"
            });
            this.getServiceList();
          }
        });
      } else {
        // 无id为新建
        this.$http.post(api.creatService, this.form).then(res => {
          if (res.status == 201 || res.status == 200) {
            this.$message({
              type: "sucess",
              message: "创建成功"
            });
            this.getServiceList();
          }
        });
      }
    },
    /**
     *  编辑服务
     * @param scope {Object} 当前编辑数据
     */
    editService(scope) {
      this.form = scope.row; // 给表单赋值
      this.editId = this.serviceListIds[scope.$index]; // 获取当前编辑的id
    },
    /**
     *  删除服务
     */
    delService(index) {
      this.editId = this.serviceListIds[index]; // 获取当前编辑的id
      this.$http.delete(api.delService(this.editId)).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
        this.getServiceList();
      });
    },
    /**
     *  添加node
     * @param type {String} 环境
     */
    addNode(type) {
      this.upstreams[`${type}`]["nodes"].push({
        port: "",
        ip: "",
        weight: ""
      });
    },
    /**
     *  删除node
     */
    delNode(type, index) {
      this.$delete(this.upstreams[`${type}`]["nodes"], index);
    },
    /**
     *  取消确认弹层
     */
    cancel(index) {
      this.$set(this.delPop, index, false);
    },
    /**
     * 跳转api详情
     */
    goDetail(scope) {
      this.$router.push({
        name: "serviceDetail",
        query: {
          id: this.serviceListIds[scope.$index],
          tab: "api"
        }
      });
    },
    /**
     * 查看服务插件
     */
    showServicePlugins(scope) {
      this.curPluginsList = [];
      this.pluginDrawer = true;
      this.curServiceId = this.serviceListIds[scope.$index];
      for (let i in scope.row.plugins) {
        scope.row.plugins[i]["name"] = i;
        this.curPluginsList.push(scope.row.plugins[i]);
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
     * 获取plugin 参数
     */
    async getPluginParam(scope) {
      this.pluginForm.key = scope.key;
      this.showAddPlugins = true;
      this.pluginText = `添加 ${scope.key} 插件`;
      this.allPluginList = false;
      this.pluginParam = scope.parameter; // 插件参数
      let obj = {};
      for (let i in scope.parameter) {
        obj[i] = scope.parameter[i]["default"];
        obj["desc"] = scope.desc;
      }
      this.$set(this.pluginForm, "config", obj);
      this.$set(this.pluginForm, "key", scope.key);
    },
    /**
     * 编辑plugin
     */
    async editPlugin(scope) {
      // 获取list
      let rowData = scope.row;
      const { status, data } = await this.$http.get(api.pluginList);
      if (status == 200) {
        this.showAddPlugins = true;
        this.pluginText = `编辑 ${scope.row.name} 插件`;
        console.log(data);
        data.forEach((el, index) => {
          if (el.key == scope.row.name) {
            this.pluginParam = el.parameter; // 插件参数
          }
        });
        let obj = {};
        for (let i in scope.row) {
          if (i != "name") {
            obj[i] = scope.row[i];
          }
        }
        this.$set(this.pluginForm, "key", scope.row.name);
        this.$set(this.pluginForm, "config", obj);
      }
    },
    /**
     * 取消保存
     */
    cancelPlugin(scope) {
      this.showAddPlugins = false;
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
        this.curPluginsList = [];
        for (let i in data.value.plugins) {
          data.value.plugins[i]["name"] = i;
          this.curPluginsList.push(data.value.plugins[i]);
        }
        this.showAddPlugins = false;
        this.pluginForm = {};
      }
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
            this.$delete(this.curPluginsList, scope.$index);
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="css">
.el-drawer__body {
  overflow-x: hidden;
  overflow-y: auto;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 160px;
  color: #99a9bf;
  text-align: right !important;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.table-expand .el-form-item__content {
  padding-left: 160px;
}
</style>
<style lang="scss" scoped>
.service {
  &-add {
    margin-bottom: 16px;
  }
  &-list {
    margin: 20px 32px;
  }
  &-table {
    padding: 16px 24px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
  }
  &-drawer {
    &_tit {
      padding: 24px;
      font-size: 20px;
      font-weight: 700;
      i {
        cursor: pointer;
      }
    }
    .node-item {
      width: 100px;
      margin-right: 12px;
    }
  }
  &-form {
    padding: 0 24px;
  }
  &-upstreams {
    padding-left: 32px;
    color: #606266;
    font-size: 14px;
  }
  .plugin-card {
    text-align: center;
    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    p {
      text-align: left;
      color: #666;
      margin-bottom: 12px;
    }
  }
}
</style>
