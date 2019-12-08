<template>
  <div class="view-header">
    <h3 class="fl" v-html="name"></h3>
  </div>
</template>
<script>
export default {
  name: "viewHeader",
  props: {
    name: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.view-header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 1px solid #ddd;
  h3 {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
