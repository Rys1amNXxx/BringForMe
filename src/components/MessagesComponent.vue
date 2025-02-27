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
          <div
            v-for="msg in currentMessages"
            :key="msg.id"
            :class="['chat-bubble', msg.sender === 'me' ? 'me' : 'them']">
            <div class="chat-text">{{ msg.text }}</div>
            <div class="chat-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            type="textarea"
            v-model="newMessage"
            resize="none"
            placeholder="Type your message..."
            @keyup.enter="sendMessage">
          </el-input>
          <el-button type="primary" @click="sendMessage">Send</el-button>
        </div>
      </div>
    </el-main>

    <el-aside class="contact-selection">
      <div class="optional-header">
        <h3 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Contacts</h3>
      </div>
      <div class="contact-list">
        <div
          v-for="contact in contacts"
          :key="contact.id"
          :class="['contact-item', contact.id === selectedContactId ? 'active' : '']"
          @click="selectContact(contact)">
          <el-avatar :size="40" :src="contact.avatar" />
          <span>{{ contact.name }}</span>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

const route = useRoute()
const contacts = ref([])
const messagesMap = ref({})

const selectedContactId = ref(null)
const newMessage = ref('')
const chatMessagesRef = ref(null)

const currentTime = ref(new Date().toLocaleString())
let timer = setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

const currentContact = computed(() => {
  return contacts.value.find(c => c.id === selectedContactId.value) || {}
})
const currentMessages = computed(() => {
  return messagesMap.value[selectedContactId.value] || []
})

function selectContact(contact) {
  selectedContactId.value = contact.id
  newMessage.value = ''
  fetchMessages(contact.id)
  nextTick(() => {
    scrollToBottom()
  })
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedContactId.value) return
  const msgObj = {
    id: generateId(),
    sender: 'me',
    text: newMessage.value.trim(),
    time: currentTime.value
  }
  if (!messagesMap.value[selectedContactId.value]) {
    messagesMap.value[selectedContactId.value] = []
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

function fetchMessages(receiver_id){
  api.get(`message/receiver/${receiver_id}/`)
  .then(response => {
    messagesMap.value[receiver_id] = response.data
    nextTick(() => {
      scrollToBottom()
    })
  })
  .catch(error => {
    console.error('Error fetching messages:', error)
  })
}

// 从后端接口获取联系人列表
function fetchContacts() {
  api.get('message/receiver/')
    .then(response => {
      const fetchedContacts = response.data
      contacts.value = fetchedContacts
      // 默认选择第一个联系人
      if (contacts.value.length > 0 && !selectedContactId.value) {
        selectedContactId.value = contacts.value[0].id
        fetchMessages(selectedContactId.value)
      }
    })
    .catch(error => {
      console.error('Error fetching contacts:', error)
    })
}

onMounted(() => {
  fetchContacts()

  if (route.query.newContact) {
    try {
      const newContact = JSON.parse(route.query.newContact)
      if (!contacts.value.find(c => c.id === newContact.id)) {
        contacts.value.push(newContact)
        messagesMap.value[newContact.id] = []
      }
    } catch (e) {
      console.error('Invalid newContact query parameter.', e)
    }
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>


<style scoped>
@import '../assets/MessagesComponent.css';
</style>
