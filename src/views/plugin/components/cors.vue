<template>
  <a-form
    :model="data.formData"
    name="formData"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 18 }"
    autocomplete="off"
    @finish="fn.onSubmit"
  >
    <a-form-item label="插件名称" name="name" :rules="schemaPluginCors.name">
      <a-input v-model:value="data.formData.name" />
    </a-form-item>

    <a-form-item label="allow_methods" name="allow_methods" :rules="schemaPluginCors.allow_methods">
      <a-input v-model:value="data.formData.allow_methods" />
    </a-form-item>

    <a-form-item label="allow_origins" name="allow_origins" :rules="schemaPluginCors.allow_origins">
      <a-input v-model:value="data.formData.allow_origins" />
    </a-form-item>

    <a-form-item label="allow_headers" name="allow_headers" :rules="schemaPluginCors.allow_headers">
      <a-input v-model:value="data.formData.allow_headers" />
    </a-form-item>

    <a-form-item label="max_age" name="max_age" :rules="schemaPluginCors.max_age">
      <a-input-number v-model:value="data.formData.max_age" style="width: 100%" />
    </a-form-item>

    <a-form-item label="allow_credential" name="allow_credential">
      <a-switch v-model:checked="data.formData.allow_credential" size="small" />
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
import { schemaPluginCors } from '@/schema'
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
        name: 'plugin-cors',
        allow_methods: '*',
        allow_origins: '*',
        allow_headers: '*',
        max_age: 0,
        allow_credential: false,
        enable: false
      }
    })

    const { resetFields } = useForm(data.formData)

    // 接收的父级参数进行表单dom赋值，不需要监听其变化反应
    if (props.pluginConfigData != null) {
      if (props.pluginConfigData.name != null) {
        data.formData.name = props.pluginConfigData.name
      }
      if (props.pluginConfigData.allow_methods != null) {
        data.formData.allow_methods = props.pluginConfigData.allow_methods
      }
      if (props.pluginConfigData.allow_origins != null) {
        data.formData.allow_origins = props.pluginConfigData.allow_origins
      }
      if (props.pluginConfigData.allow_headers != null) {
        data.formData.allow_headers = props.pluginConfigData.allow_headers
      }
      if (props.pluginConfigData.max_age != null) {
        data.formData.max_age = props.pluginConfigData.max_age
      }
      if (props.pluginConfigData.allow_credential != null) {
        data.formData.allow_credential = props.pluginConfigData.allow_credential
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
            allow_credential: formData.allow_credential ?? '',
            allow_headers: formData.allow_headers ?? '',
            allow_methods: formData.allow_methods ?? '',
            allow_origins: formData.allow_origins ?? '',
            max_age: formData.max_age ?? 0
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
            allow_credential: formData.allow_credential ?? '',
            allow_headers: formData.allow_headers ?? '',
            allow_methods: formData.allow_methods ?? '',
            allow_origins: formData.allow_origins ?? '',
            max_age: formData.max_age ?? 0
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

    return { data, fn, schemaPluginCors }
  }
}
</script>

<style lange="scss" scoped></style>
