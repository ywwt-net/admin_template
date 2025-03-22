<template>
    <div>
      <el-button type="primary" @click="addProduct">添加产品</el-button>
      <el-table :data="products" style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" min-width="20" ></el-table-column>
        <el-table-column prop="name" label="产品名" ></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="cat" label="分类" ></el-table-column>
        <el-table-column prop="order_id" label="排序" ></el-table-column>
        <el-table-column  prop="image" label="图片">
        <template #default="{ row }">
            <img v-if="row.image" :src="row.image" alt="图片" style="max-height: 100px;" />
        </template>
      </el-table-column>
        <el-table-column
          prop="updated_at"
          :formatter="$stdDate"
          label="更新时间"
          width="180"></el-table-column>
        <el-table-column
          prop="created_at"
          :formatter="$stdDate"
          label="创建时间"
          width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button @click="editProduct(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加/编辑产品对话框 -->
      <el-dialog :title="editMode ? '编辑产品' : '添加产品'" v-model="dialogVisible" class="dialog-custom" :close-on-click-modal="false"  :close-on-press-escape="false" >
        <el-form :model="form" :rules="rules" ref="productForm">
          <el-form-item label="产品名" prop="name">
            <el-input v-model="form.name" placeholder="请输入产品名"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入产品描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="cat">
            <el-input v-model="form.cat" placeholder="请输入分类"></el-input>
          </el-form-item>


          <el-form-item label="排序" prop="order_id">
          <el-input  type="number" v-model.number="form.order_id" placeholder="请输入序号"></el-input>
        </el-form-item>


          <el-form-item label="图片" prop="image">
            <UploadImage v-model:="form.image" />
        </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProduct">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import UploadImage from '@/components/UploadImage.vue'

  
  const products = ref([])
  const dialogVisible = ref(false)
  const editMode = ref(false)
  const form = ref({ name: '', description: '', cat: '',order_id : 0 })
  const productForm = ref(null)
  
  const rules = {
    name: [
      { required: true, message: '请输入产品名', trigger: 'blur' },
      { max: 100, message: '产品名最多 100 个字符', trigger: 'blur' }
    ],
    description: [
      { max: 1000, message: '描述最多 1000 个字符', trigger: 'blur' }
    ],
    cat: [
      { max: 50, message: '分类最多 50 个字符', trigger: 'blur' }
    ]
  }
  
  onMounted(async () => {
    try {
      products.value = await api.product.getAll()
    } catch (error) {
      ElMessage.error('获取产品列表失败')
      console.error('获取失败:', error)
    }
  })
  
  const addProduct = () => {
    editMode.value = false
    form.value = { name: '', description: '', cat: '',order_id : 0 }
    dialogVisible.value = true
    productForm.value?.resetFields()
  }
  
  const editProduct = (product) => {
    editMode.value = true
    form.value = { ...product }
    dialogVisible.value = true
  }
  
  const submitProduct = () => {
    productForm.value.validate(async (valid) => {
      if (!valid) return
  
      try {
        if (editMode.value) {
          await api.product.update(form.value.id, form.value)
          ElMessage.success('更新成功')
        } else {
          await api.product.create(form.value)
          ElMessage.success('创建成功')
        }
        products.value = await api.product.getAll()
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error(editMode.value ? '更新失败' : '创建失败')
        console.error('操作失败:', error)
      }
    })
  }
  
  const deleteProduct = async (id) => {
    try {
      await ElMessageBox.confirm('确定删除此产品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
  
      await api.product.delete(id)
      products.value = products.value.filter(product => product.id !== id)
      ElMessage.success('删除成功')
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败，请稍后重试')
        console.error('删除失败:', error)
      }
    }
  }
  </script>