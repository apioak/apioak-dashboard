<template>
    <div class="detail">
        <view-header style="border-bottom:0;" name="服务"></view-header>
         <el-tabs class="detail-tab" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="管理API" name="api">
                <api-component></api-component>
            </el-tab-pane>
            <!-- <el-tab-pane label="插件列表" name="second">插件列表</el-tab-pane> -->
        </el-tabs>
    </div>
</template>
<script>
import api from '@/api';
const apiComponent =()=> import('./pages/api');
export default {
    name:'serviceDetail',
    data(){
        return {
           activeName:this.$route.query.tab
        }
    },
    components:{
        apiComponent,
    },
    created(){
    },
    methods:{
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>
<style lang="scss">
    .el-tabs__nav-scroll{
        padding-left: 20px;
        background: #fff;
    }
</style>
<style lang="scss" scoped>
</style>
