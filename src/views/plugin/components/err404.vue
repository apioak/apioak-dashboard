<template>
  <div class="text">
    <h3 v-show="data.pluginType === 1">请在“插件信息”中选择插件</h3>
    <h3 v-show="data.pluginType === 2">暂不支持当前插件</h3>
  </div>
</template>
<script>
import { reactive } from 'vue'

export default {
  props: {
    pluginOpType: {
      Number
    },
    pluginTag: {
      String
    }
  },
  setup(props) {
    const data = reactive({
      pluginType: 0
    })

    if (props.pluginTag !== '') {
      data.pluginType = 2
    } else {
      data.pluginType = 1
    }

    return { data }
  }
}
</script>

<style lange="scss" scoped>
.text {
  align-content: center;
  justify-content: center;
  display: flex;
}
</style>
