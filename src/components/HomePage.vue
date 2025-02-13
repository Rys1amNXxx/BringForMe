<template>
  <div class="homepage">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Post" name="post">
        <PostTask />
      </el-tab-pane>
      <el-tab-pane label="Task List" name="feed">
        <TaskFeed />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PostTask from './PostTask.vue'
import TaskFeed from './TaskFeed.vue'

const activeTab = ref('feed')
</script>

<style scoped>
.homepage {
  padding: 20px;
}
</style>
