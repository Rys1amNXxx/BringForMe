<template>
  <el-container class="message-page-container">
    <!-- 主内容区域 -->
    <el-main class="chat-container">
      <!-- 如果没有选中联系人，就显示提示 -->
      <div v-if="!selectedContactId" class="no-chat-selected">
        <p>Please select a contact to start chatting.</p>
      </div>
      <!-- 否则显示聊天窗口 -->
      <div v-else class="chat-content">
        <div class="chat-header">
          <h3 class="currentContactName">{{ currentContact.nickname }}</h3>
          <span class="chat-header-time">{{ currentTime }}</span>
        </div>
        <el-scrollbar ref="scrollbarRef" class="chat-messages">
          <div class="chat-messages" ref="chatMessagesRef">
            <div v-for="msg in currentMessages" :key="msg.id"
              :class="['chat-bubble', msg.sender === 'me' ? 'me' : 'them']">
              <div class="chat-text">{{ msg.content }}</div>
              <div class="chat-time">{{ msg.created_at }}</div>
            </div>
          </div>
        </el-scrollbar>
        <div class="chat-input">
          <el-input type="textarea" v-model="newMessage" resize="none" placeholder="Type your message..."
            @keyup.enter="sendMessage" />
          <el-button type="primary" @click="sendMessage">Send</el-button>
        </div>
      </div>
    </el-main>

    <!-- 侧边栏联系人列表 -->
    <el-aside class="contact-selection">
      <div class="optional-header">
        <h3 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Contacts</h3>
      </div>
      <div class="contact-list">
        <div v-for="contact in contacts" :key="contact.id"
          :class="['contact-item', contact.id === selectedContactId ? 'active' : '']" @click="selectContact(contact)">
          <!-- 若后端无 avatar 字段，可给个默认图片 -->
          <el-avatar :size="40" :src="contact.avatar || defaultAvatar" />
          <span>{{ contact.nickname }}</span>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import defaultAvatar from '@/assets/avatar/defaultAvatar.jpeg'
import { inject } from 'vue'

const userStore = inject('user')

const currentUserId = userStore.profile.id
// const currentUserNickname = userStore.profile.nickname

const route = useRoute()

// contacts
const contacts = ref([])
// store messages by contact id
const messagesMap = ref({})

// current selected contact id
const selectedContactId = ref(null)
const newMessage = ref('')
const chatMessagesRef = ref(null)
// const validContacts = computed(() => {
//   return contacts.value.filter(c => c.id && c.nickname)
// })

// current time
const currentTime = ref(new Date().toLocaleString())
let timer = setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// 默认头像，如后端无 avatar 字段则使用
// const defaultAvatar = defaultAvatar

// calculate current contact
const currentContact = computed(() => {
  return contacts.value.find(c => c.id === selectedContactId.value) || {}
})

const currentMessages = computed(() => {
  return messagesMap.value[selectedContactId.value] || []
})

// choose contact
function selectContact(contact) {
  selectedContactId.value = contact.id
  newMessage.value = ''
  fetchMessages(contact.id)
  nextTick(() => {
    scrollToBottom()
  })
}

// send message
function sendMessage() {
  if (!newMessage.value.trim() || !selectedContactId.value) return

  api.post(`message/receiver/${selectedContactId.value}/`, {
    content: newMessage.value.trim()
  })
    .then(res => {
      const responseData = res.data
      // if messagesMap[selectedContactId] is not an array, initialize it
      if (!Array.isArray(messagesMap.value[selectedContactId.value])) {
        messagesMap.value[selectedContactId.value] = []
      }
      // if response is ok and data is an array
      if (responseData.status === 'ok' && Array.isArray(responseData.data)) {
        responseData.data.forEach(msg => {
          // const originalSender = msg.sender
          const isMe = (msg.sender === currentUserId)
          msg.sender = isMe ? 'me' : 'them'
          // console.log('Original sender:', originalSender,
          //     '| currentUser:', currentUserNickname,
          //     '=> mapped to:', msg.sender)
          // msg.sender = msg.sender === currentUser ? 'me' : 'them'
          // console.log('Server sender:', msg.sender, ' | currentUser:', currentUser)
          messagesMap.value[selectedContactId.value].push(msg)
        })
      } else {
        console.warn('Unexpected response structure:', responseData)
      }
      // clear input and scroll to bottom
      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
      })
    })
    .catch(error => {
      console.error('Error sending message:', error)
    })
}

// scroll to bottom
function scrollToBottom() {
  const el = chatMessagesRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

// fetch messages
function fetchMessages(receiverId) {
  api.get(`message/receiver/${receiverId}/`)
    .then(response => {
      const { data, status } = response.data
      if (status === 'ok' && Array.isArray(data)) {
        data.forEach(msg => {
          // console.log('Original sender:', msg.sender)
          msg.sender = (msg.sender === currentUserId) ? 'me' : 'them'
        })
        messagesMap.value[receiverId] = data
      } else {
        messagesMap.value[receiverId] = []
      }
      nextTick(() => {
        scrollToBottom()
      })
    })
    .catch(error => {
      console.error('Error fetching messages:', error)
    })
}

// fetch contacts
async function fetchContacts() {
  try {
    const response = await api.get('message/receiver/')
    const fetchedContacts = response.data.data || []
    contacts.value = fetchedContacts

    const userCache = {}
    const promises = contacts.value.map(async (contact) => {
      // if userCache[contact.id] is not set, fetch user profile
      if (!userCache[contact.id]) {
        const userRes = await api.get(`user/profile/${contact.id}/`)
        console.log('User profile:', userRes.data)
        userCache[contact.id] = userRes.data.data
      }
      // set contact avatar
      contact.avatar = userCache[contact.id].avatar || null
    })

    // wait for all promises to resolve
    await Promise.all(promises)

    // when contacts are fetched, select the first one
    if (contacts.value.length > 0 && !selectedContactId.value) {
      selectedContactId.value = contacts.value[0].id
      fetchMessages(selectedContactId.value)
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
  }
}

onMounted(() => {
  // console.log('Injected userStore:', userStore)
  fetchContacts().then(() => {
    if (route.query.newContact) {
      try {
        const newContact = JSON.parse(route.query.newContact)
        newContact.id = Number(newContact.id)
        if (newContact.id && newContact.nickname) {
          // if new contact is not in contacts, add it
          if (!contacts.value.find(c => c.id === newContact.id)) {
            contacts.value.push(newContact)
          }
          // select new contact
          selectedContactId.value = newContact.id
          fetchMessages(newContact.id)
        } else {
          console.warn('Error new contact', newContact)
        }
      } catch (e) {
        console.error('路由参数 newContact 格式错误:', e)
      }
    }
  })
})
// clear timer when component is unmounted
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>


<style scoped>
@import '../assets/MessagesComponent.css';
</style>
