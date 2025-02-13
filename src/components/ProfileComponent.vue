<!-- <template>
  <div>
    <h2>Profile</h2>
    <p>Welcome, {{ user.name }}</p>
    <ul>
      <li><router-link to="/tasks">My Task</router-link></li>
      <li><router-link to="/messages">Messages</router-link></li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({ name: 'Tom' })
</script> -->

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

