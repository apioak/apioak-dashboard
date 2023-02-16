<template>
  <div class="main">
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item
        ><i
          style="color: #448ef7; font-size: 30px"
          class="iconfont icon-lianjie"
        />路由管理</a-breadcrumb-item
      >
    </a-breadcrumb>
    <a-divider style="margin: 10px 0" />

    <!-- 筛选 -->
    <div class="filter">
      <span>所属服务: </span>
      <a-select
        class="select"
        ref="select"
        v-model:value="data.params.service_res_id"
        placeholder="请选择"
        @change="fn.paramsChange(data.params)"
      >
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option v-for="item in data.serviceList" :value="item.res_id">
          {{ item.name }}
        </a-select-option>
      </a-select>

      <span>启用状态: </span>
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
      <a-button type="primary" @click="fn.drawerOperate(null, drawer.typeRouter)">
        <i class="iconfont icon-addNode" />新增路由</a-button
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

        <template v-if="column.dataIndex === 'plugin'">
          插件
          <a-tooltip placement="rightTop">
            <template #title>
              黑色：启用插件<br />
              灰色：停用插件
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
          <a @click="fn.drawerOperate(record.res_id, drawer.typeRouter)">
            {{ record.res_id }}
          </a>
          <br />

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

        <!-- 数据——名称增加可直接编辑 -->

        <!-- 服务 -->
        <template v-if="column.dataIndex === 'service'">
          {{ record.service_name }}
        </template>

        <!-- 方法 -->
        <template v-if="column.dataIndex === 'method'">
          <a-tooltip placement="bottomRight" v-for="(mv, mi) in record.method" :key="mi">
            {{ mv.name }}<br />
          </a-tooltip>
        </template>

        <!-- 路径 -->
        <template v-if="column.dataIndex === 'path'">
          {{ record.path }}
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
          <span v-if="record.release === 1" class="color-grey">
            {{ filter.HookRelease(record.release) }}
          </span>
          <span v-if="record.release === 2" class="color-purple">
            {{ filter.HookRelease(record.release) }}
          </span>
          <span v-if="record.release === 3" class="color-green">
            {{ filter.HookRelease(record.release) }}
          </span>
        </template>

        <!-- 启用状态 -->
        <template v-if="column.dataIndex === 'enable'">
          <a-switch v-model:checked="record.enable" size="small" @click="fn.enableChange(record)" />
        </template>

        <!-- 数据——增加所有列表数据操作 -->
        <template v-if="column.dataIndex === 'operation'">
          <span>
            <!-- 转换协议的ID为协议名称 -->
            <span v-if="record.release === 3" class="color-light-grey">
              <i class="iconfont icon-yuntongbu" />
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
                <a
                  ><a-tooltip placement="topRight">
                    <template #title> 发布 </template>
                    <span> <i class="iconfont icon-yuntongbu" /></span>
                  </a-tooltip>
                  <a-divider type="vertical"
                /></a>
              </a-popconfirm>
            </span>

            <a @click="fn.drawerOperate(record.res_id, drawer.typePlugin)">
              <a-tooltip placement="topRight">
                <template #title> 插件 </template>
                <span>
                  <i class="iconfont icon-chajiangongneng" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </a>
            <a-popconfirm
              placement="top"
              title="路由复制会将其下的插件全量复制,是否确认复制?"
              ok-text="是"
              cancel-text="否"
              @confirm="fn.routerCopy(record)"
            >
              <a>
                <a-tooltip placement="topRight">
                  <template #title> 复制 </template>
                  <span>
                    <i class="iconfont icon-fuzhi" />
                  </span>
                </a-tooltip>
                <a-divider type="vertical" />
              </a>
            </a-popconfirm>

            <a @click="fn.drawerOperate(record.res_id, drawer.typeRouter, record.service_res_id)">
              <a-tooltip placement="topRight">
                <template #title> 编辑 </template>
                <span>
                  <i class="iconfont icon-xiugai" />
                </span>
              </a-tooltip>
              <a-divider type="vertical" />
            </a>

            <a-popconfirm
              placement="top"
              title="确认删除该配置?"
              ok-text="是"
              cancel-text="否"
              @confirm="fn.deleteFunc(record)"
            >
              <a class="color-red a-delete">
                <a-tooltip placement="topRight">
                  <template #title> 删除 </template>
                  <span>
                    <i class="iconfont icon-shanchu" />
                  </span>
                </a-tooltip>
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
        show-size-changer
        :total="data.listCount"
        v-model:current="data.params.page"
        @showSizeChange="fn.showSizeChange"
        :show-total="(total, range) => `当前${range[0]}-${range[1]}条，共${total}条`"
        @change="fn.pageChange"
      />
    </a-config-provider>
  </div>

  <!-- 抽屉 -->
  <a-drawer
    v-model:visible="drawer.visible"
    class="custom-class"
    placement="right"
    :title="drawer.title"
    :destroyOnClose="drawer.destroyOnClose"
    :width="drawer.width"
    @after-visible-change="fn.afterVisibleChange"
  >
    <!-- 动态组件完成路由和插件抽屉的展示 -->
    <component
      :is="drawer.componentName"
      :currentResId="drawer.currentResId"
      :serviceResId="drawer.serviceResId"
      :pluginConfigType="drawer.pluginConfigType"
      @componentCloseDrawer="fn.componentCloseDrawer"
      @componentRefreshList="fn.componentRefreshList"
    />
  </a-drawer>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import RouterOperate from './operate'
import PluginIndex from '../plugin'
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  $routerList,
  $serviceList,
  $routerEditName,
  $routerEnable,
  $routerRelease,
  $routerDelete,
  $routerCopy
} from '@/api'
import { HookEnableToName, HookProtocolToName, HookReleaseToName } from '@/hooks'
import router from '@/router'

export default {
  components: { RouterOperate, PluginIndex },

  setup() {
    // 初始化——路由列表
    onMounted(async () => {
      if (router.currentRoute.value.query.serviceResId != null) {
        data.params.service_res_id = router.currentRoute.value.query.serviceResId
      }

      getList(data.params)

      getServiceList(data.serviceParam)
    })

    // 数据变量
    const data = reactive({
      params: reactive({
        // 路由列表查询参数
        service_res_id: '',
        enable: null,
        release: null,
        search: '',
        page: 1,
        page_size: 10
      }),
      columns: reactive([]), // 路由列表表头字段
      list: ref([]), // 路由列表数据
      listCount: 0, // 路由列表总条数
      editName: reactive({}), // 编辑名称变量
      serviceParam: reactive({
        page: 1,
        page_size: 1000 // 此处暂时不做轮询获取 暂定获取前1000条
      }),
      serviceList: reactive({}) // 服务列表
    })

    // 抽屉变量
    const drawer = reactive({
      visible: ref(false), // 抽屉开关
      title: null, // 抽屉标题
      width: '45%', // 抽屉宽度
      serviceResId: null, // 当前路由对应服务ID
      currentResId: null, // 当前资源ID
      pluginConfigType: 2, // 插件类型——路由
      typeRouter: 1, // 抽屉类型： 路由
      typePlugin: 2, // 抽屉类型： 插件
      destroyOnClose: false, // 抽屉内组件销毁  false：不销毁（默认）  true：销毁
      componentName: null // 动态组件名称
    })

    // 过滤器
    const filter = reactive({
      HookEnable: HookEnableToName,
      HookProtocal: HookProtocolToName,
      HookRelease: HookReleaseToName
    })

    // 自带文本过长省略属性 ellipsis: true
    data.columns = reactive([
      { title: 'ID/名称', dataIndex: 'res_id', width: '15%' },
      { title: '服务', dataIndex: 'service', width: '15%' },
      { title: '方法', dataIndex: 'method', width: '10%' },
      { title: '路径', dataIndex: 'path', width: '20%' },
      { title: '插件', dataIndex: 'plugin', width: '10%' },
      { title: '发布', dataIndex: 'release' },
      { title: '启用', dataIndex: 'enable' },
      { title: '操作', dataIndex: 'operation', width: 200 }
    ])

    // 获取路由列表
    const getList = async params => {
      let { code, data: dataList, msg } = await $routerList(params)

      if (code != 0) {
        message.error(msg)
      } else {
        data.listCount = dataList.total
        let key = 0
        let tmpList = ref([])
        dataList.data.forEach(item => {
          // 方法列表
          let methods = ref([])
          if (item.request_methods.length > 0) {
            item.request_methods.forEach(methodItem => {
              methods.value.push({
                name: methodItem
              })
            })
          }

          // 插件列表
          let plugins = ref([])
          if (item.plugin_list.length > 0) {
            item.plugin_list.forEach(pluginItem => {
              plugins.value.push({
                name: pluginItem.name,
                color: pluginItem.enable == 1 ? 'color-black' : 'color-light-grey',
                icon: pluginItem.length != 0 ? pluginItem.icon : 'icon-apex_plugin1'
              })
            })
          }

          tmpList.value.push({
            key: key++,
            res_id: item.res_id,
            service_res_id: item.service_res_id,
            service_name: item.service_name,
            name: item.router_name,
            method: methods,
            path: item.router_path,
            release: item.release,
            enable: item.enable == 1 ? true : false,
            plugin: plugins
          })
        })

        data.list = tmpList
      }
    }

    const getServiceList = async params => {
      let { code, data: dataList, msg } = await $serviceList(params)

      if (code != 0) {
        message.error(msg)
      } else {
        let tmpList = ref([])
        dataList.data.forEach(item => {
          tmpList.value.push({
            res_id: item.res_id,
            name: item.name
          })
        })

        data.serviceList = tmpList
      }
    }
    // 编辑名称——填入输入框
    const editName = async (resId, name) => {
      data.editName[resId] = name
    }

    // 编辑名称——保存修改后新名称
    const saveName = async record => {
      let { code, msg } = await $routerEditName(
        record.res_id,
        data.editName[record.res_id],
        record.service_res_id
      )

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

    // 编辑名称——取消修改名称
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
    const enableChange = async record => {
      let enableValue = record.enable == true ? 1 : 2

      let { code, msg } = await $routerEnable(record.res_id, enableValue, record.service_res_id)

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
      if (record.release === 3) {
        message.error('配置已发布!')
        return
      }

      let { code, msg } = await $routerRelease(record.res_id, record.service_res_id)

      if (code != 0) {
        message.error(msg)
        return
      } else {
        message.success(msg)
        record.release = 3
      }
    }

    // 复制
    const routerCopy = async record => {
      let { code, msg } = await $routerCopy(record.service_res_id, record.res_id)

      if (code != 0) {
        message.error(msg)
        return
      } else {
        message.success(msg)
        getList()
      }
    }

    // 配置删除
    const deleteFunc = async record => {
      // 待发布且开启状态不允许删除
      if (record.release === 2 && record.enable === 1) {
        message.error('请先【关闭启用状态】且【已发布】后删除!')
        return
      }

      let { code, msg } = await $routerDelete(record.res_id, record.service_res_id)

      if (code != 0) {
        message.error(msg)
        return
      } else {
        message.success(msg)
        getList()
      }
    }

    // 抽屉操作
    const drawerOperate = async (resId, drawerType, serviceResId) => {
      drawer.serviceResId = serviceResId
      drawer.currentResId = resId
      drawer.visible = true

      if (drawerType == drawer.typePlugin) {
        drawer.componentName = 'PluginIndex'
        drawer.title = '插件列表'
        drawer.width = '65%'
      } else {
        drawer.componentName = 'RouterOperate'
        drawer.width = '50%'
        if (resId === null) {
          drawer.title = '新增路由'
        } else {
          drawer.title = '编辑路由'
        }
      }
    }

    // 抽屉状态变化后钩子函数
    const afterVisibleChange = async () => {
      // 抽屉关闭时销毁抽屉内的组件（这里后期可能需要进一步优化）
      if (drawer.visible == false) {
        drawer.destroyOnClose = true
      } else {
        drawer.destroyOnClose = false
      }
    }

    // 动态组件——关闭抽屉
    const componentCloseDrawer = async () => {
      drawer.visible = false
    }

    // 动态组件——刷新列表
    const componentRefreshList = async () => {
      drawer.visible = false
      getList()
    }

    // 定义函数
    const fn = reactive({
      editName,
      saveName,
      cancelName,
      enableChange,
      paramsChange,
      pageChange,
      showSizeChange,
      releaseFunc,
      deleteFunc,
      drawerOperate,
      afterVisibleChange,
      componentCloseDrawer,
      componentRefreshList,
      routerCopy
    })

    return {
      zh_CN,
      data,
      drawer,
      fn,
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
.icon-lianjie {
  margin-right: 10px;
}
</style>
