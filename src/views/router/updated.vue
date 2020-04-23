<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="api-drawer" :routerId="routerId" :projectId="projectId">
        <p class="api-drawer_tit">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelSaveRouter"></i>
        </p>
        <el-steps :active="routerOperateSection" finish-status="success" simple>
            <el-step title="前端配置"></el-step>
            <el-step title="后端配置"></el-step>
            <el-step title="响应结果"></el-step>
        </el-steps>

        <!-- Section One -->
        <div v-show="routerOperateSection === 1" style="margin-top: 10px">
            <el-form ref="routerRequestForms" :model="routerForms" :rules="routerRequestRules" label-width="120px">

                <el-input type="hidden" v-model="routerForms.id"></el-input>

                <el-form-item label="路由名称" prop="name">
                    <el-input type="text" class="api-drawer_input" placeholder="路由名称" v-model="routerForms.name"
                              maxlength="20" show-word-limit></el-input>
                </el-form-item>

                <el-form-item label="选择项目" prop="project_id" :rules="routerRequestRules.project_id">
                    <el-select filterable clearable placeholder="选择项目" v-model="routerForms.project_id"
                               :disabled="routerOperateAction === 'UPDATED'">
                        <el-option v-for="routerProject in routerProjects"
                                   :key="routerProject.id"
                                   :label="routerProject.name"
                                   :value="routerProject.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="路由路径" prop="request_path">
                    <el-input type="text" class="api-drawer_input" placeholder="路由路径"
                              v-model="routerForms.request_path"></el-input>
                </el-form-item>

                <el-form-item label="请求方式" prop="request_method" required>
                    <el-select v-model="routerForms.request_method">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="支持跨域" prop="enable_cors">
                    <el-switch v-model.number="routerForms.enable_cors" active-color="#13ce66" inactive-color="#ff4949"
                               :active-value=1 :inactive-value=0></el-switch>
                </el-form-item>

                <el-form-item label="备注" prop="description">
                    <el-input type="textarea" placeholder="输入备注信息" v-model="routerForms.description"></el-input>
                </el-form-item>

                <div class="fe-inline-table" style="padding-left:120px; position:relative;">
                    <span style="position:absolute; top:14px;left:55px;font-size: 14px;color: #606266;">参数配置</span>
                    <el-table :data="routerForms.request_params" empty-text="暂无参数">

                        <el-table-column label="参数名">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.name`'
                                              :rules='routerRequestRules.request_params.name' class="resizeInputClass">
                                    <el-input placeholder="请输入参数名" size="small"
                                              v-model="routerForms.request_params[requestParams.$index].name"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="参数位置">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.position`'
                                              :rules='routerRequestRules.request_params.position'
                                              class="resizeInputClass">
                                    <el-select v-model="routerForms.request_params[requestParams.$index].position"
                                               size="small">
                                        <el-option label="Header" value="HEADER"></el-option>
                                        <el-option label="Path" value="PATH"></el-option>
                                        <el-option label="Query" value="QUERY"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="参数类型">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.type`'
                                              :rules='routerRequestRules.request_params.type'
                                              class="resizeInputClass">
                                    <el-select v-model="routerForms.request_params[requestParams.$index].type"
                                               size="small">
                                        <el-option label="STRING" value="STRING"></el-option>
                                        <el-option label="INTEGER" value="INTEGER"></el-option>
                                        <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                                        <el-option label="FLOAT" value="FLOAT"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="默认值">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.default_val`'
                                              :rules='routerRequestRules.request_params.default_val'
                                              class="resizeInputClass">
                                    <el-input placeholder="输入默认值" size="small"
                                              :disabled="routerForms.request_params[requestParams.$index].required === 1"
                                              v-model="routerForms.request_params[requestParams.$index].default_val"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="必填">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.required`'
                                              :rules='routerRequestRules.request_params.required'
                                              class="resizeInputClass">
                                    <el-switch
                                            v-model.number="routerForms.request_params[requestParams.$index].required"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                            :active-value=1
                                            :inactive-value=0>
                                    </el-switch>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="备注">
                            <template slot-scope="requestParams">
                                <el-form-item :prop='`request_params.${requestParams.$index}.description`'
                                              :rules='routerRequestRules.request_params.description'
                                              class="resizeInputClass">
                                    <el-input placeholder="请输入备注" size="small"
                                              v-model="routerForms.request_params[requestParams.$index].description"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="requestParams">
                                <el-button type="text" @click="removeRequestParamsConfig(requestParams)">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-button type="text" @click="additionRequestParamsConfig">新增参数配置</el-button>
                </div>
            </el-form>
            <div style="margin-bottom: 30px;">
                <el-button type="primary" size="small" style="margin-left:120px;"
                           @click="nextSection('routerRequestForms')">下一步
                </el-button>
            </div>
        </div>


        <!-- Section Two -->
        <div v-show="routerOperateSection === 2" style="margin-top: 30px">
            <el-form ref="routerBackendForms" :model="routerForms" :rules="routerBackendRules" label-width="120px">

                <el-form-item label="后端路径" prop="backend_path">
                    <el-input class="api-drawer_input" placeholder="请输入内容"
                              v-model="routerForms.backend_path"></el-input>
                </el-form-item>

                <el-form-item label="请求方式" prop="backend_method">
                    <el-select v-model="routerForms.backend_method">
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                    </el-select>
                </el-form-item>

                <div class="fe-inline-table" style="padding-left:120px; position:relative;">
                    <span style="position:absolute; top:14px;left:55px;font-size: 14px;color: #606266;">后端参数配置</span>

                    <el-table :data="routerForms.backend_params" empty-text="暂无参数">

                        <el-table-column label="后端参数名">
                            <template slot-scope="backendParam">
                                <el-form-item :prop='`backend_params.${backendParam.$index}.name`'
                                              :rules='routerBackendRules.backend_params.name' class="resizeInputClass">
                                    <el-input placeholder="请输入参数名" size="small"
                                              v-model="routerForms.backend_params[backendParam.$index].name"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="后端参数位置">
                            <template slot-scope="backendParam">
                                <el-form-item :prop='`backend_params.${backendParam.$index}.position`'
                                              :rules='routerBackendRules.backend_params.position'
                                              class="resizeInputClass">
                                    <el-select v-model="routerForms.backend_params[backendParam.$index].position"
                                               size="small">
                                        <el-option label="QUERY" value="QUERY"></el-option>
                                        <el-option label="HEADER" value="HEADER"></el-option>
                                        <el-option label="PATH" value="PATH"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="前端参数名" prop="request_param_name"></el-table-column>

                        <el-table-column label="前端参数位置" prop="request_param_position"></el-table-column>

                        <el-table-column label="前端参数类型" prop="request_param_type"></el-table-column>

                    </el-table>
                </div>

                <div class="fe-inline-table" style="padding-left:120px; position:relative;">
                    <span style="position:absolute; top:14px;left:55px;font-size: 14px;color: #606266;">常量参数</span>

                    <el-table :data="routerForms.constant_params" empty-text="暂无参数">

                        <el-table-column label="参数名">
                            <template slot-scope="constantParams">
                                <el-form-item :prop='`constant_params.${constantParams.$index}.name`'
                                              :rules='routerBackendRules.constant_params.name' class="resizeInputClass">
                                    <el-input placeholder="输入参数名" size="small"
                                              v-model="routerForms.constant_params[constantParams.$index].name"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="参数位置">
                            <template slot-scope="constantParams">
                                <el-form-item :prop='`constant_params.${constantParams.$index}.position`'
                                              :rules='routerBackendRules.constant_params.position'
                                              class="resizeInputClass">
                                    <el-select v-model="routerForms.constant_params[constantParams.$index].position"
                                               size="small">
                                        <el-option label="HEADER" value="HEADER"></el-option>
                                        <el-option label="QUERY" value="QUERY"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="参数值">
                            <template slot-scope="constantParams">
                                <el-form-item :prop='`constant_params.${constantParams.$index}.value`'
                                              :rules='routerBackendRules.constant_params.value'
                                              class="resizeInputClass">
                                    <el-input placeholder="输入参数值" size="small"
                                              v-model="routerForms.constant_params[constantParams.$index].value"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="类型">
                            <template slot-scope="constantParams">
                                <el-form-item :prop='`constant_params.${constantParams.$index}.type`'
                                              :rules='routerBackendRules.constant_params.type' class="resizeInputClass">
                                    <el-select v-model="routerForms.constant_params[constantParams.$index].type"
                                               size="small">
                                        <el-option label="STRING" value="STRING"></el-option>
                                        <el-option label="INTEGER" value="INTEGER"></el-option>
                                        <el-option label="BOOLEAN" value="BOOLEAN"></el-option>
                                        <el-option label="FLOAT" value="FLOAT"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="备注">
                            <template slot-scope="constantParams">
                                <el-form-item :prop='`constant_params.${constantParams.$index}.description`'
                                              :rules='routerBackendRules.constant_params.description'
                                              class="resizeInputClass">
                                    <el-input placeholder="请输入备注" size="small"
                                              v-model="routerForms.constant_params[constantParams.$index].description"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="constantParams">
                                <el-button type="text" @click="removeConstantParamsConfig(constantParams)">删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
                <el-button type="text" style="margin-left:120px;" @click="additionConstantParamsConfig">新增参数配置
                </el-button>
            </el-form>
            <div style="margin-bottom: 30px;">
                <el-button @click="prevSection" size="small" style="margin-left:120px;">上一步</el-button>

                <el-button type="primary" size="small" style="margin-left:16px;" @click="nextSection('routerBackendForms')">
                    下一步
                </el-button>
            </div>
        </div>


        <!-- Section Three -->
        <div v-show="routerOperateSection === 3" style="margin-top: 30px">
            <el-form ref="routerResponseForms" :model="routerForms" :rules="routerResponseRules" label-width="120px">
                <el-form-item label="返回类型" prop="response_type">
                    <el-select v-model="routerForms.response_type">
                        <el-option label="application/json" value="application/json"></el-option>
                        <el-option label="text/html" value="text/html"></el-option>
                        <el-option label="text/xml" value="text/xml"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="成功响应示例" prop="response_success">
                    <el-input type="textarea" v-model="routerForms.response_success"></el-input>
                </el-form-item>

                <el-form-item label="失败响应示例" prop="response_failure">
                    <el-input type="textarea" v-model="routerForms.response_failure"></el-input>
                </el-form-item>

                <div class="fe-inline-table" style="padding-left:120px; position:relative;">
                    <span style="position:absolute; top:14px;left:45px;font-size: 14px;color: #606266;">错误码配置</span>
                    <el-table :data="routerForms.response_codes" empty-text="暂无参数">

                        <el-table-column label="错误码">
                            <template slot-scope="responseCode">
                                <el-form-item :prop='`response_codes.${responseCode.$index}.code`'
                                              :rules='routerResponseRules.response_codes.code' class="resizeInputClass">
                                    <el-input placeholder="输入参数名" size="small"
                                              v-model.number="routerForms.response_codes[responseCode.$index].code"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="错误信息">
                            <template slot-scope="responseCode">
                                <el-form-item :prop='`response_codes.${responseCode.$index}.message`'
                                              :rules='routerResponseRules.response_codes.message'
                                              class="resizeInputClass">
                                    <el-input placeholder="输入错误信息" size="small"
                                              v-model="routerForms.response_codes[responseCode.$index].message"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column label="备注">
                            <template slot-scope="responseCode">
                                <el-form-item :prop='`response_codes.${responseCode.$index}.description`'
                                              :rules='routerResponseRules.response_codes.description'
                                              class="resizeInputClass">
                                    <el-input placeholder="输入备注" size="small"
                                              v-model="routerForms.response_codes[responseCode.$index].description"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>

                        <el-table-column>
                            <template slot-scope="responseCode">
                                <el-button type="text" @click="removeResponseCodesConfig(responseCode)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="text" @click="additionResponseCodesConfig">新增参数配置</el-button>
                </div>
            </el-form>
            <div style="margin-bottom: 30px;">
                <el-button @click="prevSection" size="small" style="margin-left:120px;">上一步</el-button>
                <el-button type="primary" size="small" style="margin-left:16px;"
                           @click="nextSection('routerResponseForms')">完成
                </el-button>
            </div>
        </div>
    </el-drawer>
</template>

<script>

    export default {
        props: {
            routerId: {
                type: Number,
                default: 0,
            },
            projectId: {
                type: Number,
                default: 0,
            },
            size: {
                type: String,
                default: "60%"
            },
            direction: {
                type: String,
                default: "rtl"
            },
            open: {
                type: Boolean,
                default: false,
            },
            withHeader: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(value) {
                    if (this.routerOperateAction === 'CREATED') {
                        this.$emit('changeCreatedRouter', value);
                    }
                    if (this.routerOperateAction === 'UPDATED') {
                        this.$emit('changeUpdatedRouter', value);
                    }
                    this.routerForms = {};
                    this.routerOperateSection = 1;
                    this.$refs['routerRequestForms'].resetFields();
                    this.$refs['routerBackendForms'].resetFields();
                    this.$refs['routerResponseForms'].resetFields();
                },
            }
        },
        watch: {
            open(value) {
                if (value) {
                    this.initPageData();
                }
            },
        },
        methods: {

            removeRequestParamsConfig(requestParam) {
                this.$delete(this.routerForms.request_params, requestParam.$index);
            },

            additionRequestParamsConfig(config) {
                let baseConfig = {
                    name: '',
                    position: 'QUERY',
                    type: 'STRING',
                    default_val: '',
                    required: 1,
                    description: '',
                    ...config || {},
                };
                this.routerForms.request_params.push(baseConfig);
            },

            additionBackendParamsConfig(config) {
                let baseConfig = {
                    request_param_position: 'QUERY',
                    request_param_type: 'STRING',
                    request_param_name: '',
                    name: '',
                    request_param_required: 1,
                    position: 'QUERY',
                    request_param_description: '',
                    request_param_default_val: '',
                    ...config || {},
                };
                this.routerForms.backend_params.push(baseConfig);
            },

            removeConstantParamsConfig(constantParam) {
                this.$delete(this.routerForms.constant_params, constantParam.$index);
            },

            additionConstantParamsConfig(config) {
                let baseConfig = {
                    value: '',
                    position: 'HEADER',
                    description: '',
                    name: '',
                    type: 'STRING',
                    ...config || {},
                };
                this.routerForms.constant_params.push(baseConfig);
            },

            removeResponseCodesConfig(responseCode) {
                this.$delete(this.routerForms.response_codes, responseCode.$index);
            },

            additionResponseCodesConfig(config) {
                let baseConfig = {
                    code: '',
                    message: '',
                    description: '',
                    ...config || {},
                };
                this.routerForms.response_codes.push(baseConfig);
            },

            nextSection(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    if (this.routerOperateSection === 1) {
                        if (this.routerForms.backend_path.length === 0) {
                            this.routerForms.backend_path = this.routerForms.request_path;
                        }
                        if (this.routerForms.backend_method.length === 0) {
                            this.routerForms.backend_method = this.routerForms.request_method;
                        }
                        this.routerForms.request_params.forEach((requestParam) => {
                            let checkBackendMapping = this.routerForms.backend_params.filter(backendParam => {
                                return backendParam.request_param_position === requestParam.position &&
                                    backendParam.request_param_name === requestParam.name;
                            });
                            if (checkBackendMapping.length === 0) {
                                this.additionBackendParamsConfig({
                                    request_param_position: requestParam.position,
                                    request_param_type: requestParam.type,
                                    request_param_name: requestParam.name,
                                    name: requestParam.name,
                                    request_param_required: requestParam.required,
                                    position: requestParam.position,
                                    request_param_description: requestParam.description,
                                    request_param_default_val: requestParam.default_val,
                                });
                            }
                        });
                        this.routerOperateSection += 1;
                        return true;
                    }

                    if (this.routerOperateSection === 2) {
                        this.routerOperateSection += 1;
                        return true;
                    }

                    if (this.routerOperateSection === 3) {
                        if (this.routerOperateAction === 'CREATED') {
                            this.$oakRequest.post(this.$oakBackendApis.router.created, this.routerForms).then(res => {
                                if (res.status === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "创建路由成功"
                                    });
                                    this.cancelSaveRouter();
                                }
                            });
                        }
                        if (this.routerOperateAction === 'UPDATED') {
                            this.$oakRequest.put(this.$oakBackendApis.router.updated(this.routerId), this.routerForms).then(res => {
                                if (res.status === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "编辑路由成功"
                                    });
                                    this.cancelSaveRouter();
                                }
                            });
                        }
                        return true;
                    }
                });
            },

            prevSection() {
                if (this.routerOperateSection > 1) {
                    this.routerOperateSection -= 1;
                } else {
                    this.routerOperateSection = 1;
                }
            },

            initPageData() {
                // Get All Projects
                this.getProjects();
                if (this.routerId > 0) {
                    this.title = '编辑路由';
                    this.routerOperateAction = 'UPDATED';
                    this.getRouter();
                } else {
                    this.title = '新增路由';
                    this.routerOperateAction = 'CREATED';
                    if (this.projectId > 0) {
                        this.routerForms.project_id = this.projectId;
                    }
                    this.routerForms.id = 0;
                    this.routerForms.enable_cors = 1;
                    this.routerForms.request_method = 'GET';
                    this.routerForms.response_type = 'application/json';
                }
            },

            getRouter() {
                this.$oakRequest.get(this.$oakBackendApis.router.query(this.routerId)).then(res => {
                    if (res.status === 200) {
                        let router = res.data.router;
                        if (Object.keys(router).length > 0) {
                            if (Object.keys(router.request_params).length === 0) {
                                router.request_params = [];
                            }
                            if (Object.keys(router.backend_params).length === 0) {
                                router.backend_params = [];
                            }
                            if (Object.keys(router.constant_params).length === 0) {
                                router.constant_params = [];
                            }
                            if (Object.keys(router.response_codes).length === 0) {
                                router.response_codes = [];
                            }
                            this.routerForms = router;
                        } else {
                            this.routerForms = {};
                        }
                    }
                });
            },

            getProjects() {
                this.$oakRequest.get(this.$oakBackendApis.common.projects).then(res => {
                    if (res.status === 200) {
                        let projects = res.data.projects;
                        if (Object.keys(projects).length > 0) {
                            this.routerProjects = projects;
                        } else {
                            this.routerProjects = [];
                        }
                    }
                });
            },
            cancelSaveRouter() {
                this.open_ = false;
            },
        },
        data() {
            return {
                // ...updatedData.data(),
                title: '',

                routerOperateAction: '', // CREATED or UPDATED

                routerOperateSection: 1,

                routerProjects: [],

                commonHttpMethods: ['GET', 'POST', 'PUT', 'DELETE'],

                commonVarPositions: ['QUERY', 'HEADER', 'PATH'],

                commonVarTypes: ['STRING', 'INTEGER', 'BOOLEAN', 'FLOAT'],

                commonContentTypes: ['application/json', 'text/html', 'text/xml'],

                routerForms: {
                    id: 0,
                    project_id: '',
                    name: '',
                    enable_cors: 1,
                    description: '',
                    request_path: '',
                    request_method: 'GET',
                    request_params: [],
                    backend_path: '',
                    backend_method: '',
                    backend_params: [],
                    constant_params: [],
                    response_type: 'application/json',
                    response_success: '',
                    response_failure: '',
                    response_codes: [],
                    // delay remove
                    response_schema: {},
                    response_success_schema: {},
                    response_failure_schema: {},
                },

                routerRequestRules: {
                    id: [
                        {
                            type: 'number',
                            required: true,
                            min: 0,
                            message: '项目ID不合法',
                            trigger: 'change',
                        }
                    ],
                    project_id: [
                        {
                            type: 'string',
                            required: true,
                            validator: (rule, value, callback) => {
                                let projectId = Number(value);
                                if (projectId === 0) {
                                    return callback(new Error('请选择项目或到【项目管理】中创建后选择'));
                                }
                                return callback();
                            },
                            trigger: 'change',
                        }
                    ],
                    name: [
                        {
                            type: 'string',
                            required: true,
                            min: 3,
                            max: 20,
                            message: '长度范围（3 - 20）',
                            trigger: 'blur',
                        },
                    ],
                    description: [
                        {
                            type: 'string',
                            required: false,
                            min: 0,
                            max: 50,
                            message: '长度范围（0 - 20）',
                            trigger: 'change',
                        }
                    ],
                    enable_cors: [
                        {
                            type: 'enum',
                            required: true,
                            enum: [0, 1],
                        }
                    ],
                    request_path: [
                        {
                            type: 'string',
                            required: true,
                            validator: (rule, value, callback) => {
                                let reg = /^\/[\\.a-zA-Z0-9-_]+(\/\{[a-zA-Z0-9-_]+\}|\/[\\.a-zA-Z0-9-_]+)*$/;
                                if (!reg.test(value)) {
                                    callback(new Error('必须以 "/" 开头，支持大小写字母、数字 和 - _ . 等符号；并支持{}内输入变量，例如：/apioak/{hello}'));
                                }
                                let paramsReg = /\{([a-zA-Z0-9-_])+\}/g;
                                let paramNames = value.match(paramsReg) || [];
                                if (paramNames.length > 0) {
                                    paramNames.forEach((name) => {
                                        let variable = name.substring(1, name.length - 1);
                                        if (variable.length > 20) {
                                            return callback(new Error(`变量 ${variable} 超出长度限制（1 - 20）`));
                                        }
                                        let checked = this.routerForms.request_params.filter(ele => {
                                            return ele.name === variable && ele.position === 'PATH';
                                        });
                                        if (checked.length === 0) {
                                            return callback(new Error(`必须在参数配置中声明 PATH 变量 ${variable}`));
                                        }
                                    });
                                }
                                return callback();
                            },
                            trigger: 'blur',
                        }
                    ],
                    request_method: [
                        {
                            type: 'string',
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value.length === 0 || !this.commonHttpMethods.includes(value)) {
                                    return callback(new Error('选择请求方式'));
                                }
                                return callback();
                            },
                        }
                    ],
                    request_params: {
                        name: [
                            {
                                type: 'string',
                                trigger: 'blur',
                                validator: (rule, value, callback) => {
                                    if (value.length > 20 || value.length < 1) {
                                        return callback(new Error('长度范围（1 - 20）'));
                                    }
                                    this.$refs['routerRequestForms'].validateField('request_path');
                                    return callback();
                                },
                            }
                        ],
                        position: [
                            {
                                type: 'string',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    if (value.length === 0 || !this.commonVarPositions.includes(value)) {
                                        return callback(new Error('选择参数位置'));
                                    }
                                    this.$refs['routerRequestForms'].validateField("request_path");
                                    return callback();
                                },
                            }
                        ],
                        type: [
                            {
                                type: 'string',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    if (value.length === 0 || !this.commonVarTypes.includes(value)) {
                                        return callback(new Error('选择参数类型'));
                                    }
                                    return callback();
                                },
                            }
                        ],
                        default_val: [
                            {
                                type: 'string',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    let index = rule.field.split('.')[1] || 0;
                                    let isRequired = this.routerForms.request_params[index].required;
                                    if (isRequired === 1) {
                                        return callback();
                                    }
                                    if (value.length === 0) {
                                        return callback(new Error('输入默认值'));
                                    }
                                    return callback();
                                },
                            }
                        ],
                        required: [
                            {
                                type: 'number',
                                required: true,
                                min: 0,
                                max: 1,
                                message: '选择是否必填',
                            }
                        ],
                        description: [
                            {
                                type: 'string',
                                required: false,
                                min: 0,
                                max: 50,
                                message: '长度范围（0 - 50）',
                            }
                        ],
                    },
                },


                routerBackendRules: {
                    backend_path: [
                        {
                            type: 'string',
                            required: true,
                            validator: (rule, value, callback) => {
                                let reg = /^\/[\\.a-zA-Z0-9-_]+(\/\{[a-zA-Z0-9-_]+\}|\/[\\.a-zA-Z0-9-_]+)*$/;
                                if (!reg.test(value)) {
                                    return callback(new Error('必须以 "/" 开头，支持大小写字母、数字 和 - _ . 等符号；并支持{}内输入变量，例如：/apioak/{hello}'));
                                }
                                let paramsReg = /\{([a-zA-Z0-9-_])+\}/g;
                                let paramNames = value.match(paramsReg) || [];
                                if (paramNames.length > 0) {
                                    paramNames.forEach((name) => {
                                        let variable = name.substring(1, name.length - 1);
                                        if (variable.length > 20) {
                                            return callback(new Error(`变量 ${variable} 超出长度限制（1 - 20）`));
                                        }
                                        let checked = this.routerForms.backend_params.filter(ele => {
                                            return ele.name === variable && ele.position === 'PATH';
                                        });
                                        if (checked.length === 0) {
                                            return callback(new Error(`必须在参数配置中映射 PATH 变量 ${variable}`));
                                        }
                                    });
                                }
                                return callback();
                            },
                            trigger: 'change',
                        }
                    ],
                    backend_method: [
                        {
                            type: 'string',
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value.length === 0 || !this.commonHttpMethods.includes(value)) {
                                    return callback(new Error('选择请求方式'));
                                }
                                return callback();
                            },
                        }
                    ],
                    backend_params: {
                        name: [
                            {
                                type: 'string',
                                trigger: 'blur',
                                validator: (rule, value, callback) => {
                                    if (value.length > 20 || value.length < 1) {
                                        return callback(new Error('长度范围（1 - 20）'));
                                    }
                                    this.$refs['routerBackendForms'].validateField('backend_path');
                                    return callback();
                                },
                            }
                        ],
                        position: [
                            {
                                type: 'string',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    if (value.length === 0 || !this.commonVarPositions.includes(value)) {
                                        return callback(new Error('选择参数位置'));
                                    }
                                    this.$refs['routerBackendForms'].validateField("backend_path");
                                    return callback();
                                },
                            }
                        ],
                        request_param_name: [
                            {
                                type: 'string',
                                required: true,
                                min: 1,
                                max: 20,
                                message: '长度范围（1 - 20）',
                            }
                        ],
                        request_param_position: [
                            {
                                type: 'enum',
                                required: true,
                                enum: this.commonVarPositions,
                                message: '选择参数位置',
                            }
                        ],
                        request_param_type: [
                            {
                                type: 'enum',
                                required: true,
                                enum: this.commonVarTypes,
                                message: '选择参数类型',
                            }
                        ],
                        request_param_description: [
                            {
                                type: 'string',
                                required: false,
                                min: 0,
                                max: 50,
                                message: '长度范围（0 - 50）',
                            }
                        ],
                    },
                    constant_params: {
                        name: [
                            {
                                type: 'string',
                                required: true,
                                min: 1,
                                max: 20,
                                message: '长度范围（1 - 20）',
                                trigger: 'blur',
                            }
                        ],
                        type: [
                            {
                                type: 'enum',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    if (value.length === 0 || !this.commonVarTypes.includes(value)) {
                                        return callback(new Error('选择参数类型'));
                                    }
                                    return callback();
                                },
                            }
                        ],
                        position: [
                            {
                                type: 'string',
                                trigger: 'change',
                                validator: (rule, value, callback) => {
                                    if (value.length === 0 || !this.commonVarPositions.includes(value)) {
                                        return callback(new Error('选择参数位置'));
                                    }
                                    return callback();
                                },
                            }
                        ],
                        value: [
                            {
                                type: 'string',
                                required: true,
                                min: 1,
                                max: 20,
                                message: '长度范围（1 - 20）',
                                trigger: 'blur',
                            }
                        ],
                        description: [
                            {
                                type: 'string',
                                required: false,
                                min: 0,
                                max: 50,
                                message: '长度范围（0 - 50）',
                            }
                        ],
                    },
                },


                routerResponseRules: {
                    response_type: [
                        {
                            type: 'string',
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value.length === 0 || !this.commonContentTypes.includes(value)) {
                                    return callback(new Error('选择响应类型'));
                                }
                                return callback();
                            },
                        }
                    ],
                    response_success: [
                        {
                            type: 'string',
                            required: false,
                        }
                    ],
                    response_failure: [
                        {
                            type: 'string',
                            required: false,
                        }
                    ],
                    response_codes: {
                        code: [
                            {
                                type: 'number',
                                required: true,
                                min: 200,
                                max: 100000,
                                message: '取值范围（200 - 100000）',
                            },
                        ],
                        message: [
                            {
                                type: 'string',
                                required: true,
                                min: 1,
                                max: 20,
                                message: '长度范围（1 - 10）',
                            },
                        ],
                        description: [
                            {
                                type: 'string',
                                required: false,
                                min: 0,
                                max: 50,
                                message: '长度范围（0 - 50）',
                            },
                        ],
                    },
                    response_success_schema: [
                        {
                            type: 'string',
                            required: false,
                        }
                    ],
                    response_failure_schema: [
                        {
                            type: 'string',
                            required: false,
                        }
                    ],
                    // delay remove
                    response_schema: [
                        {
                            type: 'string',
                            required: false,
                        }
                    ],
                },
            };
        },
    }
</script>

<style lang="scss" scoped>
    .api-drawer {
        .api-drawer_tit {
            padding: 24px;
            font-size: 20px;
            font-weight: 700;

            i {
                cursor: pointer;
            }
        }

        .api_input {
            width: 300px;
        }

        .part-info {
            padding-left: 20px;

            .part-info_tit {
                padding-left: 20px;
            }
        }

        .api-detail-info {
            h3 {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            span {
                display: inline-block;
            }

            .tit {
                font-weight: bold;
                width: 100px;
                text-align: right;
            }

            .cont {
                margin-left: 12px;
            }

            p {
                padding-left: 60px;
                margin-bottom: 14px;
            }
        }
    }

    .api-drawer_input {
        width: 300px;
    }

</style>
