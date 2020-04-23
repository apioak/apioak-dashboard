<template>
    <div class="dash__nav">
        <div :class="openSidebar ? 'menu-logo2' : 'menu-logo'">
            <img src="~@/assets/logo.png" class="logo"/>
        </div>
        <h3 v-if="openSidebar">APIOAK</h3>
        <h3 v-else class="collapse">OAK</h3>
        <el-menu :collapse="!openSidebar" :default-active="defaultActiveMenu" class="el-menu-vertical-demo"
                 background-color="#0f2543" :unique-opened="true" text-color="#909399" active-text-color="#ffffff"
                 :collapse-transition="false" :router="true">
            <template v-for="(item, index) in navList">
                <el-menu-item :index="item.routerLink" :key="index" v-if="item.isShow ||  is_owner === true">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        data() {
            return {
                defaultActiveMenu: '',
                is_owner: false, //是否是超管
                navList: [
                    {
                        name: "项目管理",
                        icon: "el-icon-document",
                        routerLink: "projects",
                        isShow: true
                    },
                    {
                        name: "路由管理",
                        icon: "el-icon-s-promotion",
                        routerLink: "routers",
                        isShow: true
                    },
                    {
                        name: "用户管理",
                        icon: "el-icon-s-custom",
                        routerLink: "users",
                        isShow: false
                    },
                ]
            };
        },
        computed: {
            ...mapState({
                openSidebar: state => state.global.openSidebar,
            })
        },
        created() {
            let adminOwner = this.$cookies.get(this.$oakConst.cookies.APIOAK_ADMIN_OWNER);
            if (Number(adminOwner) === 1) {
                this.is_owner = true;
            } else {
                this.is_owner = false;
            }
        },
        mounted() {
            this.defaultActiveMenu = this.$route.name;
        },
        watch: {
            '$route.name': function (newName, oldName) {
                this.defaultActiveMenu = newName;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .dash__nav {
        flex: 1;

        h3 {
            padding: 20px 20px 20px 24px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;

            &.collapse {
                padding: 20px 0;
                text-align: center;
            }
        }
    }

    .el-menu {
        border-right: none;
    }

    .menu-logo2 {
        height: 64px;
        padding: 10px 20px 10px 24px;
        box-sizing: border-box;

        .logo {
            width: 40px;
            height: 40px;
            margin-top: 10px;
        }
    }

    .menu-logo {
        height: 64px;
        padding: 12px;
        box-sizing: border-box;

        .logo {
            width: 40px;
            height: 40px;
            margin-top: 0px;
        }
    }
</style>
