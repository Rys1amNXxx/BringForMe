<template>
  <!-- Post Box -->
  <el-container class="main-content">
    <div class="post-box">
      <el-input type="textarea" resize="none" placeholder="What's happening?" v-model="newPostContent"
        :autosize="{ minRows: 1, maxRows: 4 }" style="width: 100%;" />
      <div class="reward-box">
        <span class="rewardLabel">Task reward-box(￡):</span>
        <el-input-number v-model="taskReward" :min="0" :step="1" placeholder="Enter reward"
          class="rewardInput" />
      </div>
      <el-upload class="picture-upload" v-model:file-list="fileList" action="http://localhost:3000/api/upload"
        list-type="picture" :on-preview="handlePictureCardPreview" :on-remove="handleUploadRemove"
        :on-success="handleUploadSuccess" :headers="uploadHeaders">
        <el-button type="primary">Upload</el-button>
        <template #tip>
          <div class="el-upload__tip" style="font-size:10px;">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>


      <div class="post-actions">
        <el-button type="primary" @click="handlePost" class="postButton">Post</el-button>
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
          <el-button size="small" type="primary" @click="contactNow(post)">Contact Now</el-button>
          <el-button size="small" type="success">Accept</el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const newPostContent = ref('')
const taskReward = ref(0)
const newPostImageUrl = ref('')
const fileList = ref([])
const uploadHeaders = {
  // Authorization:'Bearer your token,' 
}
const posts = ref([
  {
    id: 1,
    user: { name: 'Name', avatar: 'https://via.placeholder.com/40' },
    time: '1m',
    content: 'Help! Can someone bring this for me from Lidl?',
    image: 'https://via.placeholder.com/300x200',
    reward: 5
  },
  {
    id: 2,
    user: { name: 'Name', avatar: 'https://via.placeholder.com/40' },
    time: '29m',
    content: 'Just another post to show how it looks without an image.',
    reward: 10
  }
])

function handlePost() {
  // if (newPostContent.value.trim()) {
  //   posts.value.unshift({
  //     id: Date.now(),
  //     user: { name: 'TOM', avatar: 'https://via.placeholder.com/40' },
  //     time: 'now',
  //     content: newPostContent.value
  //   })
  //   newPostContent.value = ''
  // }
  if (!newPostContent.value.trim()) {
    ElMessage.warning('Empty content')
    return
  }


  const postData = {
    content: newPostContent.value,
    imageUrl: newPostImageUrl.value,
    reward: taskReward.value
  }
  axios.post('http://localhost:3000/api/tasks', postData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('Task posted successfully')
        resetForm()
      } else {
        ElMessage.error(res.data.message || 'Failed to post task')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to post task')
    })
}

function contactNow(post) {
  const newContact = {
    id: Date.now(),
    name: post.user.name,
    avatar: post.user.avatar || 'https://via.placeholder.com/40'
  }

  router.push({
    name: "Messages",
    query: { newContact: JSON.stringify(newContact) }
  })
}

// eslint-disable-next-line no-unused-vars
function handleUploadSuccess(response, _file, _fileListRef) {
  console.log('Upload success:', response)
  if (response.success && response.url) {
    newPostImageUrl.value = response.url
  } else {
    ElMessage.error('Upload failed')
  }
}

// eslint-disable-next-line no-unused-vars
function handleUploadRemove(file, _fileListRef) {
  console.log('Remove file:', file)
  newPostImageUrl.value = ''
}

function resetForm() {
  newPostContent.value = ''
  newPostImageUrl.value = ''
  fileList.value = []
}
</script>

<style scoped>
.postButton {
  width: 100px;
  height: 30px;
  font-size: large;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.picture-upload {
  margin-top: 10px;
}

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
.rewardLabel {
  font-family: 'Times New Roman', Times, serif;
}
.reward-box {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.rewardInput {
  margin-left: 10px;
  width: 100px;
}
</style>
