<template>
  <div class="login-container">
    <el-form :model="form" @submit.prevent="login" class="login-form">
      <h2>后台管理系统</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-button type="primary" native-type="submit">登录</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'
import api from '@/api'

const form = ref({ username: '', password: '' })
const router = useRouter()
const store = useStore()

const login = async () => {
  try {
    const res = await api.auth.login(form.value)
    localStorage.setItem('token', res.token)
    store.setUserInfo(await api.user.userInfo())
    store.setMenus(await api.menu.menuInfo())
    router.push('/home')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查用户名或密码')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5; /* 简洁浅灰背景 */
}

.login-form {
  width: 420px; /* 适中宽度，大气 */
  padding: 32px; /* 适中内边距 */
  background: #fff;
  border-radius: 10px; /* 轻微圆角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 轻阴影 */
}

h2 {
  margin-bottom: 28px; /* 适中间距 */
  text-align: center;
  font-size: 24px; /* 稍大字体 */
  font-weight: 500; /* 适中粗细 */
  color: #1f2f3d; /* 深蓝灰色 */
}

.el-form-item {
  margin-bottom: 22px; /* 适中间距 */
  display: flex;
  align-items: center;
}

.el-form-item :deep(.el-form-item__label) {
  width: 90px; /* 适中标签宽度 */
  text-align: right;
  padding-right: 12px; /* 适当间距 */
  color: #555; /* 深灰色 */
  font-size: 14px; /* 默认字体 */
}

.el-form-item :deep(.el-form-item__content) {
  flex: 1;
}

.el-button {
  width: 100%;
  padding: 12px; /* 适中高度 */
  border-radius: 4px; /* 框架默认圆角 */
  font-size: 16px; /* 稍大字体 */
}
</style>