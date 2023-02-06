<template>
  <a-form
    :model="data.formData"
    name="formData"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 19 }"
    autocomplete="off"
    @finish="fn.onSubmit"
  >
    <a-form-item label="插件名称" name="name">
      <a-input v-model:value="data.formData.name" />
    </a-form-item>

    <a-form-item label="allow_methods" name="allow_methods">
      <a-input v-model:value="data.formData.allow_methods" />
    </a-form-item>

    <a-form-item label="allow_origins" name="allow_origins">
      <a-input v-model:value="data.formData.allow_origins" />
    </a-form-item>

    <a-form-item label="allow_headers" name="allow_headers">
      <a-input v-model:value="data.formData.allow_headers" />
    </a-form-item>

    <a-form-item label="max_age" name="max_age">
      <a-input v-model:value="data.formData.max_age" />
    </a-form-item>

    <a-form-item label="allow_credential" name="allow_credential">
      <a-switch v-model:checked="data.formData.allow_credential" size="small" />
    </a-form-item>

    <a-form-item label="启用" name="enable" v-show="pluginOpType === 1">
      <a-switch v-model:checked="data.formData.enable" size="small" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
      <a-button html-type="submit" type="primary">保存</a-button>
      <a-button style="margin-left: 20px" @click="fn.cancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { reactive } from 'vue'

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
    pluginOpType: {
      Number
    }
  },
  emits: ['pluginAddVisible'],
  setup(props, { emit }) {
    const data = reactive({
      formData: {
        name: '',
        allow_methods: '*',
        allow_origins: '*',
        allow_headers: '*',
        max_age: 0,
        allow_credential: false,
        enable: false
      }
    })

    if (props.pluginConfigData == null) {
      console.log('*******************')
    } else {
      console.log('####################')
    }

    console.log('====cors====', props.pluginConfigData.allow_methods)

    // 提交当前插件的表单数据
    const onSubmit = async values => {
      console.log('----------', values)
    }

    // 取消按钮——春递给父组件，关闭增加插件的表单
    const cancel = async () => {
      emit('pluginAddVisible')
    }

    const fn = reactive({
      onSubmit,
      cancel
    })

    return { data, fn }
  }
}
</script>

<style lang="scss" scoped></style>
