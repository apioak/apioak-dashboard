<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
        :sidebar-item-color="sidebarBackground"
        :sidebar-background-image="sidebarBackgroundImage"
        :sidebar-background-color="sidebarBackgroundColor"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/services">
        <i class="iconfont icon-fuwuqi"/>
        <p>服务管理</p>
      </sidebar-link>
      <sidebar-link to="/router">
        <i class="iconfont icon-lianjie"/>
        <p>路由管理</p>
      </sidebar-link>
      <sidebar-link to="/certificate">
        <i class="iconfont icon-zhengshu-copy"/>
        <p>证书管理</p>
      </sidebar-link>
      <sidebar-link to="/cluster-node">
        <i class="iconfont icon-jiedian"/>
        <p>节点管理</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content></dashboard-content>
    </div>
    <notifications></notifications>
    <dialog></dialog>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: "blue",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
      sidebarBackgroundColor: "#002140",
    };
  },
};
</script>

<style lang="scss" scoped>
.main-panel {
  .content {
    padding: 0 15px 30px 15px;
  }
}

</style>
