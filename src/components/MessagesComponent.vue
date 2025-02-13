<template>
  <el-card class="chat-card" shadow="hover">
    <h2>Messages</h2>
    <div class="chat-window">
      <div v-for="(msg, index) in messages" :key="index" class="chat-message">
        <strong>{{ msg.sender }}:</strong> {{ msg.text }}
      </div>
    </div>
    <el-input v-model="newMessage" placeholder="Enter message..." @keyup.enter="sendMessage"></el-input>
    <el-button type="primary" @click="sendMessage" style="margin-top: 10px;">Send</el-button>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  { sender: 'Mike', text: 'Hello' },
  { sender: 'John', text: 'How are you?' },
])
const newMessage = ref('')

function sendMessage() {
  if (newMessage.value.trim()) {
    messages.value.push({ sender: '我', text: newMessage.value })
    newMessage.value = ''
  }
}
</script>

<style scoped>
.chat-card {
  margin: 20px;
}
.chat-window {
  border: 1px solid #dcdfe6;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.chat-message {
  margin-bottom: 5px;
}
</style>
