<template>
  <el-container class="message-page-container">

    <el-main class="chat-container">
      <div v-if="!selectedContactId" class="no-chat-selected">
        <p>Please select a contact to start chatting.</p>
      </div>
      <div v-else class="chat-content">
        <div class="chat-header">
          <h3 class="currentContactName">{{ currentContact.name }}</h3>
          <span class="chat-header-time">{{ currentTime }}</span>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div v-for="(msg, index) in currentMessages" :key="index"
            :class="['chat-bubble', msg.sender === 'me' ? 'me' : 'them']">
            <div class="chat-text">{{ msg.text }}</div>
            <div class="chat-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input type="textarea" v-model="newMessage" resize="none" placeholder="Type your message..."
            @keyup.enter="sendMessage"></el-input>
          <el-button type="primary" @click="sendMessage">Send</el-button>
        </div>
      </div>
    </el-main>


    <el-aside class="contact-selection">
      <div class="optional-header">
        <h3 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Contacts</h3>
      </div>
      <div class="contact-list">
        <div v-for="contact in contacts" :key="contact.id"
          :class="['contact-item', contact.id === selectedContactId ? 'active' : '']" @click="selectContact(contact)">
          <el-avatar :size="40" :src="contact.avatar" />
          <span>{{ contact.name }}</span>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const contacts = ref([
  { id: 1, name: 'Jack', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Anny', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Mike', avatar: 'https://via.placeholder.com/40' }
])

const selectedContactId = ref(null)

const messagesMap = ref({
  1: [
    {
      sender: 'them',
      text: 'I want to accept your order. Is there a time limit?',
      time: 'Jan 1, 2025, 3:00 PM'
    },
    {
      sender: 'me',
      text: 'Sure. Can you be back by 5:00 p.m.?',
      time: 'Jan 1, 2025, 3:05 PM'
    }
  ],
  2: [
    {
      sender: 'them',
      text: 'Hello, Anny!',
      time: 'Jan 2, 2025, 10:00 AM'
    }
  ],
  3: [
    {
      sender: 'them',
      text: 'Hey, Mike!',
      time: 'Jan 3, 2025, 9:00 AM'
    }
  ]
})

const newMessage = ref('')
const chatMessagesRef = ref(null)
const currentTime = computed(() => new Date().toLocaleString())
const currentContact = computed(() => {
  return contacts.value.find(c => c.id === selectedContactId.value) || {}
})
const currentMessages = computed(() => {
  return messagesMap.value[selectedContactId.value] || []
})

function selectContact(contact) {
  selectedContactId.value = contact.id
  newMessage.value = ''
  nextTick(() => {
    scrollToBottom()
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedContactId.value) return
  const msgObj = {
    sender: 'me',
    text: newMessage.value.trim(),
    time: currentTime.value
  }
  messagesMap.value[selectedContactId.value].push(msgObj)
  newMessage.value = ''
  nextTick(() => {
    scrollToBottom()
  })
}


function scrollToBottom() {
  const el = chatMessagesRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

onMounted(() => {
  selectedContactId.value = contacts.value[0].id
  if (route.query.newContact) {
    try {
      const newContact = JSON.parse(route.query.newContact)
      if (!contacts.value.find(c => c.id === newContact.id)) {
        contacts.value.push(newContact)
      }
    } catch (e) {
      console.error('Invalid newContact query parameter.', e)
    }
  }
})

</script>

<style scoped>
@import '../assets/MessagesComponent.css';
</style>
