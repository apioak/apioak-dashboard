<template>
  <a-form
      :model="data.formData"
      name="formData"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19 }"
      autocomplete="off"
      @finish="fn.onSubmit"
  >
    <a-form-item label="插件名称" name="name" >
      <a-input v-model:value="data.formData.name" />
    </a-form-item>

    <a-form-item label="response_type" name="response_type" :rules="schemaPluginMock.response_type">
      <a-input v-model:value="data.formData.response_type" />
    </a-form-item>

    <a-form-item label="http_code" name="http_code" :rules="schemaPluginMock.http_code">
      <a-input v-model:value="data.formData.http_code" />
    </a-form-item>

    <a-form-item label="http_body" name="http_body" :rules="schemaPluginMock.http_body">
      <a-textarea v-model:value="data.formData.http_body" :rows="4"/>
    </a-form-item>

    <a-form-item label="http_headers" name="http_headers">
      <a-space
          v-for="(item, index) in data.formData.http_headers"
          :key="item.id"
          align="baseline"
      >
        <a-form-item :name="[ 'http_headers', index, 'key' ]" :rules="checkHttpHeader">
          <a-input placeholder="key" v-model:value="item.key" style="width: 200px;"/>
        </a-form-item>
        <a-form-item :name="[ 'http_headers', index, 'value' ]">
          <a-input placeholder="value" v-model:value="item.value" style="width: 300px;"/>
        </a-form-item>
        
        <a @click="fn.addHttpHeaders()">
          <i class="iconfont icon-tianjia"></i>
        </a>
        <a v-if="index>0" @click="fn.removeHttpHeaders(item)">
          <i class="iconfont color-red icon-jian"></i>
        </a>
      </a-space>

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
import { reactive, onMounted } from 'vue'
import {Form, message} from 'ant-design-vue'
import { schemaPluginMock } from '@/schema'
import { $pluginConfigAdd, $pluginConfigUpdate } from '@/api'

const useForm = Form.useForm;
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

    onMounted(async () => {

      if (props.pluginConfigResId == null ||
          Object.keys(props.pluginConfigData.http_headers).length===0) {
        // 初始化一个空 http_headers
        addHttpHeaders()
      }
    })

    const data = reactive({
      formData: {
        name: '',
        response_type: 'application/json',
        http_code: 200,
        http_body: '',
        http_headers:[],
        enable: false
      }
    })

    const { resetFields } = useForm(data.formData)

    // 接收的父级参数进行表单dom赋值，不需要监听其变化反应
    if (props.pluginConfigData != null) {
      if (props.pluginConfigData.name != null) {
        data.formData.name = props.pluginConfigData.name
      }
      if (props.pluginConfigData.response_type != null) {
        data.formData.response_type = props.pluginConfigData.response_type
      }

      if (props.pluginConfigData.http_code != null) {
        data.formData.http_code = props.pluginConfigData.http_code
      }

      if (props.pluginConfigData.http_body != null) {
        data.formData.http_body = props.pluginConfigData.http_body
      }

      if (props.pluginConfigData.http_headers != null) {

        let hh = JSON.parse(JSON.stringify(props.pluginConfigData.http_headers))
        Object.getOwnPropertyNames(hh).forEach(function (k){
          data.formData.http_headers.push({
                key: k,
                value: hh[k],
                id: Date.now(),
              })
        })
      }
    }

    const addHttpHeaders = () => {
      data.formData.http_headers.push({
        key: undefined,
        vaule: undefined,
        id: Date.now(),
      });
    }

    const removeHttpHeaders = (item) => {
      let index = data.formData.http_headers.indexOf(item);
      if (index !== -1) {
        data.formData.http_headers.splice(index, 1);
      }
    };

    // 提交当前插件的表单数据
    const onSubmit = async formData => {

      let hh = reactive({})
      formData.http_headers.forEach(item => {
        if (item.key != null) {
          let hv = ''
          if (item.value !== undefined) {
            hv = item.value.toString()
          }
          hh[item.key.toString()] = hv
        }
      })

      if (props.pluginConfigResId == null) {
        // 新增插件配置
        let configData = reactive({
          plugin_id: props.pluginResId ?? '',
          target_id: props.targetResId ?? '',
          type: props.pluginConfigType ?? '',
          name: formData.name ?? '',
          enable: formData.enable == true ? 1 : 2,
          config: reactive({
            response_type: formData.response_type ?? '',
            http_code: formData.http_code ?? '',
            http_body: formData.http_body ?? '',
            http_headers: hh ?? [],
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
            response_type: formData.response_type ?? '',
            http_code: formData.http_code ?? '',
            http_body: formData.http_body ?? '',
            http_headers: hh ?? [],
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

        resetFields()
      } else {
        // 调用父组件方法，收起编辑插件的表单
        emit('pluginEditVisibleOff', key)
      }
    }

    const checkHttpHeader = [
      {
        validator: async (_, value) => {

          let pattern = /^[A-Za-z1-9_-]+$/
          if (value !== undefined && value.length !== 0 && !pattern.test(value)) {
            return Promise.reject('当前值仅包含字母、数字、划线')
          } else {
            return Promise.resolve().callback
          }
        }
      }
    ]

    const fn = reactive({
      addHttpHeaders,
      removeHttpHeaders,
      onSubmit,
      cancel,
    })

    return { data, fn, schemaPluginMock, checkHttpHeader }
  }
}
</script>

<style lang="scss" scoped></style>
