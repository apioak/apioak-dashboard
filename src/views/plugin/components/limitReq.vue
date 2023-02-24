<template>
  <a-form
    :model="data.formData"
    name="formData"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }"
    autocomplete="off"
    @finish="fn.onSubmit"
  >
    <a-form-item label="插件名称" name="name" :rules="schemaPluginLimitReq.name">
      <a-input v-model:value="data.formData.name" />
    </a-form-item>

    <a-form-item label="rate" name="rate" :rules="schemaPluginLimitReq.rate">
      <a-input-number
        placeholder="1-100000"
        v-model:value="data.formData.rate"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item label="burst" name="burst" :rules="schemaPluginLimitReq.burst">
      <a-input-number
        placeholder="0-5000"
        v-model:value="data.formData.burst"
        style="width: 100%"
      />
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
import { Form, message } from 'ant-design-vue'
import { schemaPluginLimitReq } from '@/schema'
import { $pluginConfigAdd, $pluginConfigUpdate } from '@/api'

const useForm = Form.useForm
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
        name: 'plugin-limit-req',
        rate: null,
        burst: null,
        enable: false
      }
    })

    const { resetFields } = useForm(data.formData)

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
            burst: formData.burst ?? ''
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

        resetFields()
      } else {
        // 更新插件配置
        let configData = reactive({
          name: formData.name ?? '',
          config: reactive({
            rate: formData.rate ?? '',
            burst: formData.burst ?? ''
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
          emit('pluginEditVisibleOff', props.pluginConfigData.key)
          emit('componentRefreshList')
        }
      }
    }

    // 取消按钮
    const cancel = async key => {
      if (props.pluginOpType == 1) {
        // 调用父组件方法，收起增加插件的表单
        emit('pluginAddVisible')

        resetFields()
      } else {
        // 调用父组件方法，收起编辑插件的表单
        emit('pluginEditVisibleOff', key)
      }
    }

    const fn = reactive({
      onSubmit,
      cancel
    })

    return { data, fn, schemaPluginLimitReq }
  }
}
</script>

<style lange="scss" scoped></style>
