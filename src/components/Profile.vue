<template>
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
</script>
