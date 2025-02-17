<template>
  <!-- Post Box -->
  <el-container class="main-content">
    <div class="post-box">
      <el-input type="textarea" placeholder="What's happening?" v-model="newPostContent"
        :autosize="{ minRows: 1, maxRows: 4 }" style="width: 100%;" />
      <div class="post-actions">
        <el-button type="primary" @click="handlePost">Post</el-button>
      </div>
    </div>

    <!-- Post List -->
    <div class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-header">
          <el-avatar :size="40" :src="post.user.avatar" style="margin-right: 10px;" />
          <div class="post-user">
            <strong>{{ post.user.name }}</strong>
            <span class="post-time">{{ post.time }}</span>
          </div>
        </div>

        <!-- Content of the post -->
        <div class="post-content">
          <p>{{ post.content }}</p>
          <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
        </div>

        <div class="post-footer">
          <el-button size="small">Contact Now</el-button>
          <el-button size="small" type="success">Accept</el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const newPostContent = ref('')
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
  }
])

function handlePost() {
  if (newPostContent.value.trim()) {
    posts.value.unshift({
      id: Date.now(),
      user: { name: 'TOM', avatar: 'https://via.placeholder.com/40' },
      time: 'now',
      content: newPostContent.value
    })
    newPostContent.value = ''
  }
}

</script>

<style scoped>
.profile-section {
  text-align: center;
  margin: 20px 0;
}

.profile-section p {
  margin-top: 8px;
  font-weight: bold;
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post-box {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.post-actions {
  text-align: right;
  margin-top: 8px;
}

.post-list {
  width: 100%;
  max-width: 600px;
}

.post-item {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
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
