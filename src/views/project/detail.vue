<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="project-detail-drawer" :projectId="projectId">
        <p class="project-drawer-tit">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelDetail"></i>
        </p>
        <div class="part-info api-detail-info">
            <h3>基本信息</h3>
            <div class="baseinfo">
                <p>
                    <span class="tit">项目名称:</span>
                    <span class="cont">{{ projectForm.name }}</span>
                </p>
                <p>
                    <span class="tit">项目路径:</span>
                    <span class="cont">{{ projectForm.path }}</span>
                </p>
                <p>
                    <span class="tit">项目描述:</span>
                    <span class="cont">{{ projectForm.description }}</span>
                </p>
            </div>
            <h3>上游服务</h3>
            <div class="upbox" v-for="(upstream, upstreamIndex) in projectForm.upstreams" :key="upstream.id">
                <div class="upbox-title-header">
                    <span class="title" v-if="upstream.env === 'PROD'">生产环境</span>
                    <span class="title" v-if="upstream.env === 'BETA'">预发环境</span>
                    <span class="title" v-if="upstream.env === 'TEST'">测试环境</span>
                </div>
                <div>
                    <p class="upbox-item">
                        <span class="upbox-item-name">主机地址:</span>
                        <span class="upbox-item-value">{{upstream.host}}</span>
                    </p>
                    <p class="upbox-item">
                        <span class="upbox-item-name">轮询算法:</span>
                        <span class="upbox-item-value">{{upstream.type}}</span>
                    </p>
                    <span class="sub-title">服务节点:</span>
                    <div v-for="(node, nodeIndex) in upstream.nodes" :key="nodeIndex">
                        <div class="fl-box">
                            <p class="fl-item">
                                <span class="fl-item-name">节点IP:</span>
                                <span class="fl-item-value">{{node.ip }}</span>
                            </p>
                            <p class="fl-item">
                                <span class="fl-item-name">节点端口:</span>
                                <span class="fl-item-value">{{node.port}}</span>
                            </p>
                            <p class="fl-item">
                                <span class="fl-item-name">节点权重:</span>
                                <span class="fl-item-value">{{node.weight}}</span>
                            </p>
                        </div>
                    </div>

                    <div class="time-item">
                        <span class="item-item-name">连接超时:</span>
                        <span class="item-item-value">{{upstream.timeouts.connect}}</span>
                    </div>
                    <div class="time-item">
                        <span class="item-item-name">发送超时:</span>
                        <span class="item-item-value">{{upstream.timeouts.send}}</span>
                    </div>
                    <div class="time-item time-item-end">
                        <span class="item-item-name">读取超时:</span>
                        <span class="item-item-value">{{upstream.timeouts.read}}</span>
                    </div>

                </div>
            </div>
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
            title: {
                type: String,
                default: "项目详情",
            }
        },
        data() {
            return {
                projectForm: {}
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.projectId > 0) {
                        this.getProjectById(this.projectId);
                    } else {
                        this.cancelDetail();
                    }
                }
            }
        },
        computed: {
            open_: {
                get() {
                    return this.open;
                },
                set(val) {
                    this.$emit("changeDetailProject", val);
                }
            }
        },
        methods: {
            cancelDetail() {
                this.open_ = false;
            },
            getProjectById(projectId) {
                this.$oakRequest.get(this.$oakBackendApis.project.query(projectId), this.projectForm).then(res => {
                    if (res.status === 200) {
                        this.projectForm = res.data.project;
                    }
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
    .project-detail-drawer {

        .project-drawer-tit {
            padding: 24px;
            font-size: 20px;
            font-weight: 700;

            i {
                cursor: pointer;
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

        .part-info {
            padding-left: 20px;

            .part-info_tit {
                padding-left: 20px;
            }
        }

        .upbox {
            padding-left: 50px;
            box-sizing: border-box;

            .upbox-title-header {
                padding-bottom: 20px;
            }

            .title {
                font-weight: bold;
                font-size: 16px;
            }

            .upbox-item {
                .upbox-item-name {
                    font-weight: bold;
                    font-size: 14px;
                    margin-right: 20px;
                }

                .upbox-item-value {
                    font-size: 14px;
                }
            }

            .sub-title {
                font-weight: bold;
                font-size: 14px;
                margin-right: 20px;
                padding-left: 60px;
            }

            .fl-box {
                height: 40px;
                line-height: 40px;
                overflow: hidden;
                padding-left: 60px;

                .fl-item {
                    float: left;

                    .fl-item-name {
                        font-weight: bold;
                        font-size: 14px;
                        margin-right: 15px;
                    }
                }
            }

            .time-item {
                line-height: 30px;

                .item-item-name {
                    padding-left: 60px;
                    font-weight: bold;
                    font-size: 14px;
                    margin-right: 15px;
                }
            }

            .time-item-end {
                margin-bottom: 20px;
                padding-bottom: 30px;
                border-bottom: 1px dashed #ccc;
            }
        }
    }
</style>
