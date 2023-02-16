<template>
  <div class="main">
    <a-form
      :model="data.formData"
      class="form"
      :label-col="{ style: { width: '100px' } }"
      :wrapper-col="{ span: 18 }"
      @finish="fn.onSubmit"
    >
      <a-form-item label="服务名称：" name="name" :rules="schemaService.name">
        <a-input v-model:value="data.formData.name" />
      </a-form-item>

      <a-form-item
        v-for="(item, index) in data.formData.service_domains"
        :key="item.id"
        v-bind="{ xs: { span: 24 }, sm: { span: 4 } }"
        :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
        :name="['service_domains', index, 'domain']"
        :rules="schemaService.domain"
        label="域名："
      >
        <a-input
          v-model:value="item.domain"
          placeholder="请输入域名"
          style="width: 80%; margin-right: 5px"
        />

        <a @click="fn.addDomain()">
          <i class="iconfont icon-tianjia" />
        </a>
        <a @click="fn.removeDomain(index)" v-if="index != 0" class="color-red a-delete">
          <i class="iconfont icon-jian" />
        </a>
      </a-form-item>

      <a-form-item label="请求协议：" name="protocol">
        <a-radio-group v-model:value="data.formData.protocol">
          <a-radio value="1">HTTP</a-radio>
          <a-radio value="2">HTTPS</a-radio>
          <a-radio value="3">HTTP&HTTPS</a-radio>
        </a-radio-group>
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
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { $serviceInfo, $serviceAdd, $serviceUpdate } from '@/api'
import { schemaService } from '@/schema'

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

    // 默认域名数据
    const defaultDomain = {
      id: 0,
      domain: null
    }

    // 定义变量
    const data = reactive({
      formData: {
        name: null,
        protocol: '1',
        enable: false,
        service_domains: ref([defaultDomain])
      }
    })

    // 获取详情
    const getInfo = async resId => {
      let { code, data: dataInfo, msg } = await $serviceInfo(resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        data.formData.name = dataInfo.name
        data.formData.protocol = dataInfo.protocol.toString()
        data.formData.enable = dataInfo.enable == 1 ? true : false

        if (dataInfo.service_domains.length > 0) {
          data.formData.service_domains = ref([])

          dataInfo.service_domains.forEach((item, index) => {
            data.formData.service_domains.push({
              id: index,
              domain: item
            })
          })
        }
      }
    }

    // 增加域名元素
    const addDomain = async () => {
      data.formData.service_domains.push({
        id: data.formData.service_domains.length,
        demian: ''
      })
    }

    // 删除域名元素
    const removeDomain = async item => {
      if (data.formData.service_domains.length > 1) {
        data.formData.service_domains = data.formData.service_domains.filter(t => t.id !== item)
      }
    }

    // 点击提交保存当前数据
    const onSubmit = async () => {
      let formData = JSON.parse(JSON.stringify(data.formData))
      formData.protocol = parseInt(formData.protocol)
      formData.enable = formData.enable == true ? 1 : 2

      let domainList = JSON.parse(JSON.stringify(formData.service_domains))
      formData.service_domains = []
      if (domainList.length > 0) {
        domainList.forEach(item => {
          if (item.domain !== null) {
            formData.service_domains.push(item.domain)
          }
        })
      }

      // 调用增加/修改接口
      let serviceRes
      if (props.currentResId !== null) {
        serviceRes = await $serviceUpdate(props.currentResId, formData)
      } else {
        serviceRes = await $serviceAdd(formData)
      }

      if (serviceRes.code != 0) {
        message.error(serviceRes.msg)
        return
      } else {
        message.success(serviceRes.msg)
        emit('componentRefreshList')
      }
    }

    // 表单取消，关闭抽屉
    const cancel = async () => {
      emit('componentCloseDrawer')
    }

    // 定义函数
    const fn = reactive({
      addDomain,
      removeDomain,
      onSubmit,
      cancel
    })

    return {
      schemaService,
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
