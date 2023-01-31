<template>
  <div class="main">
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item
        ><i
          style="color: #448ef7; font-size: 30px"
          class="iconfont icon-fuwuqi"
        />服务管理</a-breadcrumb-item
      >
    </a-breadcrumb>
    <a-divider style="margin: 10px 0" />

    <!-- 筛选 -->
    <div class="filter">
      <span>协议类型: </span>
      <a-select
        class="select"
        ref="select"
        v-model:value="params.protocol"
        placeholder="请选择"
        @change="handleChange"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">HTTP</a-select-option>
        <a-select-option value="2">HTTPS</a-select-option>
        <a-select-option value="3">HTTP&HTTPS</a-select-option>
      </a-select>

      <span>启动状态: </span>
      <a-select
        class="select"
        ref="select"
        v-model:value="params.enable"
        placeholder="请选择"
        @change="handleChange"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">启用</a-select-option>
        <a-select-option value="2">停用</a-select-option>
      </a-select>

      <span>发布状态: </span>
      <a-select
        class="select"
        ref="select"
        v-model:value="params.release"
        placeholder="请选择"
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

      <!-- 新增 -->
      <a-button type="primary" @click="addFn(aaaa)"
        ><i class="iconfont icon-addNode" />新增服务</a-button
      >
    </div>

    <!-- 列表 -->
    <a-table
      class="table"
      size="small"
      bordered
      :data-source="list"
      :columns="columns"
      :pagination="false"
    >
      <!-- 特殊标题头处理 -->
      <!-- 标题头——发布状态提醒 -->
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'release'">
          发布
          <a-tooltip placement="rightTop">
            <template #title>
              未发布：新增但未发布到数据面<br />
              待发布：当前配置与数据面不符<br />
              已发布：当前配置已发布数据面
            </template>
            <i class="iconfont icon-help color-orange" />
          </a-tooltip>
        </template>
      </template>

      <!-- 数据处理 -->
      <template #bodyCell="{ column, record }">
        <!-- 数据——ID增加连接跳转，名称增加可修改 -->
        <template v-if="column.dataIndex === 'id'">
          <a>{{ record.id }}</a> <br />
          <div class="editable-cell">
            <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
              <a-input
                class="edit-name"
                v-model:value="editableData[record.key].name"
                @pressEnter="save(record.key)"
              />
              <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
            </div>

            <div v-else class="editable-cell-text-wrapper">
              {{ record.name || ' ' }}
              <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
            </div>
          </div>
        </template>

        <template v-if="column.dataIndex === 'domian'">
          <span v-if="record.domian.length > 1">
            <a-tooltip placement="bottomRight">
              <template #title>
                <span v-for="(domian, domianIndex) in record.domian" :key="domianIndex">
                  {{ domian }}<br />
                </span>
              </template>
              <span> {{ record.domian[0] }} ...</span>
            </a-tooltip>
          </span>
          <span v-else> {{ record.domian[0] }} </span>
        </template>

        <!-- 数据——名称增加可直接编辑 -->

        <!-- 协议类型 -->
        <template v-if="column.dataIndex === 'protocol'">
          <span v-if="record.protocol === 1" class="color-blue">
            {{ filter.HookProtocal(record.protocol) }}
          </span>
          <span v-if="record.protocol === 2" class="color-orange">
            {{ filter.HookProtocal(record.protocol) }}
          </span>
          <span v-if="record.protocol === 3" class="color-purple">
            {{ filter.HookProtocal(record.protocol) }}
          </span>
        </template>

        <!-- 插件 -->
        <template v-if="column.dataIndex === 'plugin'">
          <a-tooltip
            placement="bottomRight"
            v-for="(pluginInfo, pluginIndex) in record.plugin"
            :key="pluginIndex"
          >
            <template #title>
              {{ pluginInfo.name }}
            </template>
            <i class="iconfont" :class="[pluginInfo.icon, pluginInfo.color]" />
          </a-tooltip>
        </template>

        <!-- 发布状态 -->
        <template v-if="column.dataIndex === 'release'">
          <span v-if="record.release === 1" class="color-grey font-bold">
            {{ filter.HookRelease(record.release) }}
          </span>
          <span v-if="record.release === 2" class="color-orange font-bold">
            {{ filter.HookRelease(record.release) }}
          </span>
          <span v-if="record.release === 3" class="color-green font-bold">
            {{ filter.HookRelease(record.release) }}
          </span>
        </template>

        <!-- 启用状态 -->
        <template v-if="column.dataIndex === 'enable'">
          <a-switch v-model:checked="record.enable" @click="changeEnable" />
        </template>

        <!-- 数据——增加所有列表数据操作 -->
        <template v-if="column.dataIndex === 'operation'">
          <span>
            <!-- 转换协议的ID为协议名称 -->

            <a>{{ record.name }}</a>
            <a-divider type="vertical" />
            <a>编辑</a>
            <a-divider type="vertical" />
            <a> 删除 </a>
          </span>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
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
import { $serviceList } from '@/api'
import { HookProtocolToName, HookReleaseToName, HookEnableToName } from '@/hooks'
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'

export default {
  components: { CheckOutlined, EditOutlined },

  setup() {
    const onChange = () => {}
    const onSearch = () => {}

    const data = reactive({
      params: reactive({
        protocol: null,
        enable: null,
        release: null,
        search: '',
        page: 1,
        pageSize: 10
      }),
      list: ref([]),
      listCount: 0
    })

    const filter = reactive({
      HookProtocal: HookProtocolToName,
      HookRelease: HookReleaseToName,
      HookEnable: HookEnableToName
    })

    const params = reactive({
      protocol: null,
      enable: null,
      release: null,
      search: '',
      page: 1,
      pageSize: 10
    })

    // 自带文本过长省略属性 ellipsis: true
    const columns = reactive([
      { title: 'ID/名称', dataIndex: 'id' },
      { title: '域名', dataIndex: 'domian' },
      { title: '协议', dataIndex: 'protocol' },
      { title: '插件', dataIndex: 'plugin' },
      { title: '发布', dataIndex: 'release' },
      { title: '启用', dataIndex: 'enable' },
      { title: '操作', dataIndex: 'operation' }
    ])

    const dataList = reactive([
      {
        id: 'sv-HU4wzmiSmWJsDTN',
        name: 'sv-HU4wzmiSmWJsDTN',
        domian: ['www.apioak.com-1'],
        protocol: 1,
        plugin: [{}],
        release: 1,
        enable: 1
      },
      {
        id: 'sv-ThD8Ga3NLnlSAAv',
        name: 'sv-ThD8Ga3NLnlSAAvasd',
        domian: ['www.apioak.com-2-1', 'www.apioak.com-2-2'],
        protocol: 2,
        plugin: [{}],
        release: 2,
        enable: 2
      },
      {
        id: 'sv-ThD8Ga3NLnlSAAv',
        name: 'sv-ThD8Ga3NLnlSAAvasd',
        domian: ['www.apioak.com-2-1', 'www.apioak.com-2-2'],
        protocol: 3,
        plugin: [{}],
        release: 3,
        enable: 2
      }
    ])

    const list = ref([])

    // 获取服务列表
    const getList = async params => {
      let { code, data: dataList, msg } = await $serviceList(params)
      if (code != 0) {
        message.error(msg)
      } else {
        data.listCount = dataList.total
        let key = 0
        dataList.data.forEach(element => {
          let plugins = ref([])
          if (element.plugin_list.length > 0) {
            element.plugin_list.forEach(pluginElement => {
              plugins.value.push({
                name: pluginElement.name,
                color:
                  pluginElement.enable == 1
                    ? 'color-plugin-' + pluginElement.type
                    : 'color-plugin-0',
                icon: pluginElement.length != 0 ? pluginElement.icon : 'icon-apex_plugin1'
              })

              console.log('==========', pluginElement)
            })
          }

          list.value.push({
            key: key++,
            id: element.res_id,
            name: element.name,
            domian: element.service_domains,
            protocol: element.protocol,
            release: element.release,
            enable: element.enable == 1 ? true : false,
            plugin: plugins
          })
        })

        console.log('------------', params, code, msg, '------', list)
      }
    }

    // 调接口获取服务列表
    getList()

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

    const changeEnable = async enable => {
      message.success('开关状态：' + enable == true ? '1' : '2')
    }

    // 编辑名称
    const editableData = reactive({})
    const edit = key => {
      editableData[key] = cloneDeep(list.value.filter(item => key === item.key)[0])
    }
    const save = key => {
      Object.assign(list.value.filter(item => key === item.key)[0], editableData[key])
      delete editableData[key]
    }
    const onDelete = key => {
      list.value = list.value.filter(item => item.key !== key)
    }

    return {
      zh_CN,
      data,
      value: '',
      current: 1,
      columns,
      list,
      dataList,
      onChange,
      onSearch,
      handleChange,
      params,
      addFn,
      visible,
      afterVisibleChange,
      filter,
      changeEnable,
      edit,
      save,
      onDelete,
      editableData
    }
  }
}
</script>

<style lange="scss" scoped>
.main {
  padding: 10px;
}
.breadcrumb {
  font-size: 20px;
}
.select {
  width: 135px;
  margin-right: 20px;
}
.search {
  width: 260px;
  border-radius: 10px;
}
.filter {
  margin: 20px 0;
}
.filter button {
  float: right;
}
.table {
  margin: 20px 0px;
}
.edit-name {
  width: 90%;
  margin-right: 5px;
}
.page {
  margin: 20px 0px 20px 0px;
  display: flex;
  justify-content: right;
}
</style>
