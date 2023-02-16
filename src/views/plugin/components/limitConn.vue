<template>
  <a-form
      :model="data.formData"
      name="formData"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19 }"
      autocomplete="off"
      @finish="fn.onSubmit"
  >
    <a-form-item label="插件名称" name="name" :rules="schemaPluginLimitConn.name">
      <a-input v-model:value="data.formData.name" />
    </a-form-item>

    <a-form-item label="rate" name="rate" :rules="schemaPluginLimitConn.rate">
      <a-input-number v-model:value="data.formData.rate" style="width: 200px"/>
    </a-form-item>

    <a-form-item label="burst" name="burst" :rules="schemaPluginLimitConn.burst">
      <a-input-number v-model:value="data.formData.burst" style="width: 200px"/>
    </a-form-item>

    <a-form-item label="default_conn_delay" name="default_conn_delay" :rules="schemaPluginLimitConn.default_conn_delay">
      <a-input-number v-model:value="data.formData.default_conn_delay" style="width: 200px"/>
    </a-form-item>


    <a-form-item label="启用" name="enable" v-show="pluginOpType === 1">
      <a-switch v-model:checked="data.formData.enable" size="small" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
      <a-button html-type="submit" type="primary">保存</a-button>
      <a-button style="margin-left: 20px" @click="fn.cancel(pluginConfigData.key)">取消</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import { schemaPluginLimitConn } from '@/schema'
import { $pluginConfigAdd, $pluginConfigUpdate } from '@/api'

export default {
  props: {
    pluginConfigData: {
      Object
    },
    pluginConfigType: {
      Number
    },
    targetResId: {
      String
    },
    pluginConfigResId: {
      String
    },
    pluginOpType: {
      Number
    },
    pluginResId: {
      String
    }
  },
  emits: ['pluginAddVisible', 'pluginEditVisibleOff', 'componentRefreshList'],
  setup(props, { emit }) {
    const data = reactive({
      formData: {
        name: '',
        rate: 0,
        burst: 0,
        default_conn_delay: 0,
        enable: false
      }
    })

    // 接收的父级参数进行表单dom赋值，不需要监听其变化反应
    if (props.pluginConfigData != null) {
      if (props.pluginConfigData.name != null) {
        data.formData.name = props.pluginConfigData.name
      }
      if (props.pluginConfigData.rate != null) {
        data.formData.rate = props.pluginConfigData.rate
      }

      if (props.pluginConfigData.burst != null) {
        data.formData.burst = props.pluginConfigData.burst
      }

      if (props.pluginConfigData.default_conn_delay != null) {
        data.formData.default_conn_delay = props.pluginConfigData.default_conn_delay
      }
    }

    // 提交当前插件的表单数据
    const onSubmit = async formData => {
      if (props.pluginConfigResId == null) {
        // 新增插件配置
        let configData = reactive({
          plugin_id: props.pluginResId ?? '',
          target_id: props.targetResId ?? '',
          type: props.pluginConfigType ?? '',
          name: formData.name ?? '',
          enable: formData.enable == true ? 1 : 2,
          config: reactive({
            rate: formData.rate ?? '',
            burst: formData.burst ?? '',
            default_conn_delay: formData.default_conn_delay ?? '',

          })
        })

        let { code, msg } = await $pluginConfigAdd(configData, props.pluginConfigType)
        if (code !== 0) {
          message.error(msg)
          return
        } else {
          message.success(msg)
          emit('pluginAddVisible')
          emit('componentRefreshList')
        }
      } else {
        // 更新插件配置
        let configData = reactive({
          name: formData.name ?? '',
          config: reactive({
            rate: formData.rate ?? '',
            burst: formData.burst ?? '',
            default_conn_delay: formData.default_conn_delay ?? '',

          })
        })

        let { code, msg } = await $pluginConfigUpdate(
            props.pluginConfigResId,
            configData,
            props.pluginConfigType
        )
        if (code !== 0) {
          message.error(msg)
          return
        } else {
          message.success(msg)
          emit('pluginEditVisibleOff')
          emit('componentRefreshList')
        }
      }
    }

    // 取消按钮
    const cancel = async key => {
      if (props.pluginOpType == 1) {
        // 调用父组件方法，收起增加插件的表单
        emit('pluginAddVisible')
      } else {
        // 调用父组件方法，收起编辑插件的表单
        emit('pluginEditVisibleOff', key)
      }
    }

    const fn = reactive({
      onSubmit,
      cancel
    })

    return { data, fn, schemaPluginLimitConn }
  }
}
</script>

<style lang="scss" scoped></style>
