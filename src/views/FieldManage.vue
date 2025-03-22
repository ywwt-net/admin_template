<template>
  <div>
    <!-- <el-button type="primary" @click="addField">添加字典</el-button> -->
    <el-table :data="fields" style="margin-top: 20px;">
      <el-table-column prop="id" label="ID" min-width="20"></el-table-column>
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="description"  label="描述" ></el-table-column>
      <el-table-column min-width="200" label="记录值 / 图片">
      <template #default="{ row }">
        <img v-if="row.image" :src="row.image" alt="图片" style="max-height: 100px;" />
        <span v-else>{{ $fmtText(_,_,row.value) }}</span>
      </template>
    </el-table-column>
      <el-table-column
        prop="updated_at"
        :formatter="$stdDate"
        label="更新时间"
       ></el-table-column>
      <el-table-column
        prop="created_at"
        :formatter="$stdDate"
        label="创建时间"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button @click="editField(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="deleteField(scope.row.id)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑字段对话框 -->
    <el-dialog :title="editMode ? '编辑字段' : '添加字段'" v-model="dialogVisible" class="dialog-custom" :close-on-click-modal="false"  :close-on-press-escape="false">
      <el-form :model="form" :rules="rules" ref="fieldForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入唯一的键名" :disabled="editMode"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item  v-if="!form.image" label="值" prop="value">
          <el-input
            v-model="form.value"
            type="textarea"
            :rows="5"
            placeholder="请输入字段值"
          ></el-input>
        </el-form-item>
        <el-form-item  
        v-if="!form.value"

        label="图片" prop="image">
            <UploadImage v-model:="form.image" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitField">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadImage from '@/components/UploadImage.vue'

const fields = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const form = ref({ key: '', description: '', value: '' })
const fieldForm = ref(null)



const rules = {
  key: [
    { required: true, message: '请输入键名', trigger: 'blur' },
    { min: 1, max: 100, message: '键名长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 255, message: '描述最多 255 个字符', trigger: 'blur' }
  ],
  value: [
    { max: 1000, message: '值最多 1000 个字符', trigger: 'blur' }
  ]
}

onMounted(async () => {
  try {
    fields.value = await api.field.getAll()
  } catch (error) {
    ElMessage.error('获取字段列表失败')
    console.error('获取失败:', error)
  }
})

const addField = () => {
  editMode.value = false
  form.value = { key: '', description: '', value: '' }
  dialogVisible.value = true
  fieldForm.value?.resetFields()
}

const editField = (field) => {
  editMode.value = true
  form.value = { ...field }
  dialogVisible.value = true
}

const submitField = () => {
  fieldForm.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (editMode.value) {
        await api.field.update(form.value.id, form.value)
        ElMessage.success('更新成功')
      } else {
        await api.field.create(form.value)
        ElMessage.success('创建成功')
      }
      fields.value = await api.field.getAll()
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error(editMode.value ? '更新失败' : '创建失败')
      console.error('操作失败:', error)
    }
  })
}

const deleteField = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除此字段吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await api.field.delete(id)
    fields.value = fields.value.filter(field => field.id !== id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error('删除失败:', error)
    }
  }
}
</script>