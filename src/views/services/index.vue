<template>
  <div class="main">
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
    <a-divider />

    <div class="filter">
      <a-select
        class="select"
        ref="select"
        v-model:value="params.protocol"
        placeholder="协议类型"
        @change="handleChange"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">HTTP</a-select-option>
        <a-select-option value="2">HTTPS</a-select-option>
        <a-select-option value="3">HTTP&HTTPS</a-select-option>
      </a-select>

      <a-select
        class="select"
        ref="select"
        v-model:value="params.enable"
        placeholder="启用状态"
        @change="handleChange"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">启用</a-select-option>
        <a-select-option value="2">停用</a-select-option>
      </a-select>

      <a-select
        class="select"
        ref="select"
        v-model:value="params.release"
        placeholder="发布状态"
        @change="handleChange"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">未发布</a-select-option>
        <a-select-option value="2">待发布</a-select-option>
        <a-select-option value="2">已发布</a-select-option>
      </a-select>

      <a-input-search
        class="search"
        v-model:value="params.search"
        placeholder="搜索内容"
        enter-button
        @search="handleChange"
        @pressEnter="handleChange"
      />
      <a-button type="primary" @click="addFn(aaaa)">新增服务</a-button>
    </div>

    <a-table
      class="table"
      bordered
      :data-source="dataList"
      :columns="columns"
      :pagination="false"
      size="small"
    />

    <a-config-provider :locale="zh_CN">
      <a-pagination
        class="page"
        v-model:current="current"
        show-quick-jumper
        :total="500"
        @change="onChange"
      />
    </a-config-provider>
  </div>

  <a-drawer
    v-model:visible="visible"
    class="custom-class"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    width="45%"
    @after-visible-change="afterVisibleChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

export default {
  setup() {
    const onChange = () => {}
    const onSearch = () => {}

    const params = reactive({
      protocol: null,
      enable: null,
      release: null,
      search: ''
    })

    const columns = reactive([
      {
        title: 'name',
        dataIndex: 'name',
        width: '30%'
      },
      {
        title: 'age',
        dataIndex: 'age'
      },
      {
        title: 'address',
        dataIndex: 'address'
      },
      {
        title: 'operation',
        dataIndex: 'operation'
      }
    ])
    const dataList = reactive([
      {
        key: '0',
        name: 'Edward King 0',
        age: 32,
        address: 'London, Park Lane no. 0'
      },
      {
        key: '1',
        name: 'Edward King 1',
        age: 32,
        address: 'London, Park Lane no. 1'
      }
    ])

    const handleChange = () => {
      message.success('触发筛选条件！')
    }

    const visible = ref(false)

    const addFn = async params => {
      visible.value = true
      message.success('新增服务！', params)
    }

    const afterVisibleChange = async () => {
      message.success('抽屉状态变化后！', visible.value)
    }

    return {
      zh_CN,
      value: '',
      current: 1,
      columns,
      dataList,
      onChange,
      onSearch,
      handleChange,
      params,
      addFn,
      visible,
      afterVisibleChange
    }
  }
}
</script>

<style lange="scss" scoped>
.page {
  margin: 20px 0px;
  display: flex;
  justify-content: right;
}
.main {
  padding: 10px;
}
.breadcrumb {
  padding-top: 5px;
}
.select {
  width: 150px;
  margin-right: 20px;
}
.search {
  width: 260px;
  border-radius: 10px;
}
.filter button {
  float: right;
  margin-right: 10px;
}
.table {
  margin: 20px 0px;
}
</style>
