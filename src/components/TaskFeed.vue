<template>
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
</script>