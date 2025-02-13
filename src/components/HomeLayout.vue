<template>
  <el-container class="home-layout" style="height: 100vh;">
    <!-- 左侧导航 -->
    <el-aside width="240px" class="aside-bar">
      <!-- 用户信息区 -->
      <div class="profile-section">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        router
      >
        <el-menu-item index="1">
          <el-icon style="margin-right: 8px;">
            <i class="el-icon-house"></i>
          </el-icon>
          <span>Home</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon style="margin-right: 8px;">
            <i class="el-icon-message"></i>
          </el-icon>
          <span>Messages</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <!-- 顶部发帖区 -->
      <el-header height="auto" class="header-bar">
        <div class="post-box">
          <el-input
            type="textarea"
            placeholder="What's happening?"
            v-model="newPostContent"
            :autosize="{ minRows: 1, maxRows: 4 }"
            style="width: 100%;"
          />
          <div class="post-actions">
            <el-button type="primary" @click="handlePost">Post</el-button>
          </div>
        </div>
      </el-header>

      <!-- 帖子列表区 -->
      <el-main class="post-list">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-item"
        >
          <!-- 帖子头部：头像、用户名、时间 -->
          <div class="post-header">
            <el-avatar
              :size="40"
              :src="post.user.avatar"
              style="margin-right: 10px;"
            />
            <div class="post-user">
              <strong>{{ post.user.name }}</strong>
              <span class="post-time">{{ post.time }}</span>
            </div>
          </div>

          <!-- 帖子内容：文字 + 图片（可选） -->
          <div class="post-content">
            <p>{{ post.content }}</p>
            <img
              v-if="post.image"
              :src="post.image"
              alt="Post Image"
              class="post-image"
            />
          </div>

          <!-- 帖子操作按钮 -->
          <div class="post-footer">
            <el-button size="small">Contact Now</el-button>
            <el-button size="small" type="success">Accept</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

// 模拟发帖内容
const newPostContent = ref('')

// 模拟帖子数据
const posts = ref([
  {
    id: 1,
    user: { name: 'Name', avatar: 'https://via.placeholder.com/40' },
    time: '1m',
    content: 'Help! Can someone bring this for me from Lidl?',
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    user: { name: 'Name', avatar: 'https://via.placeholder.com/40' },
    time: '29m',
    content: 'Just another post to show how it looks without an image.'
    // image: ''  // 没有图片
  }
])

function handlePost() {
  if (newPostContent.value.trim()) {
    // 这里可以调用后端接口，或本地 push 一条新的帖子
    posts.value.unshift({
      id: Date.now(),
      user: { name: 'TOM', avatar: 'https://via.placeholder.com/40' },
      time: 'now',
      content: newPostContent.value,
      image: ''
    })
    newPostContent.value = ''
  }
}
</script>

<style scoped>
.home-layout {
  /* 确保父容器 100vh, 填满页面 */
  width: 100%;
  margin: 0;
  padding: 0;
}

.aside-bar {
  background-color: #f8f8f8;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-section {
  text-align: center;
  margin: 20px 0;
}

.profile-section p {
  margin-top: 8px;
  font-weight: bold;
}

/* 顶部发帖区 */
.header-bar {
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 10px;
}

.post-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.post-actions {
  text-align: right;
}

/* 帖子列表 */
.post-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐，可按需调整 */
}

.post-item {
  width: 100%;
  max-width: 600px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #fff;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-user {
  display: flex;
  flex-direction: column;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-content {
  margin-bottom: 10px;
}

.post-image {
  max-width: 100%;
  margin-top: 10px;
  border: 1px solid #ddd;
}

.post-footer {
  display: flex;
  gap: 10px;
}
</style>
