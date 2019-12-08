<template>
  <div id="app">
    <el-container class="main">
      <el-header class="main-header"></el-header>
      <el-container>
        <el-aside
          class="main-aside"
          :style="{ width:isCollapse ? 'auto' : '200px' }"
        >
          <h3 v-if="!isCollapse">APIOAK</h3>
          <h3 v-else class="collapse">OAK</h3>
          <el-menu
            class="main-menu"
            text-color="#bbb"
            active-text-color="#fff"
            background-color="#333"
            :collapse="isCollapse"
            default-active="dashboard"
            router
          >
            <el-menu-item index="dashboard">
              <i class="el-icon-menu"></i>
              <span slot="title">概览</span>
            </el-menu-item>
            <el-menu-item index="service">
              <i class="el-icon-help"></i>
              <span slot="title">服务</span>
            </el-menu-item>
          </el-menu>
          <div class="main-aside_close">
            <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="collapseMenu"></i>
          </div>
        </el-aside>
        <el-main class="main-content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    collapseMenu() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style>
@import "~@/styles/css/reset.css";
</style>
<style lang="scss">
.el {
  &-header {
    background: #262626;
  }
}
.main {
  width: 100%;
  height: 100%;
  position: absolute;
  color: #fff;
  &-aside {
    position: relative;
    height: 100%;
    background: #333;
    overflow: hidden;
    h3 {
      padding: 20px;
      font-size: 16px;
      font-weight: bold;
      &.collapse {
        padding: 20px 0;
        text-align: center;
      }
    }
    &_close {
      font-size: 24px;
      position: absolute;
      width: 100%;
      height: 56px;
      bottom: 0;
      border-top: 1px solid #000;
      box-sizing: border-box;
      line-height: 56px;
      background: #333;
      i {
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  &-menu {
    border-right: 0 !important;
    li {
      font-weight: 700;
    }
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
  &-content {
    height: 100%;
    color: #333;
    padding: 0 !important;
  }
}
</style>
