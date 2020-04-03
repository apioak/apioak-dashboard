<template>
    <el-drawer :visible.sync="open_" :direction="direction" :with-header="withHeader" :size="size"
               class="project-member-drawer" :projectId="projectId" :isAdmin="isAdmin">
        <p class="drawer-title">
            <span v-html="title"></span>
            <i class="el-icon-close fr" @click="cancelMember"></i>
        </p>
        <div class="list-table">
            <div v-if="isAdmin">
                <el-button type="primary" size="small" class="fr" @click="openCreateMember">添加</el-button>
            </div>
            <div class="addNewUser-container" v-if="projectMemberCreatedOpen">
                <el-form :model="projectMemberForm" :rules="projectMemberRules"
                         ref="projectMemberForm" label-width="100px" class="user-ruleForm">
                    <el-form-item label="选择成员" prop="user_id" style="width:350px;">
                        <el-select v-model="projectMemberForm.user_id" filterable placeholder="请选择成员"
                                   style="width:265px;">
                            <el-option v-for="systemMember in systemMembers" :key="systemMember.id"
                                       :label="systemMember.name"
                                       :value="systemMember.id">
                                <span style="float: left">{{ systemMember.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ systemMember.email }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理员" prop="is_admin">
                        <el-switch v-model="projectMemberForm.is_admin" active-color="#13ce66"
                                   :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="executeSaveProjectMember('projectMemberForm')"
                                   size="small">完成
                        </el-button>
                        <el-button @click="cancelSaveProjectMember('projectMemberForm')" size="small">取消
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table class="myList-table" :data="projectMembers">
                <el-table-column label="用户名" prop="name"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="管理员" prop="description">
                    <template slot-scope="member">
                        <el-switch v-model="member.row.is_admin" active-color="#13ce66" :active-value="1"
                                   :inactive-value="0"
                                   @change="executeChangeProjectMemberRole($event,member.row, 'projectMemberForm')"
                                   :disabled="!isAdmin">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="member">
                        <el-popconfirm
                                confirmButtonText='确定'
                                cancelButtonText='取消'
                                icon="el-icon-info"
                                iconColor="red"
                                @onConfirm="removeProjectMember(member.row)"
                                title="确定删除该成员吗？">
                            <el-button slot="reference" type="danger" size="mini" :disabled="!isAdmin">删除</el-button>
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
            projectId: {
                type: Number,
                default: 0,
            },
            isAdmin: {
                type: Boolean,
                default: false,
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
                default: "项目成员",
            }
        },
        data() {
            return {
                projectMembers: [],
                systemMembers: [],
                projectMemberCreatedOpen: false,
                projectMemberForm: {
                    user_id: "",
                    is_admin: ""
                },
                projectMemberRules: {
                    user_id: [
                        {
                            type: 'number',
                            required: true,
                            message: "请选择成员",
                            trigger: "change",
                            min: 1,
                        }
                    ]
                },
            }
        },
        watch: {
            open(value) {
                if (value) {
                    if (this.projectId > 0) {
                        this.$nextTick(this.updatedProjectAndSystemMembers());
                        // this.getProjectMembers(this.projectId);
                    } else {
                        this.cancelMember();
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
                    this.projectMembers = [];
                    this.systemMembers = [];
                    this.projectMemberCreatedOpen = false;
                    this.$emit("changeMemberProject", val);
                }
            }
        },
        methods: {
            cancelMember() {
                this.open_ = false;
            },
            getProjectMembers(projectId) {
                this.$oakRequest.get(this.$oakBackendApis.project.members(projectId), this.projectForm).then(res => {
                    if (res.status === 200) {
                        let members = res.data.members;
                        if (Object.keys(members).length > 0) {
                            this.projectMembers = members;
                        } else {
                            this.projectMembers = [];
                        }
                    }
                });
            },
            getSystemMembers() {
                this.$oakRequest.get(this.$oakBackendApis.common.members).then(res => {
                    if (res.status === 200) {
                        let members = res.data.members;
                        if (Object.keys(members).length > 0) {
                            this.systemMembers = members;
                        } else {
                            this.systemMembers = [];
                        }
                    }
                });
            },
            openCreateMember() {
                let projectMemberEmails = [];
                this.projectMembers.forEach(ele => {
                    projectMemberEmails.push(ele.email);
                });
                this.systemMembers = this.systemMembers.filter(ele => {
                    return projectMemberEmails.includes(ele.email) === false;
                });
                this.projectMemberCreatedOpen = true;
            },
            executeSaveProjectMember(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    }
                    this.$oakRequest.post(this.$oakBackendApis.project.createdMember(this.projectId), this.projectMemberForm).then(res => {
                        if (res.status === 200) {
                            this.$message({
                                type: "success",
                                message: "添加成员成功"
                            });
                            // updated project and system members
                            this.updatedProjectAndSystemMembers();
                            // close edit area
                            this.cancelSaveProjectMember(formName);
                        }
                    });
                });
            },
            executeChangeProjectMemberRole(is_admin, member, formName) {
                this.$oakRequest.put(this.$oakBackendApis.project.updatedMember(this.projectId, member.id), {is_admin: is_admin}).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "修改成功"
                        });
                        // updated project and system members
                        this.updatedProjectAndSystemMembers();
                        // close edit area
                        this.cancelSaveProjectMember(formName);
                    }
                });
            },
            removeProjectMember(member) {
                this.$oakRequest.delete(this.$oakBackendApis.project.deletedMember(this.projectId, member.id)).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功"
                        });
                        this.getProjectMembers(this.projectId);
                    }
                });
            },
            updatedProjectAndSystemMembers() {
                this.getProjectMembers(this.projectId);
                this.getSystemMembers();
            },
            cancelSaveProjectMember(formName) {
                this.$refs[formName].resetFields();
                this.projectMemberCreatedOpen = false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .project-member-drawer {
        .drawer-title {
            padding: 24px;
            font-size: 20px;
            font-weight: 700;

            i {
                cursor: pointer;
            }
        }

        .list-table {
            width: 100%;
            padding: 20px 32px;
            box-sizing: border-box;

            .myList-table {
                padding: 0 12px;
                box-sizing: border-box;
            }
        }
    }
</style>
