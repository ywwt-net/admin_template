<template>
    <div>
      <!-- <el-button type="primary" @click="addMenu">添加菜单</el-button> -->
      <el-table :data="menus" style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" min-width="20"></el-table-column>
        <el-table-column prop="name" label="菜单名"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="icon" label="图标"></el-table-column>
        <el-table-column
        prop="updated_at"
        :formatter="$stdDate"
        label="更新时间"></el-table-column>
      <el-table-column
        prop="created_at"
        :formatter="$stdDate"
        label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- <el-button @click="editMenu(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteMenu(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加/编辑菜单对话框 -->
      <el-dialog :title="editMode ? '编辑菜单' : '添加菜单'" v-model="dialogVisible" class="dialog-custom" :close-on-click-modal="false"  :close-on-press-escape="false" >
        <el-form :model="form">
          <el-form-item label="菜单名">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="路径">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMenu">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/api'
  import { ElMessage, ElMessageBox } from 'element-plus'

  
  const menus = ref([])
  const dialogVisible = ref(false)
  const editMode = ref(false)
  const form = ref({ name: '', path: '', icon: '' })
  
  onMounted(async () => {
    menus.value = await api.menu.getAll()
  })
  
  const addMenu = () => {
    editMode.value = false
    form.value = { name: '', path: '', icon: '' }
    dialogVisible.value = true
  }
  
  const editMenu = (menu) => {
    editMode.value = true
    form.value = { ...menu }
    dialogVisible.value = true
  }
  
  const submitMenu = async () => {
    if (editMode.value) {
      await api.menu.update(form.value.id, form.value)
    } else {
      await api.menu.create(form.value)
    }
    menus.value = await api.menu.getAll()
    dialogVisible.value = false
  }
  
  const deleteMenu = async (id) => {
    try {
      await ElMessageBox.confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      await api.menu.delete(id)
      menus.value = menus.value.filter(menu => menu.id !== id)

  } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败，请稍后重试')
        console.error('删除失败:', error)
      }
  }
  }
  </script>