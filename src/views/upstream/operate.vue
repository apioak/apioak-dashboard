<template>
  <div class="main">
    <a-form
      :model="data.formData"
      class="form"
      v-bind="{ labelCol: { xs: { span: 4 } }, wrapperCol: { xs: { span: 18 } } }"
      @finish="fn.onSubmit"
    >
      <a-form-item label="上游名称：" name="name" :rules="schemaUpstream.name">
        <a-input v-model:value="data.formData.name" />
      </a-form-item>

      <a-form-item label="负载均衡：" name="load_balance" :rules="schemaUpstream.load_balance">
        <a-select
          class="select"
          ref="select"
          v-model:value="data.formData.load_balance"
          placeholder="请选择"
        >
          <a-select-option value="1">加权轮询（Round Robin）</a-select-option>
          <a-select-option value="2">一致性哈希（CHash）</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="upstream_nodes_main" label="上游节点：" name="upstream_nodes">
        <a-space
          v-for="(item, index) in data.formData.upstream_nodes"
          :key="item.id"
          style="display: flex; margin-bottom: 0px"
          align="baseline"
        >
          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_ip']"
            :rules="schemaUpstream.node_ip"
            label="IP"
          >
            <a-input
              placeholder="IPV4"
              v-model:value="data.formData.upstream_nodes[index].node_ip"
            />
          </a-form-item>

          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_port']"
            :rules="schemaUpstream.node_port"
          >
            <a-input-number
              placeholder="Port"
              v-model:value="data.formData.upstream_nodes[index].node_port"
            />
          </a-form-item>

          <a-form-item
            class="upstream_nodes_item"
            :name="['upstream_nodes', index, 'node_weight']"
            :rules="schemaUpstream.node_weight"
          >
            <a-input-number
              placeholder="Weight"
              v-model:value="data.formData.upstream_nodes[index].node_weight"
            />
          </a-form-item>

          <a-form-item class="upstream_nodes_item">
            <a @click="fn.addIP()">
              <i class="iconfont icon-tianjia"></i>
            </a>

            <a v-if="index > 0" @click="fn.removeIP(item)">
              <i class="iconfont color-red icon-jian"></i>
            </a>
          </a-form-item>
        </a-space>
      </a-form-item>

      <a-form-item label="连接超时：" name="connect_timeout">
        <a-input v-model:value="data.formData.connect_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="写超时：" name="write_timeout">
        <a-input v-model:value="data.formData.write_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="读超时：" name="read_timeout">
        <a-input v-model:value="data.formData.read_timeout" placeholder="请输入（毫秒）" />
      </a-form-item>

      <a-form-item label="启用：" v-show="currentResId == null">
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
import { $upstreamInfo, $upstreamAdd, $upstreamUpdate } from '@/api'
import { schemaUpstream } from '@/schema'

export default {
  props: {
    currentResId: null
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
    const defaultNode = {
      id: 0,
      node_ip: null,
      node_port: null,
      node_weight: null
    }

    // 定义变量
    const data = reactive({
      formData: {
        name: null,
        load_balance: null,
        connect_timeout: null,
        write_timeout: null,
        read_timeout: null,
        upstream_nodes: ref([defaultNode]),
        enable: false
      }
    })

    // 获取详情
    const getInfo = async resId => {
      let { code, data: dataInfo, msg } = await $upstreamInfo(resId)

      if (code !== 0) {
        message.error(msg)
        emit('componentCloseDrawer')
        return
      } else {
        data.formData.name = dataInfo.name
        data.formData.load_balance = dataInfo.algorithm.toString()
        data.formData.enable = dataInfo.enable == 1 ? true : false
        data.formData.connect_timeout = dataInfo.connect_timeout
        data.formData.write_timeout = dataInfo.write_timeout
        data.formData.read_timeout = dataInfo.read_timeout

        if (dataInfo.node_list.length > 0) {
          data.formData.upstream_nodes = ref([])

          dataInfo.node_list.forEach((item, index) => {
            let nodesInfo = JSON.parse(JSON.stringify(defaultNode))
            nodesInfo.id = index
            nodesInfo.node_ip = item.node_ip
            nodesInfo.node_port = item.node_port
            nodesInfo.node_weight = item.node_weight
            data.formData.upstream_nodes.push(nodesInfo)
          })
        }
      }
    }

    // 增加域名元素
    const addIP = () => {
      data.formData.upstream_nodes.push({
        id: data.formData.upstream_nodes.length,
        node_ip: null,
        node_port: null,
        node_weight: null
      })
    }

    // 删除域名元素
    const removeIP = async item => {
      let index = data.formData.upstream_nodes.indexOf(item)
      if (index !== -1) {
        data.formData.upstream_nodes.splice(index, 1)
      }
    }

    // 点击提交保存当前数据
    const onSubmit = async () => {
      let formData = JSON.parse(JSON.stringify(data.formData))
      formData.load_balance = parseInt(formData.load_balance)
      formData.connect_timeout = parseInt(formData.connect_timeout)
      formData.write_timeout = parseInt(formData.write_timeout)
      formData.read_timeout = parseInt(formData.read_timeout)
      formData.enable = formData.enable == true ? 1 : 2

      // 调用增加/修改接口
      let res
      if (props.currentResId !== null) {
        res = await $upstreamUpdate(props.currentResId, formData)
      } else {
        res = await $upstreamAdd(formData)
      }

      if (res.code && res.code != 0) {
        message.error(res.msg)
        return
      } else {
        message.success(res.msg)
        emit('componentRefreshList')
      }
    }

    // 表单取消，关闭抽屉
    const cancel = async () => {
      emit('componentCloseDrawer')
    }

    // 定义函数
    const fn = reactive({
      addIP,
      removeIP,
      onSubmit,
      cancel
    })

    return {
      schemaUpstream,
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
.upstream_nodes_main {
  margin-bottom: 0px;
}
.upstream_nodes_item {
  /* display: inline-block;
  justify-content: center;
  margin-right: 10px; */
}
</style>
