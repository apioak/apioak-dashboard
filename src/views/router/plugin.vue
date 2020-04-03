<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="router-plugin-drawer" :routerId="routerId">
        <p class="drawer-title">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelPlugin"></i>
        </p>
        <el-button type="primary" size="small" style="margin-right:32px;" class="fr"
                   @click="openCreatedPlugin">添加
        </el-button>
        <div style="background:#fafafa;padding:12px;" v-if="pluginSaveOpen">
            <h3 style="font-size:16px;font-weight:bold;margin-bottom:20px;margin-left:12px;">{{ pluginSaveTitle }}</h3>
            <div style="text-align: center">
                <el-radio-group v-model="pluginSaveRadio" size="small">
                    <el-radio-button label="BASIS">插件信息</el-radio-button>
                    <el-radio-button label="CONFIG">插件配置</el-radio-button>
                </el-radio-group>
            </div>
            <div style="margin: 20px;">
                <el-form label-width="160px" ref="pluginForms" :model="pluginForms" size="small" :rules="pluginRules"
                         :label-position="pluginSaveRadio">
                    <input type="hidden" name="">

                    <el-input type="hidden" v-model="pluginForms.id"></el-input>

                    <div v-if="pluginSaveRadio === 'BASIS'">
                        <el-form-item label="选择插件" prop="name">
                            <el-select v-model="pluginForms.name" placeholder="选择插件"
                                       :disabled="pluginSaveAction === 'UPDATED'" filterable
                                       @change="changeCreatedPlugin" style="width:265px;">
                                <el-option v-for="systemPlugin in systemPlugins" :label="systemPlugin.name"
                                           :value="systemPlugin.name">
                                    <span style="float: left">{{ systemPlugin.name }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ systemPlugin.type }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="插件类型" prop="type">
                            <el-input v-model="pluginForms.type" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="插件描述" prop="description">
                            <el-input v-model="pluginForms.description"
                                      disabled></el-input>
                        </el-form-item>
                    </div>

                    <div v-if="pluginSaveRadio === 'CONFIG'">
                        <el-form-item v-for="(configOptionData, configOptionName) in pluginForms.config"
                                      :label="configOptionName"
                                      :prop="`config.${configOptionName}.value`"
                                      :rules="configOptionData.validateRules">

                            <el-select v-model="pluginForms.config[configOptionName].value" placeholder="选择配置"
                                       v-if="configOptionData.type === 'array'">
                                <el-option v-for="(optionValue, optionIndex) in configOptionData.options"
                                           :key="optionIndex"
                                           :label="optionValue"
                                           :value="optionValue">
                                </el-option>
                            </el-select>

                            <el-input v-model.number="pluginForms.config[configOptionName].value"
                                      v-if="configOptionData.type === 'number' || configOptionData.type === 'integer'">
                            </el-input>

                            <el-input v-model="pluginForms.config[configOptionName].value"
                                      v-if="configOptionData.type === 'string'"></el-input>

                        </el-form-item>
                    </div>
                </el-form>
            </div>

            <div style="text-align: center; margin-top: 10px;">
                <el-button type="primary" plain size="small" @click="executeSaveRouterPlugin('pluginForms')">提交
                </el-button>
                <el-button plain size="small" @click="cancelSaveRouterPlugin('pluginForms')">取消</el-button>
            </div>
        </div>
        <div style="padding:0 32px;margin-top:24px;">
            <el-table :data="routerPlugins">
                <el-table-column type="expand">
                    <template slot-scope="routerPlugin">
                        <el-form label-position="left" class="table-expand" size="small">
                            <el-form-item v-for="(configVal, configKey) in routerPlugin.row.config"
                                          :label="configKey">
                                <span>{{ configVal }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="插件名称" prop="name" width="120px"></el-table-column>
                <el-table-column label="描述" prop="description"></el-table-column>
                <el-table-column label="操作" width="160px">
                    <template slot-scope="routerPlugin">
                        <el-button type="primary" size="mini" @click="openUpdatedPlugin(routerPlugin.row)">编辑
                        </el-button>
                        <el-popconfirm
                                confirmButtonText='确定'
                                cancelButtonText='取消'
                                icon="el-icon-info"
                                iconColor="red"
                                @onConfirm="executeRemoveRouterPlugin(routerPlugin.row, 'pluginForms')"
                                title="确定删除该插件吗？" style="margin-left: 10px">
                            <el-button slot="reference" type="danger" size="mini">删除</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
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
            size: {
                type: String,
                default: "50%"
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
            title: {
                type: String,
                default: "路由插件",
            }
        },
        data() {
            return {
                pluginSaveOpen: false,
                pluginSaveTitle: '',
                pluginSaveRadio: 'BASIS', // BASIS or CONFIG
                pluginSaveAction: '', // CREATED or UPDATED
                routerPlugins: [],
                systemPlugins: [],
                pluginUpdatedOpen: false,
                pluginConfigs: {},
                pluginForms: {
                    id: 0,
                    name: '',
                    type: '',
                    description: '',
                    config: {}
                },
                pluginRules: {
                    name: [
                        {
                            required: true,
                            trigger: 'change',
                            message: '插件名称不合法',
                        }
                    ],
                    type: [
                        {
                            required: true,
                            trigger: 'change',
                            message: '插件类型不合法',
                        }
                    ],
                    description: [
                        {
                            required: true,
                            trigger: 'change',
                            message: '插件描述不合法',
                        }
                    ],
                },
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.routerId > 0) {
                        this.updatedRouterAndSystemPlugins();
                    } else {
                        this.cancelPlugin();
                    }
                }
            },
            pluginSaveRadio(value) {
                if (this.$refs['pluginForms']) {
                    this.$refs['pluginForms'].clearValidate();
                }
            }
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(val) {
                    this.routerPlugins = [];
                    this.systemPlugins = [];
                    this.pluginSaveOpen = false;
                    this.$emit("changePluginRouter", val);
                }
            }
        },
        methods: {
            cancelPlugin() {
                this.open_ = false;
            },
            getSystemPlugins() {
                this.$oakRequest.get(this.$oakBackendApis.common.plugins).then(res => {
                    if (res.status === 200) {
                        let plugins = res.data.plugins;
                        if (Object.keys(plugins).length > 0) {
                            this.systemPlugins = plugins;
                        } else {
                            this.systemPlugins = [];
                        }
                    }
                });
            },
            getRouterPlugins() {
                this.$oakRequest.get(this.$oakBackendApis.router.plugins(this.routerId)).then(res => {
                    if (res.status === 200) {
                        let plugins = res.data.plugins;
                        if (Object.keys(plugins).length > 0) {
                            this.routerPlugins = plugins;
                        } else {
                            this.routerPlugins = [];
                        }
                    }
                });
            },
            cancelSaveRouterPlugin(formName) {
                // updated router and system plugins
                this.updatedRouterAndSystemPlugins();
                // reset form filed
                this.$refs[formName].resetFields();
                // close edit area
                this.pluginSaveOpen = false;
            },
            executeSaveRouterPlugin(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    let plugin = JSON.parse(JSON.stringify(this.pluginForms));
                    for (let [optionKey, optionData] of Object.entries(plugin.config)) {
                        plugin.config[optionKey] = optionData.value;
                    }
                    if (this.pluginSaveAction === "UPDATED") {
                        this.$oakRequest.put(this.$oakBackendApis.router.updatedPlugin(this.routerId, plugin.id), plugin).then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "编辑插件成功"
                                });
                                // close edit area
                                this.cancelSaveRouterPlugin(formName);
                            }
                        });
                    }

                    if (this.pluginSaveAction === "CREATED") {
                        this.$oakRequest.post(this.$oakBackendApis.router.createdPlugin(this.routerId), plugin).then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    type: "success",
                                    message: "添加插件成功"
                                });
                                // close edit area
                                this.cancelSaveRouterPlugin(formName);
                            }
                        });
                    }
                });
            },
            executeRemoveRouterPlugin(plugin, formName) {
                this.$oakRequest.delete(this.$oakBackendApis.router.deletedPlugin(this.routerId, plugin.id)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "删除插件成功"
                        });
                    }
                    // close edit area
                    this.cancelSaveRouterPlugin(formName);
                });
            },
            createdAutoValidateAndData(basisPlugin) {
                this.pluginForms.id = basisPlugin.id || 0;
                this.pluginForms.name = basisPlugin.name;
                this.pluginForms.type = basisPlugin.type;
                this.pluginForms.description = basisPlugin.description;
                this.pluginForms.config = {};

                for (let [name, schema] of Object.entries(basisPlugin.config)) {
                    let data = {};
                    data.value = schema.default;
                    data.type = schema.type;
                    data.options = schema.options;
                    data.validateRules = [];

                    let rule = {
                        required: true,
                        trigger: 'change',
                        type: schema.type,
                        min: schema.minLength || schema.minimum,
                        max: schema.maxLength || schema.maximum,
                    };

                    if (rule.type === 'string') {
                        rule.message = `${name} 不合法，配置长度为（${rule.min} - ${rule.max}）`;
                    }

                    if (rule.type === 'number' || rule.type === 'integer') {
                        rule.message = `${name} 不合法，取值范围为（${rule.min} - ${rule.max}）`;
                    }

                    data.validateRules.push(rule);
                    this.$set(this.pluginForms.config, name, data);
                }
            },
            openUpdatedPlugin(plugin) {
                let basisPlugins = this.systemPlugins.filter(ele => {
                    return ele.name === plugin.name;
                });
                if (basisPlugins.length > 0) {
                    let basisPlugin = basisPlugins[0];
                    basisPlugin.id = plugin.id;
                    for (let [configOptionName] of Object.entries(basisPlugin.config)) {
                        basisPlugin.config[configOptionName].default = plugin.config[configOptionName];
                    }
                    this.createdAutoValidateAndData(basisPlugin);
                    this.pluginSaveAction = 'UPDATED';
                    this.pluginSaveRadio = 'CONFIG';
                    this.pluginSaveOpen = true;
                    this.pluginSaveTitle = `编辑插件【${basisPlugin.name}】`;
                }
            },
            openCreatedPlugin() {
                let routerPluginCurrentNames = [];
                this.routerPlugins.forEach(ele => {
                    routerPluginCurrentNames.push(ele.name);
                });

                this.systemPlugins = this.systemPlugins.filter(ele => {
                    return routerPluginCurrentNames.includes(ele.name) === false;
                });

                let basisPlugin = this.systemPlugins[0];
                this.createdAutoValidateAndData(basisPlugin);
                this.pluginSaveAction = 'CREATED';
                this.pluginSaveRadio = 'BASIS';
                this.pluginSaveOpen = true;
                this.pluginSaveTitle = `新增插件【${basisPlugin.name}】`;
            },
            changeCreatedPlugin(pluginName) {
                let basisPlugins = this.systemPlugins.filter(ele => {
                    return ele.name === pluginName;
                });
                if (basisPlugins.length > 0) {
                    this.createdAutoValidateAndData(basisPlugins[0]);
                }
            },
            updatedRouterAndSystemPlugins() {
                this.getRouterPlugins();
                this.getSystemPlugins();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .router-plugin-drawer {

        .drawer-title {
            padding: 24px;
            font-size: 20px;
            font-weight: 700;

            i {
                cursor: pointer;
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

    .el-main {
        background-color: #FAFAFA;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
</style>
