<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="api-drawer detail" :routerId="routerId" :title="title">
        <p class="api-drawer_tit">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelDetail"></i>
        </p>
        <div class="part-info api-detail-info">
            <h3>基本信息</h3>
            <div>
                <p>
                    <span class="tit">所属项目</span>
                    <span class="cont">{{ router.project_name }}</span>
                </p>
                <p>
                    <span class="tit">API名称</span>
                    <span class="cont">{{ router.name }}</span>
                </p>
                <p>
                    <span class="tit">备注</span>
                    <span class="cont">{{ router.description }}</span>
                </p>
            </div>
            <h3>前端信息</h3>
            <div>
                <p>
                    <span class="tit">请求方式</span>
                    <span class="cont">{{ router.request_method }}</span>
                </p>
                <p>
                    <span class="tit">请求路径</span>
                    <span class="cont">{{ router.project_path + router.request_path }}</span>
                </p>
                <p>
                    <span class="tit">跨域请求</span>
                    <span class="cont">{{ router.enable_cors ? '启用':'禁用' }}</span>
                </p>
                <p>
                    <span class="tit">参数配置</span>
                    <el-table size="mini" :data="router.request_params" style="margin-left:40px;"
                              header-cell-style="background:#fafafa">
                        <el-table-column label="参数" prop="name"></el-table-column>
                        <el-table-column label="位置" prop="position"></el-table-column>
                        <el-table-column label="必填">
                            <template slot-scope="scope">{{ scope.row.required ? '是' : '否' }}</template>
                        </el-table-column>
                        <el-table-column label="类型" prop="type"></el-table-column>
                        <el-table-column label="默认值" prop="default_val"></el-table-column>
                        <el-table-column label="描述" prop="description"></el-table-column>
                    </el-table>
                </p>
            </div>
            <h3>后端信息</h3>
            <div>
                <p>
                    <span class="tit">请求方式</span>
                    <span class="cont">{{ router.backend_method }}</span>
                </p>
                <p>
                    <span class="tit">请求路径</span>
                    <span class="cont">{{ router.backend_path }}</span>
                </p>
                <p>
                    <span class="tit">参数配置</span>
                    <el-table size="mini" :data="router.backend_params" style="margin-left:40px;"
                              header-cell-style="background:#fafafa">
                        <el-table-column label="后端参数名" prop="request_param_name"></el-table-column>
                        <el-table-column label="后端参数位置" prop="request_param_position"></el-table-column>
                        <el-table-column label="前端参数名" prop="name">
                        </el-table-column>
                        <el-table-column label="前端参数位置" prop="position">
                        </el-table-column>
                        <el-table-column label="前端参数类型">
                            <template slot-scope="scope">
                                <div>{{ router.request_params[scope.$index].type }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" prop="request_param_description"></el-table-column>
                    </el-table>
                </p>
                <p>
                    <span class="tit">常量参数</span>
                    <el-table size="mini" :data="router.constant_params" style="margin-left:40px;"
                              header-cell-style="background:#fafafa">
                        <el-table-column label="参数" prop="name"></el-table-column>
                        <el-table-column label="位置" prop="position"></el-table-column>
                        <el-table-column label="参数值" prop="value"></el-table-column>
                        <el-table-column label="描述" prop="description"></el-table-column>
                    </el-table>
                </p>
            </div>
            <h3>响应信息</h3>
            <div>
                <p>
                    <span class="tit">返回类型</span>
                    <span class="cont">{{ router.response_type }}</span>
                </p>
                <p>
                    <span class="tit" style="margin-left:28px;margin-bottom:12px;">成功响应示例</span>
                    <el-input type="textarea" v-model="router.response_success" disabled
                              style="margin-left:32px;width:80%;"></el-input>
                </p>
                <p>
                    <span class="tit" style="margin-left:28px;margin-bottom:12px;">失败响应示例</span>
                    <el-input type="textarea" v-model="router.response_failure" disabled
                              style="margin-left:32px;width:80%;"></el-input>
                </p>
                <p>
                    <span class="tit" style="margin-bottom:12px">错误码配置</span>
                    <el-table size="mini" :data="router.response_codes" style="margin-left:40px;"
                              header-cell-style="background:#fafafa">
                        <el-table-column label="错误码" prop="code"></el-table-column>
                        <el-table-column label="错误信息" prop="message"></el-table-column>
                        <el-table-column label="描述" prop="descriptio"></el-table-column>
                    </el-table>
                </p>
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
            title: {
                type: String,
                default: "路由详情",
            }
        },
        data() {
            return {
                router: {}
            }
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(val) {
                    this.$emit("changeDetailRouter", val);
                }
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.routerId) {
                        this.getRouter();
                    } else {
                        this.cancelDetail();
                    }
                }
            }
        },
        methods: {
            cancelDetail() {
                this.open_ = false;
            },
            getRouter() {
                if (this.routerId > 0) {
                    this.$oakRequest.get(this.$oakBackendApis.router.query(this.routerId)).then(res => {
                        if (res.status === 200) {
                            let router = res.data.router;
                            if (Object.keys(router).length > 0) {
                                this.router = router;
                            } else {
                                this.router = {};
                            }
                        }
                    });
                }
            },
        }
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
