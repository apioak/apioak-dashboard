<template>router-index</template>

<script>
import router from '@/router'

export default {
  setup() {
    if (router.currentRoute.value.query.serviceResId != null) {
      console.log('==================', router.currentRoute.value.query.serviceResId)
    } else {
      console.log('****************')
    }
  }
}
</script>
