<template>
  <el-upload
    action="/api/upload/image"
    :headers="authHeaders"
    :on-success="handleUploadSuccess"
    :before-upload="validateFile"
    :file-list="displayFileList"
    list-type="picture"
    :limit="1"
    :on-remove="handleRemoveImage"
  >
    <div class="upload-wrapper">
      <el-button v-if="!images" type="primary">上传图片</el-button>
      <span v-if="!images" class="upload-tip">支持 JPG/PNG 格式，文件大小不超过 2MB</span>
    </div>
  </el-upload>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'

// 状态和依赖
const store = useStore()
const images = defineModel({ default: '' })

// 文件限制配置
const FILE_LIMITS = {
  image: {
    types: ['image/jpeg', 'image/png'],
    maxSize: () => store.getImageSize(), // 2MB
    typeError: '仅支持 JPG 或 PNG 格式',
    sizeError: '文件大小不能超过 2MB'
  }
}

// 计算属性：文件列表
const displayFileList = computed(() => (images.value ? [{ url: images.value }] : []))

// 请求头
const authHeaders = { Authorization: localStorage.getItem('token') || '' }

// 验证文件
const validateFile = (file) => {
  const limits = FILE_LIMITS.image
  const isValidType = limits.types.includes(file.type)
  const isValidSize = file.size <= limits.maxSize()

  if (!isValidType) ElMessage.error(limits.typeError)
  if (!isValidSize) ElMessage.error(limits.sizeError)

  return isValidType && isValidSize
}

const handleUploadSuccess = (response) => {
  const imageUrl = response?.url

  if (imageUrl) {
    images.value = imageUrl
    ElMessage.success('图片上传成功')
  } else {
    const errorMsg = response?.error || '图片上传失败'
    ElMessage.error(errorMsg)
  }
}

// 处理文件移除
const handleRemoveImage = () => {
  images.value = ''
}
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.upload-tip {
  font-size: 12px;
  color: #606266;
}

:deep(.el-upload),
:deep(.el-upload-list) {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: none !important;
}

:deep(.el-upload-list__item) {
  margin: 0 auto;
  transition: none !important;
}
</style>