<template>
  <el-container style="height: 100vh;">
    <el-aside width="240px" class="aside-bar">

      <div class="profile-section" @click="goToProfile" style="cursor: pointer;">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>

      <el-menu default-active="2" router>
        <el-menu-item index="/">
          <el-icon style="margin-right: 8px;">
            <i class="el-icon-house"></i>
          </el-icon>
          <router-link to="/" style="color: inherit;">Home</router-link>
        </el-menu-item>
        <el-menu-item index="/messages">
          <el-icon style="margin-right: 8px;">
            <i class="el-icon-message"></i>
          </el-icon>
          <router-link to="/messages" style="color: inherit;">Messages</router-link>
        </el-menu-item>
      </el-menu>

      <div class="contact-list">
        <div
          v-for="contact in contacts"
          :key="contact.id"
          :class="['contact-item', contact.id === selectedContactId ? 'active' : '']"
          @click="selectContact(contact)"
        >
          {{ contact.name }}
        </div>
      </div>
    </el-aside>

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
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const contacts = ref([
  { id: 1, name: 'Jack' },
  { id: 2, name: 'Anny' },
  { id: 3, name: 'Mike' }
])

const selectedContactId = ref(null)
const router = useRouter()
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

const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleString()
})

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

function goToProfile() {
  router.push('/profile')
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

// Select the first contact by default(Optional)
onMounted(() => {

})
</script>

<style scoped>
.aside-bar {
  background-color: #f8f8f8;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.profile-section {
  text-align: center;
  margin: 20px 0;
}
.profile-section p {
  margin-top: 8px;
  font-weight: bold;
}

.contact-list {
  margin-top: 20px;
  width: 100%;
  padding: 0 20px;
}
.contact-item {
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.contact-item:hover {
  background-color: #e6f7ff;
}
.contact-item.active {
  background-color: #cbe6ff;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.no-chat-selected {
  margin: auto;
  font-size: 16px;
  color: #999;
}

.chat-content {
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
  max-width: 60%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  position: relative;
  line-height: 1.4;
  display: inline-block;
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
</style>
