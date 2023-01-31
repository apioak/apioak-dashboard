<template>
  <!-- 左侧部分 -->
  <a-layout>
    <!-- 固定菜单 -->
    <a-layout-sider
      :style="{
        marginTop: '60px',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0
      }"
    >
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="service" @click="$router.push('/service')">
          <i class="iconfont icon-fuwuqi" />
          <span>服务管理</span>
        </a-menu-item>
        <a-menu-item key="router" @click="$router.push('/router')">
          <i class="iconfont icon-lianjie" />
          <span>路由管理</span>
        </a-menu-item>
        <a-menu-item key="upstream" @click="$router.push('/upstream')">
          <i class="iconfont icon-jiedian" />
          <span>上游管理</span>
        </a-menu-item>
        <a-menu-item key="ssl" @click="$router.push('/ssl')">
          <i class="iconfont icon-zhengshu-copy" />
          <span>证书管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧 -->
    <a-layout>
      <!-- 固定头部 -->
      <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="logo">
          <div>
            <img src="@/assets/img/apioak-logo-no-text.png" />
          </div>
          <div>
            <span>APIOAK-Admin</span>
          </div>
        </div>

        <!-- 用户信息 -->
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal">
          <a-sub-menu key="sub1">
            <template #title>
              <div class="user">
                <span>{{ userEmail }}</span>
                <img src="../assets/img/user.gif" />
              </div>
            </template>
            <a-menu-item key="logout" @click="logout">退出登录</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-header>

      <!-- 主体 -->
      <a-layout :style="{ marginLeft: '200px', marginTop: '64px' }">
        <!-- 内容 -->
        <a-layout-content class="content">
          <router-view></router-view>
        </a-layout-content>

        <!-- 页脚 -->
        <!-- <a-layout-footer :style="{ textAlign: 'center' }">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer> -->
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { ref } from 'vue'
import { $logout } from '@/api'
import { message } from 'ant-design-vue'
import router from '@/router'
import store from '@/store'
export default {
  setup() {
    const selectedKeys = ref(['service'])
    const collapsed = ref(false)
    const { userInfo } = store.state.user

    const logout = async () => {
      const { code, msg } = await $logout()
      if (code == 0 || code == 401) {
        // 退出登录后清空本地用户信息和token缓存
        store.commit('user/setToken', {})
        // 跳转到登录页面
        router.replace('/login')
      } else {
        message.error(msg)
      }
    }

    return { selectedKeys, collapsed, logout, userEmail: userInfo.email }
  }
}
</script>

<style lange="scss" scoped>
.content {
  margin: 10px;
  padding: 10px;
  background: #fff;
}
.logo {
  height: 30px;
  margin: 15px;
  display: flex;
  justify-content: left;
  align-items: center;
}
.logo img {
  height: 30px;
  margin-left: 6px;
}
.logo span {
  margin-left: 10px;
  color: #fff;
  font-size: 17px;
}
.header {
  background: #001529;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user span {
  margin-right: 10px;
}
.user img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
}
</style>
