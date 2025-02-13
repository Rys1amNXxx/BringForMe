<template>
  <div>
    <h2>PostTasks</h2>
    <form @submit.prevent="postTask">
      <div>
        <label>Title:</label>
        <input v-model="title" placeholder="Enter the title" required />
      </div>
      <div>
        <label>Description:</label>
        <textarea v-model="description" placeholder="Enter the description" required></textarea>
      </div>
      <div>
        <label>Reward</label>
        <input v-model="reward" type="number" placeholder="Enter the reward" required />
      </div>
      <button type="submit">Post Task</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const description = ref('')
const reward = ref('')

function postTask(){
  console.log("Post Task: ", title.value, description.value, reward.value)

  title.value = ''
  description.value = ''
  reward.value = 0
}
</script>

<style scoped>
form div{
  margin-bottom: 1rem;
}
</style>