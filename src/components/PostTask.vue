<template>
  <el-card class="post-task-card" shadow="hover">
    <h2>PostTask</h2>
    <el-form :model="taskForm" ref="taskFormRef">
      <el-form-item label="Task Title">
        <el-input v-model="taskForm.title" placeholder= "Task Title" required></el-input>
      </el-form-item>
      <el-form-item label="Task Description">
        <el-input type="textarea" v-model="taskForm.description" placeholder="Enter your task description..." required></el-input>
      </el-form-item>
      <el-form-item label="Reward">
        <el-input-number v-model="taskForm.reward" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="postTask">Post</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'

const taskForm = reactive({
  title: '',
  description: '',
  reward: 0
})

const taskFormRef = ref(null)

function postTask() {
  console.log("Task Post: ", taskForm.title, taskForm.description, taskForm.reward)
  taskForm.title = ''
  taskForm.description = ''
  taskForm.reward = 0
}
</script>

<style scoped>
.post-task-card {
  margin: 20px;
}
</style>
