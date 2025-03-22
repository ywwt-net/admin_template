<template>
  <div>
    <el-button type="primary" @click="addNews">添加新闻</el-button>
    <el-table :data="newsList" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" min-width="20" ></el-table-column>
      <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
      <el-table-column  prop="image" label="图片">
        <template #default="{ row }">
            <img v-if="row.image" :src="row.image" alt="图片" style="max-height: 100px;" />
        </template>
      </el-table-column>

      <el-table-column prop="content"  :formatter="$fmtText" label="内容" min-width="150"></el-table-column>
      <el-table-column prop="keywords" label="关键字"></el-table-column>

      <el-table-column prop="top" label="置顶" ></el-table-column>
      
      <el-table-column prop="updated_at" :formatter="$stdDate" label="更新时间"></el-table-column>
      <el-table-column prop="created_at" :formatter="$stdDate" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editNews(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteNews(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 使用封装的分页组件 -->
    <Pagination
      v-model="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      @fetch="fetchNews"
    />

    <!-- 添加/编辑新闻对话框 -->
    <el-dialog :title="editMode ? '编辑新闻' : '添加新闻'" v-model="dialogVisible" width="50%"   :close-on-click-modal="false"  :close-on-press-escape="false">
      <el-form :model="form" :rules="rules" ref="newsForm" label-width="100px" >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <UploadImage v-model="form.image" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Editor v-model="form.content"></Editor>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNews">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import Editor from '@/components/Editor.vue'
import UploadImage from '@/components/UploadImage.vue'
import Pagination from '@/components/Pagination.vue' // 引入分页组件
import { ElMessage, ElMessageBox } from 'element-plus'

const newsList = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({ id: '', keywords: '', title: '', content: '', image: '', top: 0 })
const newsForm = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  subtitle: [{ max: 100, message: '副标题最多100个字符', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const fetchNews = async () => {
  try {
    const response = await api.news.getAll({ page: currentPage.value, per_page: pageSize.value })
    newsList.value = response
    total.value = response.length >= pageSize.value ? currentPage.value * pageSize.value + 1 : currentPage.value * pageSize.value
  } catch (error) {
    ElMessage.error('获取新闻失败')
    console.error('获取新闻失败:', error)
  }
}

onMounted(fetchNews)

const addNews = () => {
  editMode.value = false
  form.value = { id: 0, keywords: '', title: '', content: '', image: '' , top: 0}
  dialogVisible.value = true
  newsForm.value?.resetFields()
}

const editNews = (news) => {
  editMode.value = true
  form.value = { ...news }
  dialogVisible.value = true
}

const submitNews = () => {
  newsForm.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (editMode.value) {
        await api.news.update(form.value.id, form.value)
        ElMessage.success('更新成功')
      } else {
        await api.news.create(form.value)
        ElMessage.success('创建成功')
      }
      fetchNews()
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error(editMode.value ? '更新失败' : '创建失败')
      console.error('提交失败:', error)
    }
  })
}

const deleteNews = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await api.news.delete(id)
    ElMessage.success('删除成功')
    fetchNews()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error('删除失败:', error)
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>