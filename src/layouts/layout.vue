<template>
  <a-layout class="layout">
    <!-- 左侧导航 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />

      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="service" @click="$router.push('/service')">
          <user-outlined />
          <span>服务管理</span>
        </a-menu-item>
        <a-menu-item key="router" @click="$router.push('/router')">
          <video-camera-outlined />
          <span>路由管理</span>
        </a-menu-item>
        <a-menu-item key="upstream" @click="$router.push('/upstream')">
          <upload-outlined />
          <span>上游管理</span>
        </a-menu-item>
        <a-menu-item key="ssl" @click="$router.push('/ssl')">
          <upload-outlined />
          <span>证书管理</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <!-- 右侧 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header class="header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

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
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { $logout } from '@/api'
import { message } from 'ant-design-vue'
import router from '@/router'
import store from '@/store'
export default {
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },

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
.layout {
  width: 100vw;
  height: 100vh;
}
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.header {
  background: #001529;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.user span {
  margin-top: 10px;
  margin-right: 10px;
}

.user img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  color: #ffffffa6;
}

.trigger:hover {
  color: #1890ff;
}

.content {
  margin: 10px;
  padding: 10px;
  background: #fff;
  minheight: 280px;
}
</style>
