<template>
  <div class="list-header">
    <div class="list-header-icon" :data-color="sidebarItemColor">
      <i class="iconfont" :class="icon"></i>
    </div>
    <div class="list-header-title">
      <router-link :to='{name: title_href}'>{{ title }} <span class="subtitle">{{ subtitle }}</span></router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "ListHeader",
  props: {
    sidebarItemColor: {
      type: String,
      default: "blue",
      validator: (value) => {
        let acceptedValues = ["blue", "green", "orange", "red", "purple"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    title_href: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
}
</script>

<style scoped>
.list-header{
  margin-left: 15px;
  margin-top: -15px;
}
.iconfont{
  font-size: 30px;
}
.list-header-icon {
  border: 2px;
  border-radius: 3px;
  padding: 15px 11px;
  width: 50px;
  height: 50px;
  color: #e7e7e7;
  display: inline-block;
  box-shadow: 0 5px 7px 0 rgba(0,0,0,0.5);
  margin-right: 15px;
}
.list-header-title{
  display: inline-block;
  font-size: 18px;
  top: 12px;
  position: absolute;
}
.subtitle{
  font-size: 16px;
}
</style>