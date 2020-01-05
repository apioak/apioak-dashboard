<template>
  <div class="api">
    <div class="api-list">
      <el-button class="api-list_btn btn_add" type="primary" size="small" @click="drawer = true">新建</el-button>
      <el-table :data="apiList">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="版本" prop="service_path"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="方法" prop="method"></el-table-column>
        <el-table-column label="环境">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.push_env" :key="index">
              <p v-if="item">{{ envMap[index] }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <div>
              <el-button type="text">预发布</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">上线</el-button>
              <el-button type="text">下线</el-button>
              <el-button type="text">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      class="api-drawer"
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      size="70%"
    >
      <p class="api-drawer_tit">
        <span v-html="title"></span>
        <i class="el-icon-close fr" @click="drawer = false"></i>
      </p>
      <el-steps style="margin-bottom:24px" :active="activeStep" finish-status="success" simple>
        <el-step title="前端配置"></el-step>
        <el-step title="后端配置"></el-step>
        <el-step title="响应结果"></el-step>
      </el-steps>
      <div class="step-fe" v-show="activeStep == 0">
        <el-form ref="feConfig" :model="feForm" :rules="feRule" label-width="120px">
          <el-form-item label="API名称" prop="name">
            <el-input
              type="text"
              class="api-drawer_input"
              placeholder="请输入内容"
              v-model="feForm.name"
              maxlength="60"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="路由" prop="path">
            <el-input
              type="text"
              class="api-drawer_input"
              placeholder="请输入内容"
              v-model="feForm.path"
            ></el-input>
            <span
              style="display:block;font-size:12px;color:#666;"
            >支持“/”、“=/”、“^~/”开头，大小写字母、数字、和$-_.+!*'(),/%等符合URL规则的符号；支持{}内输入变量名</span>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-select v-model="feForm.method">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="HEAD" value="HEAD"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支持跨域">
            <el-switch v-model="feForm.enable_cors" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注信息" v-model="feForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="参数配置">
            <el-table :data="feForm.request_params" empty-text="暂无参数">
              <el-table-column label="参数名" prop="name">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入参数名"
                    size="small"
                    v-model="feForm.request_params[scope.$index].name"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="参数位置" prop="position">
                <template slot-scope="scope">
                  <el-select v-model="feForm.request_params[scope.$index].position" size="small">
                    <el-option label="Header" value="Header"></el-option>
                    <el-option label="Path" value="Path"></el-option>
                    <el-option label="Query" value="Query"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  <el-select v-model="feForm.request_params[scope.$index].type" size="small">
                    <el-option label="string" value="string"></el-option>
                    <el-option label="init" value="init"></el-option>
                    <el-option label="long" value="long"></el-option>
                    <el-option label="float" value="float"></el-option>
                    <el-option label="double" value="double"></el-option>
                    <el-option label="boolean" value="boolean"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="默认值" prop="default_val">
                <template slot-scope="scope">
                  <el-input
                    placeholder="输入默认值"
                    size="small"
                    :disabled="feForm.request_params[scope.$index].name == ''"
                    v-model="feForm.request_params[scope.$index].default_val"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="必填" prop="require">
                <template slot-scope="scope">
                  <el-select v-model="feForm.request_params[scope.$index].require" size="small">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="desc">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入备注"
                    size="small"
                    v-model="feForm.request_params[scope.$index].desc"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="delParams(scope,'fe')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" @click="addRequestParams('fe')">新增参数配置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" style="margin-left:32px;" @click="activeStep = 1">下一步</el-button>
      </div>
      <div class="step-service" v-show="activeStep == 1">
        <el-form ref="serviceConfig" :model="serviceForm" :rules="serviceRule" label-width="120px">
          <el-form-item label="后端路径" prop="service_path">
            <el-input
              class="api-drawer_input"
              placeholder="请输入内容"
              v-model="serviceForm.service_path"
            ></el-input>
            <span
              style="display:block;font-size:12px;color:#666;"
            >支持"/"开头，大小写字母、数字、和$-_.+!*'(),/%等符合URL规则的符号；支持{}内输入变量名前端参数中的"="与“^~”为前端路径精确度匹配符，后端路径不继承</span>
          </el-form-item>
          <el-form-item label="请求方式" prop="service_method">
            <el-select v-model="serviceForm.service_method">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="HEAD" value="HEAD"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="后端超时">
            <el-input type="number" style="width:160px" v-model.number="serviceForm.timeout">
              <template slot="append">秒</template>
            </el-input>
          </el-form-item>
          <el-form-item label="后端参数配置">
            <el-table :data="serviceForm.service_params" empty-text="暂无参数">
              <el-table-column label="后端参数名" prop="service_name">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入参数名"
                    size="small"
                    v-model="serviceForm.service_params[scope.$index].service_name"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="后端参数位置" prop="service_position">
                <template slot-scope="scope">
                  <el-select v-model="serviceForm.service_params[scope.$index].service_position" size="small">
                    <el-option label="Header" value="Header"></el-option>
                    <el-option label="Path" value="Path"></el-option>
                    <el-option label="Query" value="Query"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="前端参数名" prop="name"></el-table-column>
              <el-table-column label="前端参数位置" prop="position"></el-table-column>
              <el-table-column label="前端参数类型" prop="type"></el-table-column>
              <el-table-column label="备注" prop="desc"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="常量参数">
              <el-table :data="serviceForm.constant_params" empty-text="暂无参数">
              <el-table-column label="参数名" prop="name">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入参数名"
                    size="small"
                    v-model="serviceForm.constant_params[scope.$index].name"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="参数位置" prop="position">
                <template slot-scope="scope">
                  <el-select v-model="serviceForm.constant_params[scope.$index].position" size="small">
                    <el-option label="Header" value="Header"></el-option>
                    <el-option label="Path" value="Path"></el-option>
                    <el-option label="Query" value="Query"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="参数值" prop="value">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入参数名"
                    size="small"
                    v-model="serviceForm.constant_params[scope.$index].value"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="desc">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入备注"
                    size="small"
                    v-model="serviceForm.constant_params[scope.$index].desc"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="delParams(scope,'service')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" @click="addRequestParams('service')">新增参数配置</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="activeStep = 0" size="small" style="margin-left:32px;">上一步</el-button>
        <el-button type="primary" size="small" style="margin-left:16px;">下一步</el-button>
      </div>
      <div class="step-result" v-show="activeStep == 2">
          <el-form :model="resultForm" :rules="resultRule" label-width="120px">
              <el-form-item>
                  <el-select v-model="resultForm.response_type"></el-select>
              </el-form-item>
          </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import api from "@/api";
export default {
  name: "apiList",
  data() {
    return {
      apiList: [],
      direction: "rtl",
      drawer: false,
      title: "添加API",
      activeStep: 0, // 当前步骤
      envMap: {
        beta: "预发布",
        dev: "测试",
        prod: "发布"
      },
      feForm: {
        // 前端配置
        name: "",
        path: "",
        method: "GET",
        enable_cors: true,
        desc: "",
        request_params: []
      },
      serviceForm: {
        // 后端配置
        service_path: "",
        service_method: "GET",
        timeout: 5,
        service_params:[{
            "service_name": "",
            "name": "zzz",
            "service_position": "Query",
            "position": "Query",
            "desc": "",
            "type": "string"
        }],
        constant_params:[]
      },
      resultForm:{
        // 响应结果
        response_type:"",

      },
      feRule: {
        name: [{ required: true, message: "请输入服务名称", trigger: "blur" }],
        path: [{ required: true, message: "路由不能为空", trigger: "blur" }]
      },
      serviceRule: {
        service_path: [
          { required: true, message: "请输入服务名称", trigger: "blur" }
        ]
      },
      resultRule:{

      }
    };
  },
  created() {
    this.getRoutersList();
  },
  methods: {
    /**
     * 获取路由列表
     */
    async getRoutersList() {
      let id = this.$route.query.id; // 服务id
      let { data } = await this.$http.get(api.routersList, {
        headers: {
          "APIOAK-SERVICE-ID": id
        }
      });
      let _arr = [];
      data.nodes.forEach(el => {
        if (el.value) {
          _arr.push(el.value);
        }
      });
      this.apiList = _arr;
    },
    /**
     * 新增参数配置
     */
    addRequestParams(type) {
        if(type == 'fe'){
            this.feForm.request_params.push({
                "name": "",
                "position": "Header",
                "type": "string",
                "default_val": "",
                "require": "",
                "desc": ""
            });
        }else{
            this.serviceForm.constant_params.push({
                "value": "apioak",
                "position": "Query",
                "desc": "",
                "name": "gateway"
            })
        }
      
    },
    /**
     * 删除参数配置
     */
    delParams(scope,type) {
        if(type == 'fe'){
            this.$delete(this.feForm.request_params, scope.$index);
        }else{
            this.$delete(this.serviceForm.constant_params, scope.$index);
        }
    },
    handleClick() {
      console.log(11);
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
.api {
  &-list {
    padding: 0 20px;
    &_btn {
      &.btn_add {
        margin-bottom: 12px;
      }
    }
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
    &_input {
      width: 300px;
    }
  }
}
</style>