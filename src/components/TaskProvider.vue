<template>
  <slot />
</template>

<script setup>
import { ref, provide } from 'vue'

// define a ref to store accepted tasks
const acceptedTasks = ref([])

// define a function to add accepted tasks
function addAcceptedTask(task) {
  acceptedTasks.value.push(task)
}

// provide the accepted tasks and addAcceptedTask function
provide('acceptedTasks', acceptedTasks)
provide('addAcceptedTask', addAcceptedTask)
</script>
