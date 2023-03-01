<template>
  <div class="main">
    <a-form
      :model="data.formData"
      class="form"
      :label-col="{ style: { width: '100px' } }"
      :wrapper-col="{ span: 18 }"
      @finish="fn.onSubmit"
    >
      <a-form-item label="域名名称：" name="sni" :rules="schemaSsl.sni">
        <a-input v-model:value="data.formData.sni" />
      </a-form-item>

      <a-form-item label="证书内容：" name="certificate" :rules="schemaSsl.certificate">
        <a-textarea v-model:value="data.formData.certificate" :rows="7" />
      </a-form-item>

      <a-form-item label="私钥内容：" name="private_key" :rules="schemaSsl.private_key">
        <a-textarea v-model:value="data.formData.private_key" :rows="7" />
      </a-form-item>

      <a-form-item label="启用：">
        <a-switch v-model:checked="data.formData.enable" />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 10, offset: 16 }">
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button style="margin-left: 15px" @click="fn.cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { $sslInfo, $sslAdd, $sslUpdate } from '@/api'
import { schemaSsl } from '@/schema'

export default {
  props: {
    currentResId: {
      String
    }
  },
  emits: ['componentCloseDrawer', 'componentRefreshList'],
  setup(props, { emit }) {
    // 初始化——服务详情数据
    onMounted(async () => {
      if (props.currentResId !== null) {
        getInfo(props.currentResId)
      }
    })

    // 定义变量
    const data = reactive({
      formData: {
        sni: '',
        certificate: '',
        private_key: '',
        enable: false
      }
    })
    // 获取详情
    const getInfo = async resId => {
      let { code, data: dataInfo, msg } = await $sslInfo(resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        data.formData.sni = dataInfo.sni
        data.formData.certificate = dataInfo.certificate
        data.formData.private_key = dataInfo.private_key
        data.formData.enable = dataInfo.enable == 1 ? true : false
      }
    }

    // 点击提交保存当前数据
    const onSubmit = async () => {
      let formData = JSON.parse(JSON.stringify(data.formData))
      formData.enable = formData.enable == true ? 1 : 2

      // 调用增加/修改接口
      let sslRes
      if (props.currentResId !== null) {
        sslRes = await $sslUpdate(props.currentResId, formData)
      } else {
        sslRes = await $sslAdd(formData)
      }

      if (sslRes.code != 0) {
        message.error(sslRes.msg)
        return
      } else {
        message.success(sslRes.msg)
        emit('componentRefreshList')
      }
    }

    // 表单取消，关闭抽屉
    const cancel = async () => {
      emit('componentCloseDrawer')
    }

    // 定义函数
    const fn = reactive({
      onSubmit,
      cancel
    })

    return {
      schemaSsl,
      data,
      fn
    }
  }
}
</script>

<style lange="scss" scoped>
.main {
  padding: 10px;
}
.form {
  width: '150px';
}
</style>
