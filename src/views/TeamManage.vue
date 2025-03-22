<template>
  <div>
    <el-button type="primary" @click="addTeam">添加团队</el-button>
    <el-table :data="teamList" style="margin-top: 20px;" v-loading="loading">
      <el-table-column prop="id" label="ID" min-width="20"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="title" label="头衔"></el-table-column>
      <el-table-column prop="content" min-width="200"   :formatter="$fmtText" label="内容" ></el-table-column>
      <el-table-column prop="rank"   :formatter="rankFormatter" label="级别"></el-table-column>
      <el-table-column  prop="image" label="图片">
        <template #default="{ row }">
            <img v-if="row.image" :src="row.image" alt="图片" style="max-height: 100px;" />
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="排序" ></el-table-column>

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
          <el-button @click="editTeam(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteTeam(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑团队对话框 -->
    <el-dialog :title="editMode ? '编辑团队' : '添加团队'" v-model="dialogVisible" class="dialog-custom" :close-on-click-modal="false"  :close-on-press-escape="false" >
      <el-form :model="form" :rules="rules" ref="teamForm" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="头衔" prop="title">
          <el-input v-model="form.title" placeholder="请输入头衔"></el-input>
        </el-form-item>
        <el-form-item label="内容"  prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入内容"></el-input>
        </el-form-item>
        
        <el-form-item label="级别" prop="rank">
          <RankSelect  v-model="form.rank" />
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
        <el-button type="primary" @click="submitTeam" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import api from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import UploadImage from '@/components/UploadImage.vue'
import RankSelect from '@/components/RankSelect.vue'
import  team from '@/models/team'

// 状态管理
const teamList = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const loading = ref(false)
const submitting = ref(false)
const form = ref({ id: 0, name: '', title: '', content: '', image: '', rank: 0 , order_id : 0 })
const teamForm = ref(null)



// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  title: [{ required: true, message: '请输入头衔', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  rank: [{ required: true, message: '请输入级别', trigger: 'blur' }],
  image: [{ required: true, message: '请上传图片', trigger: 'change' }],
}

// 获取团队列表
const fetchTeams = async () => {
  try {
    loading.value = true
    teamList.value = await api.team.getAll()
  } catch (error) {
    ElMessage.error('加载团队列表失败，请稍后重试')
    console.error('获取团队失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTeams)

// 添加团队
const addTeam = () => {
  editMode.value = false
  form.value = { id: 0, name: '', title: '', content: '', image: '', rank: 4 , order_id : 0 }
  dialogVisible.value = true
}

// 编辑团队
const editTeam = (team) => {
  editMode.value = true
  form.value = { ...team }
  dialogVisible.value = true
}

// 提交团队数据
const submitTeam = async () => {
  teamForm.value.validate(async (valid) => {
    if (!valid) return

    try {
      submitting.value = true
      if (editMode.value) {
        await api.team.update(form.value.id, form.value)
        ElMessage.success('团队更新成功')
      } else {
        await api.team.create(form.value)
        ElMessage.success('团队添加成功')
      }
      await fetchTeams()
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('操作失败，请稍后重试')
      console.error('提交失败:', error)
    } finally {
      submitting.value = false
    }
  })
}

// 删除团队
const deleteTeam = async (id) => {


  try {

    await ElMessageBox.confirm('确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await api.team.delete(id)
    teamList.value = teamList.value.filter(team => team.id !== id)
    ElMessage.success('团队删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请稍后重试')
      console.error('删除失败:', error)
    }
  }
}



const rankFormatter = (row, column, cellValue) => {
  return team.rank[cellValue] || '未知';
}

</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>