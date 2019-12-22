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
        <el-table-column label="服务名称" prop="name"></el-table-column>
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
      title: "添加服务",
      activeEnv: "dev", // tab默认选中
      serviceList: [],
      serviceListIds: [],
      delPop:[],
      editId: 0, // 当前编辑id
      // delPop:false,// 删除
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

      rules: {
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        prefix: [{ required: true, message: "请输入前缀", trigger: "blur" }],
        host: [{ required: true, message: "请输入host", trigger: "blur" }],
        type: [{ required: true, message: "请输入type", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getServiceList();
  },
  methods: {
    /**
     * @todo 获取服务列表
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
     * @todo 保存&编辑服务
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
     * @todo 编辑服务
     * @param scope {Object} 当前编辑数据
     */
    editService(scope) {
      this.form = scope.row; // 给表单赋值
      this.editId = this.serviceListIds[scope.$index]; // 获取当前编辑的id
    },
    /**
     * @todo 删除服务
     */
    delService(index) {
      this.editId = this.serviceListIds[index]; // 获取当前编辑的id
      this.$http.delete(api.delService(this.editId)).then(res => {
        if(res.status == 200){
          this.$message({
            type:'success',
            message:'删除成功'
          })
        }
        this.getServiceList();
      });
    },
    /**
     * @todo 添加node
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
     * @todo 删除node
     */
    delNode(type, index) {
      this.$delete(this.upstreams[`${type}`]["nodes"], index);
    },
    /**
     * @todo 取消确认弹层
     */
    cancel(index){
      this.$set(this.delPop,index,false)
    }
  }
};
</script>
<style lang="css">
.el-drawer__body {
  overflow-x: hidden;
  overflow-y: auto;
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
}
</style>
