<!-- src/components/TaskLayout.vue used for the layout of the task page -->
<template>
  <TaskProvider>
    <router-view />
  </TaskProvider>
</template>

<script setup>

import TaskProvider from '@/components/TaskProvider.vue'
</script>
