<template>
  <!-- Post Box -->
  <el-scrollbar class="scrollbar">
    <el-container class="main-content">
      <div class="post-box">
        <el-input type="textarea" resize="none" placeholder="What's happening?" v-model="newPostContent"
          :autosize="{ minRows: 1, maxRows: 4 }" style="width: 100%;" />
        <div class="reward-box">
          <span class="rewardLabel">Task reward-box(￡):</span>
          <el-input-number v-model="taskReward" :min="0" :step="1" placeholder="Enter reward" class="rewardInput" />
        </div>
        <el-upload class="picture-upload" v-model:file-list="fileList" action="http://localhost:3000/api/upload"
          list-type="picture" :on-preview="handlePictureCardPreview" :on-remove="handleUploadRemove"
          :on-success="handleUploadSuccess">
          <el-button type="primary">Upload</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>


        <div class="post-actions">
          <el-button type="primary" @click="openAddressDialog" class="postButton">Post</el-button>
        </div>
      </div>

      <el-dialog v-model="addressDialogVisible" title="Choose your address">
        <div>
          <el-input placeholder="Please input your address" v-model="selectedAddress"></el-input>
        </div>
        <template #footer>
          <el-button @click="addressDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="cofirmAddress">Confirm</el-button>
        </template>
      </el-dialog>

      <!-- Post List -->
      <div class="post-list">
        <div v-for="post in posts" :key="post.id" class="post-item">
          <div class="post-header">
            <el-avatar :size="40" :src="post.user.avatar" style="margin-right: 10px;" />
            <div class="post-user">
              <strong>{{ post.user.name }}</strong>
              <p class="post-time">{{ post.time }}</p>

            </div>
          </div>

          <!-- Content of the post -->
          <div class="post-content">
            <p>{{ post.content }}</p>
            <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
            <div v-if="post.address">
              <span class="displayAddress">Address: {{ post.address }}</span>
            </div>
            <div class="post-reward">
              <el-tag type="success">Reward: ￡{{ post.reward }}</el-tag>
            </div>
          </div>

          <div class="post-footer">
            <el-button size="small" type="primary" @click="contactNow(post)">Contact Now</el-button>
            <el-button size="small" type="success" @click="handleAccpet(post)">Accept</el-button>
          </div>
        </div>
      </div>
    </el-container>
  </el-scrollbar>
</template>

<script setup>

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'

import api from '@/api.js'

const router = useRouter()
const newPostContent = ref('')
const taskReward = ref(0)
const newPostImageUrl = ref('')
const fileList = ref([])



const acceptedTasks = inject('acceptedTasks')
const addAcceptedTask = inject('addAcceptedTask')

const posts = ref([
  {
    id: 1,
    user: { name: 'Name1', avatar: 'https://via.placeholder.com/40' },
    time: '1m',
    content: 'Help! Can someone bring this for me from Lidl?',
    image: 'https://via.placeholder.com/300x200',
    reward: 5,
    address: '1234 Elm Street, Springfield, IL'
  },
  {
    id: 2,
    user: { name: 'Name2', avatar: 'https://via.placeholder.com/40' },
    time: '29m',
    content: 'Just another post to show how it looks without an image.',
    reward: 10,
    address: '1234 Elm Street, Springfield, IL'
  },
  {
    id: 3,
    user: { name: 'Name3', avatar: 'https://via.placeholder.com/40' },
    time: '1h',
    content: 'I need help with my groceries. Can someone help me?',
    image: 'https://via.placeholder.com/300x200',
    reward: 15,
    address: '1234 Elm Street, Springfield, IL'
  }
])

const addressDialogVisible = ref(false)
const selectedAddress = ref('')

function openAddressDialog() {
  if (!newPostContent.value.trim()) {
    ElMessage.warning('Empty content')
    return
  }
  addressDialogVisible.value = true
}

function cofirmAddress() {
  addressDialogVisible.value = false
  handlePost(selectedAddress.value)
}

function handlePost(address) {

  const publishTime = new Date().toISOString()

  const postData = {
    content: newPostContent.value,
    image: newPostImageUrl.value,
    reward: taskReward.value,
    address: address,
    publishTime: publishTime
  }
    api.post('tasks', postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('Post successful')
        resetForm()
      } else {
        ElMessage.error(res.data.message || 'Failed to post')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to post')
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

function handleAccpet(post){
  api.get('order/') 
  .then((res) => {
    if(res.data && res.data.success){
      ElMessage.success('Task accepted')
      acceptedTasks(post)
    }else{
      ElMessage.error('Failed to accept task')
    }
  })
  .catch(err => {
    console.error('Failed to accept task', err)
    ElMessage.error('Failed to accept task')
  })
}

onMounted(() => {
  api.get('tasks')
    .then((res) => {
      posts.value = res.data
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to fetch tasks')
    })
})
</script>

<style scoped>
@import '../assets/HomeLayout.css';
</style>
