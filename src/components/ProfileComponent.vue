<template>
  <el-card class="profile-card" shadow="hover">
    <h2>Profile</h2>
    <p>Welcome, {{ user.name }}</p>
    <el-menu>
      <el-menu-item>
        <router-link to="/tasks">My Tasks</router-link>
      </el-menu-item>
      <el-menu-item>
        <router-link to="/messages">Messages</router-link>
      </el-menu-item>
    </el-menu>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({ name: 'Tom' })
</script>

<style scoped>
.profile-card {
  margin: 20px;
}
</style>

