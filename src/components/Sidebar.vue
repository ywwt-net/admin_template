<template>
  <el-menu :default-active="$route.path" router >
    <el-menu-item v-for="menu in store.menus" :key="menu.path" :index="menu.path">
      <el-icon>
        <component :is="getIcon(menu.icon)" />
      </el-icon>
      <span>{{ menu.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { useStore } from '@/store'
import * as Icons from '@element-plus/icons-vue' // 导入所有 Element Plus 图标

const store = useStore()

// 动态获取图标组件
const getIcon = (iconName) => {
  // 如果 iconName 未定义或不存在，默认使用 'Menu' 图标
  return Icons[iconName] || Icons['Menu']
}
</script>

<style scoped>
.el-menu {
  height: 100%;
  background-color: #001529; /* Deep blue for a modern, sleek look */
  border-right: none; /* Remove right border for a clean design */
}

.el-menu-item {
  color: #bfcbd9; /* Soft gray for default text */
  transition: background-color 0.3s, color 0.3s; /* Smooth transitions */
  padding: 0 20px; /* Increased padding for a spacious feel */
}

.el-menu-item:hover {
  background-color: #002140; /* Slightly lighter blue on hover */
  color: #fff; /* White text on hover */
}

.el-menu-item.is-active {
  background-color: #1890ff; /* Bright blue for active state */
  color: #fff; /* White text for active item */
}

.el-menu-item .el-icon {
  margin-right: 10px; /* Space between icon and text */
  font-size: 18px; /* Slightly larger icons for visibility */
}

.el-menu-item span {
  font-size: 14px; /* Readable text size */
  line-height: 1.5; /* Improved line height for comfort */
}

/* Optional: Custom scrollbar for consistency */
.el-menu::-webkit-scrollbar {
  width: 6px;
}

.el-menu::-webkit-scrollbar-thumb {
  background-color: #bfcbd9; /* Matches text color */
  border-radius: 3px;
}
</style>