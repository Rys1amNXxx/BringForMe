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

/** 生成本地消息ID，仅做示例 */
// function generateId() {
//   return Date.now().toString() + Math.random().toString(36).substr(2, 9)
// }
const userStore = inject('user')

const currentUserNickname = userStore.profile.nickname

const route = useRoute()

// 联系人列表
const contacts = ref([])
// 存储每个联系人的消息列表，key 为 contact.id
const messagesMap = ref({})

// 选中的联系人 ID
const selectedContactId = ref(null)
// 当前输入框消息
const newMessage = ref('')
// 聊天区域的 DOM 引用
const chatMessagesRef = ref(null)
// const validContacts = computed(() => {
//   return contacts.value.filter(c => c.id && c.nickname)
// })

// 当前时间，用于显示消息时间
const currentTime = ref(new Date().toLocaleString())
let timer = setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

// 默认头像，如后端无 avatar 字段则使用
// const defaultAvatar = defaultAvatar

// 计算属性：当前选中的联系人对象
const currentContact = computed(() => {
  return contacts.value.find(c => c.id === selectedContactId.value) || {}
})

// 当前选中联系人对应的消息列表
const currentMessages = computed(() => {
  return messagesMap.value[selectedContactId.value] || []
})

// 选择联系人
function selectContact(contact) {
  selectedContactId.value = contact.id
  newMessage.value = ''
  // 获取该联系人的消息
  fetchMessages(contact.id)
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 发送消息
function sendMessage() {
  if (!newMessage.value.trim() || !selectedContactId.value) return

  api.post(`message/receiver/${selectedContactId.value}/`, {
    content: newMessage.value.trim()
  })
    .then(res => {
      // 后端返回新创建的消息对象
      const responseData = res.data
      // 如果本地没有该联系人的消息数组，先初始化
      if (!Array.isArray(messagesMap.value[selectedContactId.value])) {
        messagesMap.value[selectedContactId.value] = []
      }
      // 将后端返回的新消息插入到本地消息列表
      if (responseData.status === 'ok' && Array.isArray(responseData.data)) {
        responseData.data.forEach(msg => {
          // const originalSender = msg.sender
          const isMe = (msg.sender === currentUserNickname)
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
      // 清空输入框并滚动到底部
      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
      })
    })
    .catch(error => {
      console.error('Error sending message:', error)
    })
}

// 滚动到底部
function scrollToBottom() {
  const el = chatMessagesRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

// 从后端获取指定联系人的消息
function fetchMessages(receiverId) {
  api.get(`message/receiver/${receiverId}/`)
    .then(response => {
      const { data, status } = response.data
      if (status === 'ok' && Array.isArray(data)) {
        data.forEach(msg => {
          console.log('Original sender:', msg.sender)
          msg.sender = (msg.sender === currentUserNickname) ? 'me' : 'them'
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

// 从后端获取联系人列表
function fetchContacts() {
  return api.get('message/receiver/')
    .then(response => {
      const fetchedContacts = response.data.data || []
      contacts.value = fetchedContacts
      // 默认选中第一个联系人
      if (contacts.value.length > 0 && !selectedContactId.value) {
        selectedContactId.value = contacts.value[0].id
        fetchMessages(selectedContactId.value)
      }
    })
    .catch(error => {
      console.error('Error fetching contacts:', error)
    })
}

// 组件挂载时
onMounted(() => {
  // console.log('Injected userStore:', userStore)
  fetchContacts().then(() => {
    if (route.query.newContact) {
      try {
        const newContact = JSON.parse(route.query.newContact)
        // 检查必要字段，这里建议使用 && 而非 ||
        newContact.id = Number(newContact.id)
        if (newContact.id || newContact.nickname) {
          // 如果列表中没有该联系人，则添加
          if (!contacts.value.find(c => c.id === newContact.id)) {
            contacts.value.push(newContact)
          }
          // 将新联系人设为选中状态并获取消息
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
// 组件卸载时清除 timer
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>


<style scoped>
@import '../assets/MessagesComponent.css';
</style>
