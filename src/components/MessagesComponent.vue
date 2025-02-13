<template>
  <!-- 整体布局，使用 Element Plus 的 Container -->
  <el-container style="height: 100vh;">
    <!-- 左侧：联系人列表 -->
    <el-aside width="240px" class="aside-bar">
      <div class="profile-section">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>

      <!-- 导航菜单（如果需要 Home、Messages 之类的主菜单） -->
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

      <!-- 联系人列表 -->
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

    <!-- 右侧：聊天窗口 -->
    <el-main class="chat-container">
      <!-- 如果还没选中联系人，可以显示提示 -->
      <div v-if="!selectedContactId" class="no-chat-selected">
        <p>Please select a contact to start chatting.</p>
      </div>

      <!-- 选中联系人后，显示聊天内容 -->
      <div v-else class="chat-content">
        <!-- 聊天顶部：显示对方姓名或标题等 -->
        <div class="chat-header">
          <h3>{{ currentContact.name }}</h3>
          <span class="chat-header-time">{{ currentTime }}</span>
        </div>

        <!-- 聊天消息列表 -->
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

        <!-- 聊天输入框 -->
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

// 模拟联系人列表
const contacts = ref([
  { id: 1, name: 'Jack' },
  { id: 2, name: 'Anny' },
  { id: 3, name: 'Mike' }
])

// 当前选中的联系人 ID
const selectedContactId = ref(null)

// 模拟存储不同联系人的聊天记录
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

// 输入的新消息
const newMessage = ref('')

// 引用消息容器，用于在发送或接收消息后滚动到底部
const chatMessagesRef = ref(null)

// 获取当前时间字符串
const currentTime = computed(() => {
  const now = new Date()
  return now.toLocaleString()
})

// 选中的联系人信息
const currentContact = computed(() => {
  return contacts.value.find(c => c.id === selectedContactId.value) || {}
})

// 当前聊天记录
const currentMessages = computed(() => {
  return messagesMap.value[selectedContactId.value] || []
})

// 切换联系人
function selectContact(contact) {
  selectedContactId.value = contact.id
  // 切换联系人后，清空输入框
  newMessage.value = ''
  // 等页面渲染后再滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 发送消息
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

// 滚动到底部
function scrollToBottom() {
  const el = chatMessagesRef.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

onMounted(() => {
  // 如果想默认选中第一个联系人，可以在这里设置
  // selectedContactId.value = contacts.value[0].id
})
</script>

<style scoped>
/* 左侧区域 */
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

/* 右侧区域 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* 没有选中联系人时的提示 */
.no-chat-selected {
  margin: auto;
  font-size: 16px;
  color: #999;
}

/* 聊天内容区 */
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 聊天顶部，显示联系人名字、时间等 */
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

/* 聊天消息列表 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
}

/* 气泡样式 */
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
  align-self: flex-end; /* 右对齐 */
  background-color: #e6f7ff;
}

.them {
  align-self: flex-start; /* 左对齐 */
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

/* 输入区 */
.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.chat-input .el-input {
  flex: 1;
}
</style>
