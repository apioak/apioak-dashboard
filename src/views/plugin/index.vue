<template>
  <div class="main">
    <div class="plugin-add">
      <div class="add">
        <a-button type="primary" @click="fn.pluginAddVisible()"
          ><i class="iconfont icon-addNode addPlugin" />新增插件</a-button
        >
      </div>
      <div class="add-config" v-show="data.pluginAddVisible">
        <a-tabs v-model:activeKey="data.addPluginTabActiveKey" type="card" centered>
          <a-tab-pane key="1" tab="插件信息">
            <div>
              <div class="add-plugin-info">
                选择插件：
                <a-select
                  class="action-box"
                  :field-names="{
                    label: 'name',
                    value: 'res_id',
                    options: 'children'
                  }"
                  placeholder="请选择"
                  :options="data.addPluginList"
                  @change="fn.addPluginChange"
                  style="width: 85%"
                />
              </div>
            </div>

            <div v-show="data.addPluginComponent.infomationShow">
              <div class="add-plugin-info">
                插件类型：
                <a-input
                  class="action-box"
                  v-model:value="data.addPluginType"
                  disabled
                  placeholder="插件类型"
                />
                <br />
              </div>
              <div class="add-plugin-info">
                插件描述：
                <a-input
                  class="action-box"
                  v-model:value="data.addPluginDesc"
                  disabled
                  placeholder="插件描述"
                />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="插件配置">
            <div class="plugin-add-form">
              <component
                :is="data.addPluginComponent.name"
                :pluginOpType="data.pluginOpType"
                :pluginTag="data.addPluginComponent.tag"
                :pluginConfigType="pluginConfigType"
                :targetResId="currentResId"
                @pluginAddVisible="fn.pluginAddVisible()"
                @componentRefreshList="fn.componentRefreshList"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
        <a-divider />
      </div>
    </div>

    <div class="plugin-list">
      <a-table
        :columns="data.columns"
        :pagination="false"
        :data-source="data.list"
        class="components-table-demo-nested"
        :rowClassName="
          function (record) {
            return record.color
          }
        "
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'icon'">
            <i class="iconfont" :class="[record.icon, record.color]" />
          </template>

          <template v-if="column.dataIndex === 'description'">
            <a-tooltip placement="topLeft">
              <template #title> {{ record.description }} </template>
              <span>
                {{ record.description }}
              </span>
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex === 'enable'">
            <a-switch
              v-model:checked="record.enable"
              size="small"
              @click="fn.enableChange(record)"
            />
          </template>

          <template v-if="column.dataIndex === 'operation'">
            <a @click="fn.drawerOperate(record.res_id, drawer.typeService)">
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
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <div class="plugin-edit-form">
            <component
              :is="record.component.name"
              :pluginConfigData="record.component.pluginConfigData"
              :pluginOpType="record.component.pluginOpType"
              :pluginTag="record.tag"
              :pluginConfigType="pluginConfigType"
              :targetResId="currentResId"
              @componentCloseDrawer="fn.componentCloseDrawer"
              @componentRefreshList="fn.componentRefreshList"
            />
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { $pluginConfigList } from '@/api'
import { message } from 'ant-design-vue'
import { HookPluginKeyComponentMap, HookPluginTypeIdNameMap, HookPluginList } from '@/hooks'
import Plugin404 from '../plugin/components/err404.vue'
import Cors from '../plugin/components/cors.vue'
import LimitCount from '../plugin/components/limitCount.vue'

export default {
  components: { Plugin404, Cors, LimitCount },

  props: {
    currentResId: {
      String
    },
    pluginConfigType: {
      Number
    }
  },
  emits: ['componentCloseDrawer', 'componentRefreshList'],
  setup(props, { emit }) {
    onMounted(() => {
      if (props.currentResId !== null) {
        getList(props.currentResId)
      }
    })

    // 定义变量
    const data = reactive({
      columns: reactive([]),
      list: ref([]),
      pluginAddVisible: false, // 插件增加是否展示
      pluginOpType: 1, // 插件操作类型  1:增加   2:修改
      addPluginList: [], // 插件列表
      addPluginType: '',
      addPluginDesc: '',
      addPluginTabActiveKey: '1',
      addPluginComponent: reactive({
        name: 'Plugin404',
        tag: '',
        infomationShow: false
      })
    })

    // 定义hook数据
    const hookData = reactive({
      pluginResIdInfoMap: {}, // 插件信息hash列表
      pluginTypeIdNameMap: {}, // 插件类型hash列表
      pluginKeyToComponentMap: {} // 动态插件组件名称
    })

    const hookFnPluginKeyToComponent = pluginKey => {
      if (Object.values(hookData.pluginKeyToComponentMap).length == 0) {
        return 'Plugin404'
      }

      let componentName = hookData.pluginKeyToComponentMap[pluginKey]
      if (componentName == null) {
        componentName = 'Plugin404'
      }

      return componentName
    }

    // 定义列表头部
    data.columns = [
      { title: '', dataIndex: 'icon', width: 50 },
      { title: '名称', dataIndex: 'name', width: 250 },
      { title: '标识', dataIndex: 'tag' },
      { title: '类型', dataIndex: 'type', width: 60 },
      { title: '描述', dataIndex: 'description', width: 190, ellipsis: true },
      { title: '启用', dataIndex: 'enable', width: 60 },
      { title: '操作', dataIndex: 'operation', width: 90 }
    ]

    // 获取插件列表
    const getList = async resId => {
      let { code, data: dataList, msg } = await $pluginConfigList(resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        if (Object.values(hookData.pluginTypeIdNameMap).length == 0) {
          hookData.pluginTypeIdNameMap = await HookPluginTypeIdNameMap()
        }
        if (Object.values(hookData.pluginKeyToComponentMap).length == 0) {
          hookData.pluginKeyToComponentMap = await HookPluginKeyComponentMap()
        }

        if (dataList.list && dataList.list.length > 0) {
          let pluginList = ref([])

          dataList.list.forEach((pluginConfigInfo, index) => {
            let componentName = hookData.pluginKeyToComponentMap[pluginConfigInfo.plugin_key]
            if (componentName == null) {
              componentName = 'Plugin404'
            }

            pluginList.value.push({
              key: index,
              res_id: pluginConfigInfo.res_id,
              icon: pluginConfigInfo.icon.length == 0 ? 'icon-apex_plugin1' : pluginConfigInfo.icon,
              name: pluginConfigInfo.name,
              tag: pluginConfigInfo.plugin_key,
              type: hookData.pluginTypeIdNameMap[pluginConfigInfo.plugin_type],
              description: pluginConfigInfo.plugin_description,
              enable: pluginConfigInfo.enable == 1 ? true : false,
              color: pluginConfigInfo.enable == 1 ? 'color-black' : 'color-light-grey',
              component: {
                name: hookFnPluginKeyToComponent(pluginConfigInfo.plugin_key),
                pluginOpType: 2,
                pluginConfigData: pluginConfigInfo.config
              }
            })
          })

          data.list = pluginList
        }
      }
    }

    // 增加插件是否展示动作
    const pluginAddVisible = async () => {
      if (data.pluginAddVisible === true) {
        data.pluginAddVisible = false
      } else {
        data.pluginAddVisible = true

        if (data.addPluginList.length == 0) {
          let pluginList = await HookPluginList()

          if (pluginList.length > 0) {
            pluginList.forEach(pluginInfo => {
              data.addPluginList.push({
                res_id: pluginInfo.res_id,
                name: pluginInfo.plugin_key
              })

              hookData.pluginResIdInfoMap[pluginInfo.res_id] = {
                type: hookData.pluginTypeIdNameMap[pluginInfo.type],
                description: pluginInfo.description
              }
            })
          }
        }
      }
    }

    // 新增加插件时选择的插件基础数据（名称和描述）
    const addPluginChange = async (resId, option) => {
      let addPluginInfo = hookData.pluginResIdInfoMap[resId]
      data.addPluginComponent.name = hookFnPluginKeyToComponent(option.name)
      data.addPluginComponent.tag = option.name

      if (resId.length > 0) {
        data.addPluginComponent.infomationShow = true
      } else {
        data.addPluginComponent.infomationShow = false
      }

      if (addPluginInfo) {
        data.addPluginType = addPluginInfo.type
        data.addPluginDesc = addPluginInfo.description
      }
    }

    // 定义函数
    const fn = reactive({
      pluginAddVisible, // 插件增加时的展示开关
      addPluginChange
    })

    return {
      data,
      fn,
      options: []
    }
  }
}
</script>

<style lange="scss" scoped>
.add {
  display: flex;
  justify-content: right;
  margin-bottom: 10px;
}
.add .addPlugin {
  font-size: 14px;
}
.plugin-add {
  margin-bottom: 10px;
}
.iconfont {
  font-size: 16px;
}
.add-plugin-info {
  width: 100%;
  margin-bottom: 24px;
  margin-left: 20px;
}
.action-box {
  width: 85%;
}
</style>