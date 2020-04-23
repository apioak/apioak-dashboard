<template>
    <div>
        <div class="project-container">
            <div class="project-header">
                <el-button class="fl" type="primary" @click="openCreatedProject"
                           style="margin-right:10px;" icon="el-icon-edit">新建项目
                </el-button>
                <el-form :inline="true" :model="projectQueryData" class="project-form-inline">
                    <el-form-item>
                        <el-input v-model="projectQueryData.name" placeholder="输入项目名称"
                                  prefix-icon="el-icon-search" @keyup.enter.native="queryProjectByName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryProjectByName" icon="el-icon-search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="project-table-container app-content" v-if="projectCount > 0">
                <el-table class="project-table" :data="projectTableLists">
                    <el-table-column width="40px">
                        <template slot-scope="project">
                            <div>
                                <img @click="openPluginProject(project.row)"
                                     style="width:24px;cursor:pointer;vertical-align: middle;"
                                     src="@/assets/plugin-icon.png" alt="plugin"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目名称" prop="name"></el-table-column>
                    <el-table-column label="项目角色">
                        <template slot-scope="project">
                            <el-tag :type="project.row.is_admin === 1 ? 'primary': 'success'" size="mini">
                                {{project.row.is_admin === 1 ? '管理员': '成员'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目路径" prop="path"></el-table-column>
                    <el-table-column label="项目描述" prop="description"></el-table-column>
                    <el-table-column label="操作" width="400px;">
                        <template slot-scope="project">
                            <el-button type="primary" size="small" style="margin-right:0px;"
                                       @click="openUpdatedProject(project.row)"
                                       :disabled="project.row.is_admin !== 1">编辑
                            </el-button>
                            <el-button type="success" size="small" @click="openDetailProject(project.row)"
                                       style="margin-right:10px;">详情
                            </el-button>

                            <el-popconfirm
                                    confirmButtonText='确定'
                                    cancelButtonText='取消'
                                    icon="el-icon-info"
                                    iconColor="red"
                                    @onConfirm="removeProject(project.row)"
                                    title="确定删除该项目吗？" style="margin-right:10px;">
                                <el-button slot="reference" type="danger" size="small"
                                           :disabled="project.row.is_admin !== 1">删除
                                </el-button>
                            </el-popconfirm>
                            <el-button type="warning" size="small" @click="openMemberProject(project.row)">成员
                            </el-button>
                            <el-button size="small" @click="redirectRouters(project.row)">APIs</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="changePageSize" @current-change="changePageNumber"
                               :current-page="pageNum" :page-sizes="pageSizes" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="projectCount"
                               class="project-pagination">
                </el-pagination>
            </div>

            <div class="empty-content" v-else>
                <img src="@/assets/empty-background.png" class="empty-background">
            </div>

            <project-created :open="optionCreatedProjectOpen" :projectId="optionCreatedProjectId"
                             @changeCreatedProject="changeCreatedProject"></project-created>

            <project-updated :open="optionUpdatedProjectOpen" :projectId="optionUpdatedProjectId"
                             @changeUpdatedProject="changeUpdatedProject"></project-updated>

            <project-detail :open="optionDetailProjectOpen" :projectId="optionDetailProjectId"
                            @changeDetailProject="changeDetailProject"></project-detail>

            <project-member :open="optionMemberProjectOpen" :projectId="optionMemberProjectId"
                            :isAdmin="optionMemberProjectAdmin"
                            @changeMemberProject="changeMemberProject"></project-member>

            <project-plugin :open="optionPluginProjectOpen" :projectId="optionPluginProjectId"
                            :isAdmin="optionPluginProjectAdmin"
                            @changePluginProject="changePluginProject"></project-plugin>

        </div>
    </div>
</template>
<script>
    import ProjectCreated from './updated';
    import ProjectUpdated from './updated';
    import ProjectDetail from './detail';
    import ProjectMember from './member';
    import ProjectPlugin from './plugin';

    export default {
        name: "projects",
        components: {
            ProjectCreated,
            ProjectUpdated,
            ProjectDetail,
            ProjectMember,
            ProjectPlugin,
        },
        data() {
            return {
                // Project Created
                optionCreatedProjectOpen: false,
                optionCreatedProjectId: 0,

                // Project Updated
                optionUpdatedProjectOpen: false,
                optionUpdatedProjectId: 0,

                // Project Detail
                optionDetailProjectOpen: false,
                optionDetailProjectId: 0,

                // Project Member
                optionMemberProjectOpen: false,
                optionMemberProjectId: 0,
                optionMemberProjectAdmin: false,

                // Project Plugin
                optionPluginProjectOpen: false,
                optionPluginProjectId: 0,
                optionPluginProjectAdmin: false,

                projectCount: 0,
                projectLists: [],
                projectTableLists: [], // page table data
                projectQueryData: {
                    name: '',
                },

                pageSize: 10,
                pageNum: 1, // current page number
                pageSizes: [10, 15, 20]
            };
        },
        created() {
            this.getProjects();
        },
        methods: {
            changePageSize(val) {
                this.pageSize = val;
                this.initTable();
            },
            changePageNumber(val) {
                this.pageNum = val;
                this.initTable();
            },
            // init page table data
            initTable() {
                this.projectTableLists = [];
                this.pageNum = this.pageNum > 1 ? this.pageNum : 1;

                let beginIndex = (this.pageNum - 1) * this.pageSize;

                let endIndex = beginIndex + this.pageSize;

                if (endIndex > this.projectCount) {
                    endIndex = this.projectCount;
                }

                for (let i = beginIndex; i < endIndex; i++) {
                    if (this.projectLists[i]) {
                        this.projectTableLists.push(this.projectLists[i]);
                    }
                }
            },
            getProjects() {
                this.$oakRequest.get(this.$oakBackendApis.common.projects).then(res => {
                    if (res.status === 200) {
                        let projects = res.data.projects;
                        let projectCount = Object.keys(projects).length;
                        if (projectCount > 0) {
                            this.projectLists = projects;
                            this.projectCount = projectCount;
                            this.pageNum = 1;
                            this.initTable();
                        } else {
                            this.projectLists = [];
                            this.projectCount = 0;
                        }
                    }
                });
            },

            openCreatedProject() {
                this.optionCreatedProjectOpen = true;
                this.optionCreatedProjectId = 0;
            },

            changeCreatedProject(val) {
                this.optionCreatedProjectOpen = false;
                this.optionCreatedProjectId = 0;
                this.getProjects();
            },

            openUpdatedProject(project) {
                this.optionUpdatedProjectOpen = true;
                this.optionUpdatedProjectId = project.id;
            },

            changeUpdatedProject(val) {
                this.optionUpdatedProjectOpen = false;
                this.optionUpdatedProjectId = 0;
                this.getProjects();
            },

            openDetailProject(project) {
                this.optionDetailProjectOpen = true;
                this.optionDetailProjectId = project.id;
            },

            changeDetailProject(val) {
                this.optionDetailProjectOpen = false;
                this.optionDetailProjectId = 0;
            },

            openMemberProject(project) {
                this.optionMemberProjectOpen = true;
                this.optionMemberProjectId = project.id;
                this.optionMemberProjectAdmin = project.is_admin === 1;
            },

            changeMemberProject(val) {
                this.optionMemberProjectOpen = false;
                this.optionMemberProjectId = 0;
                this.optionMemberProjectAdmin = false;
            },

            openPluginProject(project) {
                this.optionPluginProjectOpen = true;
                this.optionPluginProjectId = project.id;
                this.optionPluginProjectAdmin = project.is_admin === 1;
            },

            changePluginProject(val) {
                this.optionPluginProjectOpen = false;
                this.optionPluginProjectId = 0;
                this.optionPluginProjectAdmin = false;
            },

            redirectRouters(project) {
                this.$router.push({
                    name: "routers",
                    params: {
                        projectId: project.id,
                    }
                });
            },

            removeProject(project) {
                this.$oakRequest.delete(this.$oakBackendApis.project.deleted(project.id)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "删除项目成功"
                        });
                        this.getProjects();
                    }
                });
            },

            queryProjectByName() {
                let name = this.projectQueryData.name.trim();
                if (name) {
                    this.projectLists = this.projectLists.filter(ele => {
                        return ele.name.includes(name);
                    });
                    this.initTable();
                } else {
                    this.getProjects();
                }
            },
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

    .fe-inline-table .resizeInputClass /deep/ .el-form-item__content {
        margin-left: 0 !important;
    }

    .fe-inline-table .resizeInputClass.el-form-item {
        margin-bottom: 0 !important;
    }
</style>
<style lang="scss" scoped>
    .project-container {
        width: 100%;
        height: 100%;

        .project-header {
            padding: 20px 32px 1px;
            box-sizing: border-box;
        }

        .project-table-container {
            padding: 0 32px;
            box-sizing: border-box;
            box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);

            .project-table {
                background-color: #fff;
                padding: 16px 24px;
            }

            .project-pagination {
                background-color: #fff;
                padding: 8px 24px;
            }
        }
    }

    .empty-content {
        width: 100%;
        height: calc(100vh - 64px);
        position: relative;

        .empty-background {
            width: 500px;
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>
