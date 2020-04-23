<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="project-save-drawer" :projectId="projectId">

        <p class="drawer-title">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelSave('projectForm')"></i>
        </p>

        <div class="drawer-table-container">
            <el-form ref="projectForm" :model="projectForm" label-width="80px">
                <el-input type="hidden" v-model="projectForm.id"></el-input>

                <el-form-item label="项目名称" prop="name" :rules="projectRules.name">
                    <el-input placeholder="项目名称" v-model="projectForm.name"></el-input>
                </el-form-item>

                <el-form-item label="项目路径" prop="path" :rules="projectRules.path">
                    <el-input placeholder="项目路径" v-model="projectForm.path"></el-input>
                </el-form-item>

                <el-form-item label="项目描述" prop="description" :rules="projectRules.description">
                    <el-input type="textarea" v-model="projectForm.description" placeholder="项目描述"></el-input>
                </el-form-item>

                <el-row :gutter="24">
                    <el-col :span="4" class="drawer-upstream-title">上游服务</el-col>
                    <el-col :span="20">
                        <el-tabs v-model="defaultEnv">
                            <el-tab-pane v-for="(upstream, upstreamIndex) in projectForm.upstreams"
                                         :label="getEnvChineseName(upstream.env)" :name="upstream.env">

                                <el-input type="hidden" v-model="projectForm.upstreams[upstreamIndex].id"></el-input>

                                <el-form-item label="主机名称" :prop="`upstreams[${upstreamIndex}].host`"
                                              :rules="projectRules.hostname">
                                    <el-input v-model="projectForm.upstreams[upstreamIndex].host" placeholder="主机名称">
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="轮询算法" :prop="`upstreams[${upstreamIndex}].type`">
                                    <el-select v-model="projectForm.upstreams[upstreamIndex].type" placeholder="轮询算法">
                                        <el-option label="CHASH" value="CHASH"></el-option>
                                        <el-option label="ROUNDROBIN" value="ROUNDROBIN"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item :inline="true" label="服务节点" required>
                                    <el-form-item v-for="(node, nodeIndex) in upstream.nodes"
                                                  style="margin-bottom:12px">

                                        <el-form-item style="float: left"
                                                      :prop="`upstreams[${upstreamIndex}].nodes[${nodeIndex}].ip`"
                                                      :rules="projectRules.nodeIp">
                                            <el-input type="text" placeholder="节点IP" class="node-item node-item-ip"
                                                      v-model="projectForm.upstreams[upstreamIndex].nodes[nodeIndex].ip">
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item style="float: left"
                                                      :prop="`upstreams[${upstreamIndex}].nodes[${nodeIndex}].port`"
                                                      :rules="projectRules.nodePort">
                                            <el-input type="text" placeholder="节点端口" class="node-item node-item-port"
                                                      v-model.number="projectForm.upstreams[upstreamIndex].nodes[nodeIndex].port">
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item style="float: left"
                                                      :prop="`upstreams[${upstreamIndex}].nodes[${nodeIndex}].weight`"
                                                      :rules="projectRules.nodeWeight">
                                            <el-input type="text" placeholder="节点权重" class="node-item node-item-weight"
                                                      v-model.number="projectForm.upstreams[upstreamIndex].nodes[nodeIndex].weight">
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item style="float: left">
                                            <el-button type="primary" icon="el-icon-circle-plus-outline"
                                                       @click="createdNode(upstreamIndex)">
                                            </el-button>
                                        </el-form-item>

                                        <el-form-item style="float: left;margin-left: 5px;">
                                            <el-button type="danger" icon="el-icon-remove-outline"
                                                       :disabled="projectForm.upstreams[upstreamIndex].nodes.length === 1"
                                                       @click="deleteNode(upstreamIndex, nodeIndex)">
                                            </el-button>
                                        </el-form-item>
                                    </el-form-item>
                                </el-form-item>

                                <el-form-item label="连接超时" :prop="`upstreams[${upstreamIndex}].timeouts.connect`"
                                              :rules="projectRules.timeout">
                                    <el-input type="number" style="width:160px"
                                              v-model.number="projectForm.upstreams[upstreamIndex].timeouts.connect">
                                        <template slot="append">毫秒</template>
                                    </el-input>
                                </el-form-item>

                                <el-form-item label="发送超时" :prop="`upstreams[${upstreamIndex}].timeouts.send`"
                                              :rules="projectRules.timeout">
                                    <el-input type="number" style="width:160px"
                                              v-model.number="projectForm.upstreams[upstreamIndex].timeouts.send">
                                        <template slot="append">毫秒</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="读取超时" :prop="`upstreams[${upstreamIndex}].timeouts.read`"
                                              :rules="projectRules.timeout">
                                    <el-input type="number" style="width:160px"
                                              v-model.number="projectForm.upstreams[upstreamIndex].timeouts.read">
                                        <template slot="append">毫秒</template>
                                    </el-input>
                                </el-form-item>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>

                <el-form-item>
                    <el-button type="primary" @click="executeSave('projectForm')">保存
                    </el-button>
                    <el-button @click="cancelSave('projectForm')">取消
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-drawer>
</template>

<script>

    export default {
        props: {
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
        data() {
            let validateDescription = (rule, value, callback) => {
                let reg = /^([\u4e00-\u9fa5]|[A-Za-z0-9\s]){0,100}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error("项目描述不合法，支持中文、英文，内容长度（0-100）"));
                }
            };

            let validateName = (rule, value, callback) => {
                let reg = /^([\u4e00-\u9fa5]|[A-Za-z0-9\s]){2,20}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error("项目名称不合法，支持中文、英文，内容长度（2-20）"));
                }
            };

            let validatePath = (rule, value, callback) => {
                let reg = /^\/[a-zA-Z0-9\-\_\.\+]{2,20}$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error("项目路径不合法，必须以\"/\"开头，内容支持大小写字母、数字、和-_.+等符合URL规则的符号，内容长度（2-20）"));
                }
            };

            let validateNodeIp = (rule, value, callback) => {
                const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('节点IP不合法'));
                }
            };

            let validateHostname = function (rule, value, callback) {
                const reg = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('主机名称不合法，主机名称应为WEB服务器的 Server Name，禁止使用 http:// 或 https:// 开始。'));
                }
            };
            return {
                title: "",
                defaultEnv: "PROD", // PROD or BETA or TEST
                requestApi: "",
                action: "CREATED", // CREATED or UPDATED

                projectForm: {
                    id: 0,
                    name: "",
                    path: "",
                    description: "",
                    upstreams: [
                        {
                            id: 0,
                            env: "PROD",
                            host: "localhost",
                            type: "CHASH",
                            timeouts: {
                                connect: 5000,
                                send: 5000,
                                read: 5000
                            },
                            nodes: [
                                {
                                    ip: "127.0.0.1",
                                    port: 10666,
                                    weight: 100,
                                },
                            ]
                        },
                        {
                            id: 0,
                            env: 'BETA',
                            host: 'localhost',
                            type: 'CHASH',
                            timeouts: {
                                connect: 5000,
                                send: 5000,
                                read: 5000
                            },
                            nodes: [
                                {
                                    ip: "127.0.0.1",
                                    port: 10666,
                                    weight: 100,
                                },
                            ]
                        },
                        {
                            id: 0,
                            env: "TEST",
                            host: "localhost",
                            type: "CHASH",
                            timeouts: {
                                connect: 5000,
                                send: 5000,
                                read: 5000
                            },
                            nodes: [
                                {
                                    ip: "127.0.0.1",
                                    port: 10666,
                                    weight: 100,
                                },
                            ]
                        }
                    ]
                },
                projectRules: {
                    name: [
                        {
                            required: true,
                            validator: validateName,
                            trigger: 'blur'
                        }
                    ],
                    path: [
                        {
                            required: true,
                            validator: validatePath,
                            trigger: "blur"
                        }
                    ],
                    description: [
                        {
                            required: false,
                            validator: validateDescription,
                            trigger: "blur"
                        }
                    ],
                    hostname: {
                        required: true,
                        trigger: 'blur',
                        validator: validateHostname,
                    },
                    nodeWeight: [
                        {
                            type: 'number',
                            required: true,
                            trigger: 'blur',
                            min: 0,
                            max: 100,
                            message: '取值范围（0 - 100）'
                        }
                    ],
                    nodePort: [
                        {
                            type: 'number',
                            required: true,
                            trigger: 'blur',
                            min: 1,
                            max: 65535,
                            message: '取值范围（1 - 65535）'
                        }
                    ],
                    nodeIp: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: validateNodeIp,
                        },
                    ],
                    timeout: [
                        {
                            type: 'number',
                            required: true,
                            trigger: 'blur',
                            min: 0,
                            max: 60000,
                            message: '取值范围（0 - 60000）'
                        }
                    ],
                },
            }
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(val) {
                    if (this.action === "CREATED") {
                        this.$emit("changeCreatedProject", val);
                    }
                    if (this.action === "UPDATED") {
                        this.$emit("changeUpdatedProject", val);
                    }
                    this.$refs['projectForm'].resetFields();
                }
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.projectId > 0) {
                        this.action     = 'UPDATED';
                        this.title      = `编辑项目`;
                        this.requestApi = this.$oakBackendApis.project.updated(this.projectId);
                        this.getProjectById(this.projectId);
                    } else {
                        this.action     = 'CREATED';
                        this.title      = '新增项目';
                        this.requestApi = this.$oakBackendApis.project.created;
                    }
                }
            }
        },
        methods: {
            executeSave(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    if (this.action === "CREATED") {
                        this.$oakRequest.post(this.requestApi, this.projectForm).then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "保存项目成功"
                                });
                                this.cancelSave("projectForm");
                            }
                        });
                    }
                    if (this.action === "UPDATED") {
                        this.$oakRequest.put(this.requestApi, this.projectForm).then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "保存项目成功"
                                });
                                this.cancelSave("projectForm");
                            }
                        });
                    }
                });
            },
            cancelSave(formName) {
                this.open_ = false;
            },
            deleteNode(upstreamIndex, nodeIndex) {
                this.$delete(this.projectForm.upstreams[upstreamIndex]["nodes"], nodeIndex);
            },
            createdNode(upstreamIndex) {
                this.projectForm.upstreams[upstreamIndex]["nodes"].push({
                    ip: "127.0.0.1",
                    port: 10666,
                    weight: 100,
                });
            },
            getEnvChineseName(env) {
                if (env === "PROD") {
                    return "生产环境"
                }
                if (env === "BETA") {
                    return "预发环境"
                }
                if (env === "TEST") {
                    return "测试环境"
                }
            },
            getProjectById(projectId) {
                this.$oakRequest.get(this.$oakBackendApis.project.query(projectId), this.projectForm).then(res => {
                    if (res.status === 200) {
                        let project = res.data.project;
                        if (Object.keys(project).length > 0) {
                            this.projectForm = res.data.project;
                        }
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .project-save-drawer {
        .node-item {
            width: 100px;
            margin-right: 12px;
        }

        .node-item-ip {
            width: 200px;
        }

        .node-item-port {
            width: 120px;
        }

        .node-item-weight {
            width: 100px;
        }

        .drawer-error-message {
            display: block;
            font-size: 12px;
            color: #666;
        }

        .drawer-title {
            padding: 24px;
            font-size: 20px;
            font-weight: 700;

            i {
                cursor: pointer;
            }
        }

        .drawer-table-container {
            padding: 20px;
            box-sizing: border-box;

            .drawer-upstream-title {
                width: 100px;
                padding: 8px 0 0 0;
                font-size: 14px;
                color: #606266;
                margin: 6px 0 0 10px;
            }
        }
    }
</style>
