<script setup>
import { shallowRef, defineAsyncComponent } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'


// 组件异步加载
const Editor = defineAsyncComponent(() => import('@wangeditor/editor-for-vue').then(mod => mod.Editor))
const Toolbar = defineAsyncComponent(() => import('@wangeditor/editor-for-vue').then(mod => mod.Toolbar))

// 数据和状态
const editor = shallowRef()
const content = defineModel()
const store = useStore()


// 文件类型和大小限制
const FILE_LIMITS = {
  image: {
    types: ['image/jpeg', 'image/png'],
    maxSize: () => store.getImageSize(),
    typeError: '仅支持 JPEG 或 PNG 图片格式',
    sizeError: '图片大小不能超过 '+store.userInfo.config.config_image_size
  },
  video: {
    types: ['video/mp4'],
    maxSize: () => store.getVideoSize(), 
    typeError: '仅支持 MP4 视频格式',
    sizeError: '视频大小不能超过 '+store.userInfo.config.config_video_size
  }
}

// 验证文件
const validateFile = (file, type) => {
  const limits = FILE_LIMITS[type]
  if (!limits.types.includes(file.type)) {
    throw new Error(limits.typeError)
  }
  if (file.size > limits.maxSize()) {
    throw new Error(limits.sizeError)
  }
}

// 上传文件到服务器
const uploadToServer = async (file, type) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const endpoint = type === 'image' ? '/api/upload/image' : '/api/upload/video'
  const token = localStorage.getItem('token') || ''

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': token },
    body: formData
  })

  const data = await response.json()

  if (!data.url) {
    const errorMsg = data.error || `${type === 'image' ? '图片' : '视频'}上传失败`
    throw new Error(errorMsg)  
  }

  return data.url
}

// 处理文件上传
const handleUpload = async (file, type, insertFn) => {
  try {
     validateFile(file, type)
    const url = await uploadToServer(file, type)
    insertFn(url)
  } catch (error) {
    ElMessage.error(error.message || '上传失败')
    throw error // 让 wangEditor 显示错误提示
  }
}

// 编辑器配置
const editorConfig = {
  MENU_CONF: {
    uploadImage: {
      customUpload: (file, insertFn) => handleUpload(file, 'image', insertFn),
      allowedFileTypes: FILE_LIMITS.image.types,
      maxFileSize: FILE_LIMITS.image.maxSize()
    },
    uploadVideo: {
      customUpload: (file, insertFn) => handleUpload(file, 'video', insertFn),
      allowedFileTypes: FILE_LIMITS.video.types,
      maxFileSize: FILE_LIMITS.video.maxSize()
    }
  }
}

// 编辑器创建回调
const onCreated = (editorInstance) => editor.value = editorInstance
</script>

<template>
  <div class="editor-wrap">
    <Toolbar :editor="editor" />
    <Editor v-model="content" :defaultConfig="editorConfig" @onCreated="onCreated" />
  </div>
</template>

<style scoped>
.editor-wrap {
  width: 100%;
  border: 1px solid #ccc;
  min-height: 400px;
}

.editor-wrap :deep(.w-e-toolbar) {
  border-bottom: 1px solid #ccc;
}

.editor-wrap :deep(.w-e-text-container) {
  height: 100% !important;
}
</style>