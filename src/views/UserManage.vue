<template>
  <div>
    <!-- <el-button type="primary" @click="addUser">添加用户</el-button> -->
    <el-table :data="users" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" min-width="20"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column
        prop="updated_at"
        :formatter="$stdDate"
        label="更新时间"></el-table-column>
      <el-table-column
        prop="created_at"
        :formatter="$stdDate"
        label="创建时间"></el-table-column>
      <el-table-column
        prop="login_at"
        :formatter="$stdDate"
        label="最后登录"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editUser(scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="deleteUser(scope.row.id)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
        class="dialog-custom"
      :title="editMode ? '编辑用户' : '添加用户'"
      v-model="dialogVisible"
      width="30%"
      :close-on-click-modal="false"  :close-on-press-escape="false"
      >
      <el-form :model="form" :rules="rules" ref="teamForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="editMode"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            :placeholder="editMode ? '密码为空则不修改' : ''"
            type="password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" type="text"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api";
import { ElMessage, ElMessageBox } from "element-plus";

const users = ref([]);
const dialogVisible = ref(false);
const editMode = ref(false);
const form = ref({ id: "", username: "", password: "", nickname: "" });
const teamForm = ref(null);

const rules = computed(() => ({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: !editMode.value, message: "请输入密码", trigger: "blur" },
  ],
}));

onMounted(async () => {
  try {
    users.value = await api.user.getAll();
  } catch (error) {
    ElMessage.error("获取用户列表失败");
    console.error(error);
  }
});

const addUser = () => {
  editMode.value = false;
  form.value = { id: "", username: "", password: "", role_id: "" };
  dialogVisible.value = true;
  teamForm.value?.resetFields();
};

const editUser = (user) => {
  editMode.value = true;
  form.value = { ...user };
  dialogVisible.value = true;
};

const submitUser = () => {
  teamForm.value.validate(async (valid) => {
    if (!valid) return;

    try {
      if (editMode.value) {
        await api.user.update(form.value.id, {
          nickname: form.value.nickname,
          password: form.value.password,
        });
        ElMessage.success("更新成功");
      } else {
        await api.user.create({
          username: form.value.username,
          password: form.value.password,
          nickname: form.value.nickname,
        });
        ElMessage.success("创建成功");
      }
      users.value = await api.user.getAll();
      dialogVisible.value = false;
    } catch (error) {
      ElMessage.error(error.response?.data?.error || (editMode.value ? "更新失败" : "创建失败"));
    }
  });
};

const deleteUser = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await api.user.delete(id);
    users.value = users.value.filter((user) => user.id !== id);
    ElMessage.success("删除成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(error.response?.data?.error || (editMode.value ? "更新失败" : "创建失败"));
    }
  }
};
</script>

<style scoped>


</style>