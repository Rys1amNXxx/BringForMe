<template>
  <div>
    <h2>Messages</h2>
    <div class="chat-window">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <strong>{{ msg.sender }}</strong>{{ msg.message }}
      </div>
    </div>
    <form class="chat-form" @submit.prevent="sendMessage">
      <input v-model="newMessage" placeholder="Enter message..." required/>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const messages = ref([
  {sender: 'Mike', message: 'Hello'},
  {sender: 'John', message: 'How are you?'},
])
const newMessage = ref('')

function sendMessage() {
  messages.value.push({sender: 'Me', message: newMessage.value})
  newMessage.value = ''
}
</script>

<style scoped>
.chat-window {
  margin: 0.5rem;
}

.chat-form {
  display: flex;
}

.chat-form input {
  flex: 1;
  padding: 0.5rem;
}

.chat-form button {
  padding: 0.5rem 1rem;
}
</style>