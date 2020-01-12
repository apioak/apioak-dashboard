<template>
  <div class="api">
    <div class="api-list">
      <el-button
        class="api-list_btn btn_add"
        type="primary"
        size="small"
        @click="drawer = true,isEdit = false"
      >新建</el-button>
      <el-table :data="apiList">
        <el-table-column width="40px">
          <template slot-scope="scope">
            <div v-if="scope.row.plugins">
              <img
                @click="showPlugins(scope)"
                style="width:24px;cursor:pointer;vertical-align: middle;"
                src="../../../assets/apex_plugin.png"
                alt="plugin"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-link @click="showDetail(scope)">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="版本" prop="service_path"></el-table-column>
        <el-table-column label="路径">
          <template slot-scope="scope">
            <div>
              <el-tag type="success" size="mini" style="margin-right:6px;">{{ scope.row.method }}</el-tag>
              {{ scope.row.path }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="环境">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.push_env" :key="index">
              <p v-if="item" style="color:#67C23A;">{{ envMap[index] }}：已发布</p>
              <p v-else>{{ envMap[index] }}：未发布</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  发布
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span @click="publish(scope,'dev','publish')">测试</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="publish(scope,'beta','publish')">预发布</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="publish(scope,'prod','publish')">发布</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown>
                <span class="el-dropdown-link" style="margin:0 12px;">
                  下线
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <span @click="publish(scope,'dev','unpublish')">测试</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="publish(scope,'beta','unpublish')">预发布</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="publish(scope,'prod','unpublish')">发布</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="text" @click="editRouter(scope)">编辑</el-button>
              <el-button type="text" @click="delRouter(scope)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      class="api-drawer detail"
      :visible.sync="showDetailDrawer"
      :direction="direction"
      :title="title"
      :with-header="false"
      size="70%"
    >
      <p class="api-drawer_tit">
        <span v-html="title"></span>
        <i class="el-icon-close fr" @click="showDetailDrawer = false"></i>
      </p>
      <div class="part-info">
        <h3>基本信息</h3>
        <p class="part-info_tit">
          <span>所属服务</span>
        </p>
        <p>
          <span>API名称</span>
        </p>
        <p>
          <span>备注</span>
        </p>
      </div>
    </el-drawer>
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
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="否" :value="false"></el-option>
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
        <el-button
          type="primary"
          size="small"
          style="margin-left:32px;"
          @click="next('feConfig')"
        >下一步</el-button>
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
                  <el-select
                    v-model="serviceForm.service_params[scope.$index].service_position"
                    size="small"
                  >
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
                  <el-select
                    v-model="serviceForm.constant_params[scope.$index].position"
                    size="small"
                  >
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
        <el-button
          type="primary"
          size="small"
          style="margin-left:16px;"
          @click="next('serviceConfig')"
        >下一步</el-button>
      </div>
      <div class="step-result" v-show="activeStep == 2">
        <el-form :model="resultForm" :rules="resultRule" label-width="120px">
          <el-form-item label="返回类型" prop="response_type">
            <el-select v-model="resultForm.response_type">
              <el-option label="JSON" value="JSON"></el-option>
              <el-option label="HTML" value="HTML"></el-option>
              <el-option label="TEXT" value="TEXT"></el-option>
              <el-option label="XML" value="XML"></el-option>
              <el-option label="BINARY" value="BINARY"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成功响应实例" prop="response_success">
            显示JSON-SCHEMA
            <el-switch v-model="switchSchema"></el-switch>
            <el-input type="textarea" v-model="resultForm.response_success"></el-input>
          </el-form-item>
          <el-form-item label="失败响应实例" prop="response_fail">
            <el-input type="textarea" v-model="resultForm.response_fail"></el-input>
          </el-form-item>
          <el-form-item label="错误码配置">
            <el-table :data="resultForm.response_error_codes" empty-text="暂无参数">
              <el-table-column label="错误码" prop="code">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入参数名"
                    size="small"
                    v-model.number="resultForm.response_error_codes[scope.$index].code"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="错误信息" prop="msg">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入错误信息"
                    size="small"
                    v-model="resultForm.response_error_codes[scope.$index].msg"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="desc">
                <template slot-scope="scope">
                  <el-input
                    placeholder="请输入备注"
                    size="small"
                    v-model="resultForm.response_error_codes[scope.$index].desc"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="delParams(scope,'result')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="text" @click="addRequestParams('result')">新增参数配置</el-button>
          </el-form-item>
        </el-form>
        <el-button @click="activeStep = 1" size="small" style="margin-left:32px;">上一步</el-button>
        <el-button type="primary" size="small" style="margin-left:16px;" @click="saveApi">完成</el-button>
      </div>
    </el-drawer>
    <el-drawer
      class="api-drawer"
      :title="title"
      :visible.sync="pluginDrawer"
      :direction="direction"
      :with-header="false"
      size="50%"
    >
      <p class="api-drawer_tit">
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
        <el-table :data="curPluginsList">
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
import api from "@/api";
import { isArray } from "util";
export default {
  name: "apiList",
  data() {
    return {
      apiList: [],
      originData: [],
      detailData: {},
      direction: "rtl",
      drawer: false,
      showDetailDrawer: false,
      title: "添加API",
      activeStep: 0, // 当前步骤
      switchSchema: false,
      isEdit: false,
      curRouterid: "",
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
        service_params: [
          {
            service_name: "",
            name: "zzz",
            service_position: "Query",
            position: "Query",
            desc: "",
            type: "string"
          }
        ],
        constant_params: []
      },
      resultForm: {
        // 响应结果
        response_type: "",
        response_success: "",
        response_fail: "",
        response_error_codes: []
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
      resultRule: {},
      pluginDrawer: false,
      allPluginList: false,
      pluginsList: [], // 所有插件列表
      pluginText: "",
      curPluginsList: [],
      showAddPlugins: false,
      pluginForm: {
        key: "",
        config: {
          conn: "",
          burst: "",
          key: "",
          default_conn_delay: "",
          desc: ""
        }
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
      this.originData = data.nodes;
    },
    /**
     * 新增参数配置
     */
    addRequestParams(type) {
      if (type == "fe") {
        this.feForm.request_params.push({
          name: "",
          position: "Header",
          type: "string",
          default_val: "",
          require: "",
          desc: ""
        });
      } else if (type == "service") {
        this.serviceForm.constant_params.push({
          value: "apioak",
          position: "Query",
          desc: "",
          name: "gateway"
        });
      } else {
        this.resultForm.response_error_codes.push({
          code: "",
          msg: "",
          desc: ""
        });
      }
    },
    /**
     * 删除参数配置
     */
    delParams(scope, type) {
      if (type == "fe") {
        this.$delete(this.feForm.request_params, scope.$index);
      } else if (type == "service") {
        this.$delete(this.serviceForm.constant_params, scope.$index);
      } else {
        this.$delete(this.resultForm.response_error_codes, scope.$index);
      }
    },
    /**
     * next
     */
    next(formName) {
      this.activeStep = this.activeStep + 1;
    },
    /** 保存api*/
    async saveApi() {
      let obj = Object.assign(this.feForm, this.serviceForm, this.resultForm);
      if (!this.isEdit) {
        const { status, data } = await this.$http.post(api.creatRouter, obj, {
          headers: { "APIOAK-SERVICE-ID": this.$route.query.id }
        });
        if (status == 201) {
          this.$message({
            type: "success",
            message: "创建成功"
          });
        } else {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        }
      } else {
        const { status, data } = await this.$http.put(
          api.updateRouter(this.curRouterid),
          obj,
          { headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
        );
        if (status == 200) {
          this.$message({
            type: "success",
            message: "更新成功"
          });
        } else {
          this.$message({
            type: "error",
            message: "保存失败"
          });
        }
      }
      this.drawer = false;
      await this.getRoutersList();
    },
    /**
     * 编辑api
     */
    editRouter(scope) {
      this.drawer = true;
      this.isEdit = true;
      let curData = scope.row;
      let curRouterData = this.originData[scope.$index];
      this.curRouterid = curRouterData["key"].split("/").reverse()[0];
      this.feForm = {
        // 前端配置
        name: curData.name,
        path: curData.path,
        method: curData.method,
        enable_cors: curData.enable_cors,
        desc: curData.desc,
        request_params: isArray(curData.request_params)
          ? curData.request_params
          : []
      };
      this.serviceForm = {
        // 后端配置
        service_path: curData.service_path,
        service_method: curData.service_method,
        timeout: curData.timeout,
        service_params: isArray(curData.service_params)
          ? curData.service_params
          : [],
        constant_params: isArray(curData.constant_params)
          ? curData.constant_params
          : []
      };
      this.resultForm = {
        // 响应结果
        response_type: curData.response_type,
        response_success: curData.response_success,
        response_fail: curData.response_fail,
        response_error_codes: isArray(curData.response_error_codes)
          ? curData.response_error_codes
          : []
      };
    },
    /**
     * 删除路由
     */
    async delRouter(scope) {
      let curRouterid = this.originData[scope.$index]["key"]
        .split("/")
        .reverse()[0];
      this.$confirm("此操作将永久删除该文件, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { status, data } = await this.$http.delete(
            api.updateRouter(curRouterid),
            { headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
          );
          if (status == 200) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            await this.getRoutersList();
          }
        })
        .catch(() => {});
    },
    /**
     * 发布/下线路由
     * @param {Object} scope 当前列表数据
     * @param {String} env 操作环境
     * @param {String} op 发布（publish）/下线（unpublish）
     */
    async publish(scope, env, op) {
      let curRouterid = this.originData[scope.$index]["key"]
        .split("/")
        .reverse()[0];
      if (op == "publish") {
        const { status, data } = await this.$http.post(
          api.publishRouter(curRouterid, env),
          {},
          { headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
        );
        if (status == 200) {
          this.$message({
            type: "success",
            message: `${env}环境发布成功`
          });
        }
      } else {
        const { status, data } = await this.$http.delete(
          api.publishRouter(curRouterid, env),
          { headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
        );
        if (status == 200) {
          this.$message({
            type: "success",
            message: `${env}环境下线成功`
          });
        }
      }
      await this.getRoutersList();
    },
    /**
     * 展示api详情
     */
    showDetail(scope) {
      this.showDetailDrawer = true;
      let data = scope.row;
      this.detailData = data;
      this.title = `${data.name}详情`;
    },
    /**
     * 查看服务插件
     */
    showPlugins(scope) {
      this.curPluginsList = [];
      this.pluginDrawer = true;
      this.curRouterid = this.originData[scope.$index]["key"]
        .split("/")
        .reverse()[0];
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
        api.saveRouterPlugin(this.curRouterid),
        this.pluginForm,
        { headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
      );
      if (status == 200) {
        this.curPluginsList = [];
        for (let i in data.value.plugins) {
          data.value.plugins[i]["name"] = i;
          this.curPluginsList.push(data.value.plugins[i]);
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
            api.delRouterPlugin(this.curRouterid, scope.row.name),{ headers: { "APIOAK-SERVICE-ID": this.$route.query.id } }
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
.el-dropdown-link {
  cursor: pointer;
  color: #4c91ff;
}
.el-icon-arrow-down {
  font-size: 12px;
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
  width: 80%;
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
    .part-info {
      padding-left: 20px;
      &_tit {
        padding-left: 20px;
      }
    }
   
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