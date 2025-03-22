<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <Sidebar />
    </el-aside>
    <el-container>
      <el-header>
        <h3>后台管理系统</h3>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
        <a class="footer-text" href="https://www.ywwt.net" target="_blank">ywwt.net 强力驱动</a>

      </el-main>

    </el-container>

  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import Sidebar from '@/components/Sidebar.vue'
import api from '@/api'

const router = useRouter()
const store = useStore()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }
  try {
    store.setUserInfo(await api.user.userInfo())
    store.setMenus(await api.menu.menuInfo())
  } catch (error) {
    console.error('获取数据失败:', error)
    localStorage.removeItem('token')
    router.push('/login')
  }
})

const logout = () => {
  localStorage.removeItem('token')
  store.resetData()
  router.push('/login')
}
</script>

<style scoped>
/* 整体容器 */
.el-container {
  height: 100vh;
  background-color: #f0f2f5; /* 浅灰背景，提升整体亮度 */
}



/* 头部 */
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  padding: 0 20px;
  border-bottom: none; /* 移除原有的边框 */
}

/* 头部标题 */
.el-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333; /* 深色文字 */
}

/* 退出按钮 */
.el-header .el-button {
  background-color: #ff4d4f; /* 鲜艳的红色 */
  border: none;
  color: #fff;
  transition: background-color 0.3s; /* 颜色过渡 */
}

.el-header .el-button:hover {
  background-color: #ff7875; /* 悬停时颜色变化 */
}

/* 主内容区 */
.el-main {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
  margin: 20px; /* 外边距，增加空间感 */
}


/* 底部文本固定在容器底部 */
.footer-text {
  position: absolute;
  bottom: 20px; /* 与底部间距 */
  left: 0;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-bottom: 10px;
}

</style>