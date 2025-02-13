<!-- <template>
  <div>
    <h2>HomePage</h2>
    <div class="tab-buttons">
      <button @click="activeTab='post'" :class="{active: activeTab==='post'}">Post a Task</button>
      <button @click="activeTab='feed'" :class="{active: activeTab==='feed'}">Task List</button>>
    </div>
    <div v-if="activeTab==='post'">
      <PostTask/>
    </div>
    <div v-if="activeTab==='feed'">
      <TaskFeed/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PostTask from '../components/PostTask.vue'
import TaskFeed from '../components/TaskFeed.vue'

const activeTab = ref('feed')
</script>

<style scoped>
.tab-buttons{
  margin-bottom: 1rem;
}
button{
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
}
.active{
  font-weight: bold;
  background-color: #007bff;
  color: white
}
</style> -->

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
