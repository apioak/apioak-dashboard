<template>
  <div class="service">
    <view-header name="服务"></view-header>
    <div class="service-list">
      <el-button class="service-add fl" type="primary" @click="drawer = true , title = '添加服务'">新建服务</el-button>
      <el-table class="service-table" :data="list">
        <el-table-column label="服务名称" prop="service_name"></el-table-column>
        <el-table-column label="服务前缀" prop="service_prefix"></el-table-column>
        <el-table-column label="备注" prop="service_desc"></el-table-column>
        <el-table-column label="活动状态">
          <template>
            <el-button type="primary" plain size="small">编辑</el-button>
            <el-button type="danger" plain size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      class="service-drawer"
      :title="title"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
    >
      <p class="service-drawer_tit">
          <span v-html="title"></span>
          <i class="el-icon-close fr" @click="drawer = false"></i>
      </p>
      <el-form class="service-form" :rules="rules" ref="ruleForm" :model="form" label-width="80px">
          <el-form-item label="服务名称" prop="service_name">
              <el-input placeholder="请输入服务名称"></el-input>
          </el-form-item>
          <el-form-item label="URL前缀" prop="service_prefix">
              <el-input placeholder="请输入服务前缀"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="service_desc">
              
          </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Service",
  data() {
    return {
      direction: "rtl",
      drawer: false,
      title:"添加服务",
      list: [
        {
          service_name: "课程",
          service_prefix: "/course",
          service_desc: "红岩是个大帅比"
        },
        {
          service_name: "商城",
          service_prefix: "/shop",
          service_desc: "进超也是个大帅比"
        }
      ],
      form:{
          service_name:"",
          service_prefix:"",
          service_desc:""
      },
      rules:{
          service_name:[
              { required: true, message: '请输入服务名称', trigger: 'blur' }
          ],
          service_prefix:[
              { required: true, message: '请输入前缀', trigger: 'blur' }
          ]
      }
    };
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.service {
  &-add {
    margin-bottom: 16px;
  }
  &-list {
    margin: 20px 32px;
  }
  &-table {
    padding: 16px 24px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
  }
  &-drawer {
      &_tit {
          padding: 24px;
          font-size: 20px;
          font-weight: 700;
          i{
              cursor: pointer;
          }
      }
  }
  &-form{
      padding: 0 24px;
  }
}
</style>
