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
        v-model:value="data.params.protocol"
        placeholder="请选择"
        @change="fn.paramsChange(data.params)"
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
        v-model:value="data.params.enable"
        placeholder="请选择"
        @change="fn.paramsChange(data.params)"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">启用</a-select-option>
        <a-select-option value="2">停用</a-select-option>
      </a-select>

      <span>发布状态: </span>
      <a-select
        class="select"
        ref="select"
        v-model:value="data.params.release"
        placeholder="请选择"
        @change="fn.paramsChange(data.params)"
      >
        <a-select-option value="0">全部</a-select-option>
        <a-select-option value="1">未发布</a-select-option>
        <a-select-option value="2">待发布</a-select-option>
        <a-select-option value="3">已发布</a-select-option>
      </a-select>

      <a-input-search
        class="search"
        v-model:value="data.params.search"
        placeholder="搜索内容"
        enter-button
        @search="fn.paramsChange(data.params)"
        @pressEnter="fn.paramsChange(data.params)"
      />

      <!-- 新增 -->
      <a-button type="primary" @click="fn.addFunc()"
        ><i class="iconfont icon-addNode" />新增服务</a-button
      >
    </div>

    <!-- 列表 -->
    <a-table
      class="table"
      size="small"
      bordered
      :columns="data.columns"
      :data-source="data.list"
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
        <template v-if="column.dataIndex === 'res_id'">
          <!-- 数据ID -->
          <a>{{ record.res_id }}</a> <br />

          <!-- 名称，支持单独修改 -->
          <div class="editable-cell">
            <div v-if="data.editName[record.res_id]" class="">
              <a-input
                class="edit-name"
                v-model:value="data.editName[record.res_id]"
                @pressEnter="fn.saveName(record)"
              />

              <a @click="fn.saveName(record)">
                <i class="iconfont icon-right-1" />
              </a>

              <a class="color-red edit-name-cancel" @click="fn.cancelName(record.res_id)">
                <i class="iconfont icon-error-1" />
              </a>
            </div>

            <div v-else class="editable-cell-text-wrapper">
              {{ record.name || ' ' }}
              <a @click="fn.editName(record.res_id, record.name)">
                <i class="iconfont icon-xiugai" />
              </a>
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
          <a-switch v-model:checked="record.enable" size="small" @click="fn.changeEnable(record)" />
        </template>

        <!-- 数据——增加所有列表数据操作 -->
        <template v-if="column.dataIndex === 'operation'">
          <span>
            <!-- 转换协议的ID为协议名称 -->
            <span v-if="record.release === 3" class="color-grey">
              <a-tooltip placement="top">
                <template #title> 发布 </template>
                <span>
                  <i class="iconfont icon-yuntongbu" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </span>

            <span v-else>
              <a-popconfirm
                placement="topLeft"
                title="确认发布到数据面?"
                ok-text="是"
                cancel-text="否"
                @confirm="fn.releaseFunc(record)"
              >
                <a class="color-green a-release"
                  ><a-tooltip placement="top">
                    <template #title> 发布 </template>
                    <span> <i class="iconfont icon-yuntongbu" /></span>
                  </a-tooltip>
                  <a-divider type="vertical"
                /></a>
              </a-popconfirm>
            </span>

            <a class="color-purple a-plugin">
              <a-tooltip placement="top">
                <template #title> 插件 </template>
                <span>
                  <i class="iconfont icon-chajiangongneng" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </a>

            <a class="color-blue a-router">
              <a-tooltip placement="top">
                <template #title> 路由 </template>
                <span>
                  <i class="iconfont icon-lianjie" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </a>

            <a class="color-blue a-edit">
              <a-tooltip placement="top">
                <template #title> 编辑 </template>
                <span>
                  <i class="iconfont icon-xiugai" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </a>

            <a-popconfirm
              placement="top"
              title="确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="fn.deleteFunc(record)"
            >
              <a class="color-red a-delete">
                <i class="iconfont icon-shanchu" />
              </a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <a-config-provider :locale="zh_CN">
      <a-pagination
        class="page"
        show-quick-jumper
        show-size-change
        :total="data.listCount"
        @showSizeChange="fn.showSizeChange"
        @change="fn.pageChange"
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
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { $serviceList, $serviceEditName, $serviceEnable } from '@/api'
import { HookProtocolToName, HookReleaseToName, HookEnableToName } from '@/hooks'

export default {
  components: {},

  setup() {
    onMounted(async () => {
      // 调接口获取服务列表
      getList()
    })

    const data = reactive({
      params: reactive({
        protocol: null,
        enable: null,
        release: null,
        search: '',
        page: 1,
        page_size: 10
      }),
      columns: reactive([]),
      list: ref([]),
      listCount: 0,
      editName: reactive({})
    })

    const filter = reactive({
      HookProtocal: HookProtocolToName,
      HookRelease: HookReleaseToName,
      HookEnable: HookEnableToName
    })

    // 自带文本过长省略属性 ellipsis: true
    data.columns = reactive([
      { title: 'ID/名称', dataIndex: 'res_id' },
      { title: '域名', dataIndex: 'domian' },
      { title: '协议', dataIndex: 'protocol' },
      { title: '插件', dataIndex: 'plugin' },
      { title: '发布', dataIndex: 'release' },
      { title: '启用', dataIndex: 'enable' },
      { title: '操作', dataIndex: 'operation' }
    ])

    // 获取服务列表
    const getList = async params => {
      let { code, data: dataList, msg } = await $serviceList(params)

      if (code != 0) {
        message.error(msg)
      } else {
        data.listCount = dataList.total
        let key = 0
        let tmpList = ref([])
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
            })
          }

          tmpList.value.push({
            key: key++,
            res_id: element.res_id,
            name: element.name,
            domian: element.service_domains,
            protocol: element.protocol,
            release: element.release,
            enable: element.enable == 1 ? true : false,
            plugin: plugins
          })
        })

        data.list = tmpList
      }
    }

    // 编辑名称
    const editName = async (resId, name) => {
      data.editName[resId] = name
    }

    // 修改名称
    const saveName = async record => {
      let { code, msg } = await $serviceEditName(record.res_id, data.editName[record.res_id])

      if (code != 0) {
        message.error(msg)
        return
      } else {
        message.success(msg)
        record.name = data.editName[record.res_id]
      }

      // 删除编辑名称本地内存中的数据
      delete data.editName[record.res_id]
    }

    // 取消修改名称
    const cancelName = async resId => {
      delete data.editName[resId]
    }

    // 分页——页码变化
    const pageChange = async page => {
      data.params.page = page

      getList(data.params)
    }

    // 分页——每页显示条数变化
    const showSizeChange = async (current, size) => {
      data.params.page = 1
      data.params.page_size = size

      getList(data.params)
    }

    // 参数变化筛选列表
    const paramsChange = async () => {
      data.params.page = 1

      getList(data.params)
    }

    // 开关状态变化
    const changeEnable = async record => {
      let enableValue = record.enable == true ? 1 : 2

      let { code, msg } = await $serviceEnable(record.res_id, enableValue)

      if (code != 0) {
        message.error(msg)
        if (record.enable == true) {
          record.enable = false
        } else {
          record.enable = true
        }
        return
      } else {
        message.success(msg)
        if (record.release == 3) {
          record.release = 2
        }
      }
    }

    // 配置发布
    const releaseFunc = async record => {
      console.log(record)
      message.success('发布按钮！')
    }

    const deleteFunc = async record => {
      console.log(record)
      message.success('删除按钮！')
    }

    const visible = ref(false)

    // 新增服务
    const addFunc = async () => {
      visible.value = true
      message.success('新增服务！')
    }

    const afterVisibleChange = async () => {
      message.success('抽屉状态变化后！', visible.value)
    }

    const fn = reactive({
      editName,
      saveName,
      cancelName,
      changeEnable,
      paramsChange,
      pageChange,
      showSizeChange,
      addFunc,
      releaseFunc,
      deleteFunc
    })

    return {
      zh_CN,
      data,
      fn,
      visible,
      afterVisibleChange,
      filter
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
  width: 80%;
  margin-right: 5px;
}
.page {
  margin: 20px 0px 20px 0px;
  display: flex;
  justify-content: right;
}
.iconfont {
  font-size: 18px;
}
.icon-addNode {
  font-size: 14px;
}
.edit-name-cancel:hover {
  color: #ff1744;
}
.a-delete:hover {
  color: #ff1744;
}
.a-plugin:hover {
  color: #d500f9;
}
.a-release:hover {
  color: #00e676;
}
.a-router:hover {
  color: #2979ff;
}
.a-edit:hover {
  color: #2979ff;
}
</style>
