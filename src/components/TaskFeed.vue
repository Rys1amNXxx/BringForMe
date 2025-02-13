<!-- <template>
  <div>
    <h2>TaskList</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <router-link :to="'/task/'+task.id">View</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const task = ref([])

onMounted(() => {
  task.value = [
    {id: 1, title: 'Bring me some', description: 'I need some item from Lidl'},
    {id: 2, title: 'Package Delivery', description: 'I need a package delivered to my house'},
  ]
})
</script> -->

<template>
  <el-card class="task-list-card" shadow="hover">
    <h2>Task List</h2>
    <div v-for="task in tasks" :key="task.id" style="margin-bottom: 15px;">
      <el-card>
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <router-link :to="'/tasks/' + task.id">View Details</router-link>
      </el-card>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tasks = ref([])

onMounted(() => {
  tasks.value = [
    { id: 1, title: 'Bring me something.', description: 'Please bring me something from Lidl.' },
    { id: 2, title: 'Package Delivery', description: 'I need a package delivered to my house.' },
  ]
})
</script>

<style scoped>
.task-list-card {
  margin: 20px;
}
</style>
