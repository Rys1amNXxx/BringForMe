<template>
  <el-container class="message-page-container">

    <el-main class="chat-container">
      <div v-if="!selectedContactId" class="no-chat-selected">
        <p>Please select a contact to start chatting.</p>
      </div>
      <div v-else class="chat-content">
        <div class="chat-header">
          <h3>{{ currentContact.name }}</h3>
          <span class="chat-header-time">{{ currentTime }}</span>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <div
            v-for="(msg, index) in currentMessages"
            :key="index"
            :class="['chat-bubble', msg.sender === 'me' ? 'me' : 'them']"
          >
            <div class="chat-text">{{ msg.text }}</div>
            <div class="chat-time">{{ msg.time }}</div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            type="textarea"
            v-model="newMessage"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
          ></el-input>
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
          @click="selectContact(contact)"
        >
          <el-avatar :size="40" :src="contact.avatar" />
          <span>{{ contact.name }}</span>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

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
</script>

<style scoped>
.message-page-container {
  position: relative;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
}
.chat-container {
  flex: 1;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  margin-right: 300px;
  overflow-y: auto;
  width: 100%;
}
.no-chat-selected {
  text-align: center;
  margin:auto;
  font-size: 16px;
  color: #999;
}
.chat-content {
  width: 100%;
  flex:  1;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-header-time {
  font-size: 14px;
  color: #999;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
}
.chat-bubble {
  max-width: 80%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  line-height: 1.4;
  display: inline-block;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.me {
  align-self: flex-end;
  background-color: #e6f7ff;
}
.them {
  align-self: flex-start;
  background-color: #f2f2f2;
}
.chat-text {
  margin-bottom: 5px;
}
.chat-time {
  font-size: 12px;
  color: #999;
  text-align: right;
}
.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.chat-input .el-input {
  flex: 1;
}

.contact-selection {
  position: fixed;
  right: 80px;
  top: 0;
  width: 250px;
  height: 100vh;
  background-color: #fafafa;
  border-left: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}
.optional-header {
  text-align: center;
  margin-bottom: 10px;
}
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.contact-item:hover {
  background-color: #e6f7ff;
}
.contact-item.active {
  background-color: #cbe6ff;
}
</style>
