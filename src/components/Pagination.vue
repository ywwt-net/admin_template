<!-- @/components/Pagination.vue -->
<template>
  <el-pagination
    v-model:current-page="innerPage"
    v-model:page-size="innerPageSize"
    :page-sizes="pageSizes"
    :total="total"
    layout="total, sizes, prev, pager, next"
    @size-change="handleChange"
    @current-change="handleChange"
    style="margin-top: 20px; text-align: center;"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

// 定义 props
const props = defineProps({
  modelValue: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  pageSizes: { type: Array, default: () => [5, 10, 20, 50] },
})

// 定义 emits
const emit = defineEmits(['update:modelValue', 'update:pageSize', 'fetch'])

// 内部状态
const innerPage = ref(props.modelValue)
const innerPageSize = ref(props.pageSize)

// 同步外部变化
watch(() => props.modelValue, (newVal) => { innerPage.value = newVal })
watch(() => props.pageSize, (newVal) => { innerPageSize.value = newVal })

// 统一事件处理
const handleChange = () => {
  emit('update:modelValue', innerPage.value)
  emit('update:pageSize', innerPageSize.value)
  emit('fetch')
}
</script>