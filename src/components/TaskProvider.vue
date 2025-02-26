<template>
  <slot />
</template>

<script setup>
import { ref, provide } from 'vue'

// 定义一个响应式的已接受任务数组
const acceptedTasks = ref([])

// 定义一个添加任务的方法
function addAcceptedTask(task) {
  acceptedTasks.value.push(task)
}

// 通过 provide 注入状态和方法，供后代组件使用
provide('acceptedTasks', acceptedTasks)
provide('addAcceptedTask', addAcceptedTask)
</script>
