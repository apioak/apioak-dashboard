<template>
  <div class="main">
    <a-form
      :model="data.formData"
      class="form"
      :label-col="{ style: { width: '100px' } }"
      :wrapper-col="{ span: 18 }"
      @finish="fn.onSubmit"
    >
      <a-form-item label="路由名称：" name="router_name" :rules="schemaRouter.name">
        <a-input v-model:value="data.formData.router_name" />
      </a-form-item>

      <a-form-item
          label="所属服务："
          name="service_res_id"
          :rules="schemaRouter.service_res_id"
      >
        <a-select
            class="select"
            ref="select"
            v-model:value="data.formData.service_res_id"
            placeholder="请选择"
        >
          <a-select-option
              v-for="item in data.serviceList"
              :value="item.res_id"
          >{{ item.name }}</a-select-option>

        </a-select>
      </a-form-item>

      <a-form-item
          label="路由路径："
          name="router_path"
          :rules="schemaRouter.router_path">
        <a-input v-model:value="data.formData.router_path" />
      </a-form-item>

      <a-form-item label="请求方法：" name="request_methods" :rules="schemaRouter.request_methods">
        <a-checkbox-group
            v-model:value="data.formData.request_methods"
            :options="data.methodList"
        />
      </a-form-item>

      <a-form-item
          label="upstream："
          name="upstream_res_id"
      >
        <a-select
            class="select"
            ref="select"
            v-model:value="data.formData.upstream_res_id"
            placeholder="请选择"
        >
          <a-select-option
              v-for="item in data.upstreamList"
              :value="item.res_id"
          >{{ item.name }}</a-select-option>

        </a-select>
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
import { $serviceList, $upstreamList, $routerInfo, $routerAdd, $routerUpdate } from '@/api'
import { MethodOption} from '@/hooks'
import { schemaRouter } from '@/schema'

export default {
  props: {
    serviceResId: {
      String
    },
    currentResId: {
      String
    }
  },
  emits: ['componentCloseDrawer', 'componentRefreshList'],
  setup(props, { emit }) {
    // 初始化——服务详情数据
    onMounted(async () => {

      if (props.currentResId !== null && props.serviceResId !== null) {
        getInfo(props.serviceResId, props.currentResId)
      }

      getServiceList(data.serviceParam)

      getUpstreamList(data.upstreamParam)
    })

    // 定义变量
    const data = reactive({
      formData: {
        service_res_id:'',
        upstream_res_id:'',
        router_name:'',
        request_methods:[],
        router_path:'',
        enable:false,
      },
      serviceParam: reactive({
        page: 1,
        page_size: 1000, // 此处暂时不做轮询获取 暂定获取前1000条
      }),
      serviceList: reactive({}), // 服务列表
      upstreamParam: reactive({
        page: 1,
        page_size: 1000, // 此处暂时不做轮询获取 暂定获取前1000条
      }),
      upstreamList: reactive({}), // 服务列表
      methodList: MethodOption, // 请求方法列表
    })

    // 获取服务列表
    const getServiceList = async params => {
      let {code, data: dataList, msg} = await $serviceList(params)

      if (code != 0) {
        message.error(msg)
      } else {
        let tmpList = ref([])
        dataList.data.forEach(item => {
          tmpList.value.push({
            res_id: item.res_id,
            name: item.name,
          })
        })

        data.serviceList = tmpList
      }
    }

    // 获取upstream列表
    const getUpstreamList = async params => {
      let {code, data: dataList, msg} = await $upstreamList(params)

      if (code != 0) {
        message.error(msg)
      } else {
        let tmpList = ref([])
        dataList.data.forEach(item => {
          tmpList.value.push({
            res_id: item.res_id,
            name: item.name,
          })
        })

        data.upstreamList = tmpList
      }
    }
    // 获取详情
    const getInfo = async (serviceResId, resId) => {
      let { code, data: dataInfo, msg } = await $routerInfo(serviceResId, resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        data.formData.service_res_id = dataInfo.service_res_id
        data.formData.upstream_res_id = dataInfo.upstream_res_id
        data.formData.router_name = dataInfo.router_name
        data.formData.request_methods = dataInfo.request_methods
        data.formData.router_path = dataInfo.router_path
        data.formData.enable = dataInfo.enable == 1 ? true : false
      }
    }

    // 点击提交保存当前数据
    const onSubmit = async () => {
      let formData = JSON.parse(JSON.stringify(data.formData))
      formData.enable = formData.enable == true ? 1 : 2
      formData.request_methods = formData.request_methods.join(",")

      // 调用增加/修改接口
      let routerRes
      if (props.currentResId !== null) {
        routerRes = await $routerUpdate(props.serviceResId, props.currentResId, formData)
      } else {
        routerRes = await $routerAdd(formData)
      }

      if (routerRes.code != 0) {
        message.error(routerRes.msg)
        return
      } else {
        message.success(routerRes.msg)
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
      schemaRouter,
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
