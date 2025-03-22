<template>
  <el-select v-model="selectedRank" :placeholder="placeholder">
    <el-option
      v-for="(label, value) in team.rank"
      :key="value"
      :label="label"
      :value="Number(value)"
    />
  </el-select>
</template>

<script setup>
import team from '@/models/team'

defineProps({
  placeholder: { type: String, default: '请选择级别' }
})

const selectedRank = defineModel('value', { type: Number, default: 4 })

</script>