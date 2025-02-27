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

      <!-- Address Dialog -->
      <el-dialog v-model="addressDialogVisible" title="Choose your address" append-to-body width="600px">
        <el-tabs v-model="activeTab">
          <!-- 已有地址列表 -->
          <el-tab-pane label="Select Address" name="select">
            <div v-if="addressList.length">
              <el-card v-for="addr in addressList" :key="addr.id" class="address-card"
                @click="selectAddress(addr.address)" :class="{ selected: selectedAddress === addr.address }"
                style="margin-bottom: 10px; cursor: pointer;">
                <div @click="selectAddress(addr.address)">
                  <p><strong>Address:</strong> {{ addr.address }}</p>
                  <p>{{ addr.city }}, {{ addr.province }}, {{ addr.country }}</p>
                  <el-tag v-if="addr.is_default" type="success">Default</el-tag>
                </div>
                <div style="margin-top: 8px; text-align: right;">
                  <el-button size="mini" @click.stop="startEditing(addr)">Edit</el-button>
                  <el-button size="mini" type="danger" @click.stop="deleteAddress(addr.id)">Delete</el-button>
                </div>
              </el-card>
            </div>
            <div v-else>
              <p>No addresses found. Please add a new address.</p>
            </div>
          </el-tab-pane>
          <!-- 添加新地址 -->
          <el-tab-pane label="Add Address" name="add">
            <el-form :model="newAddress" label-width="120px" class="address-form">
              <el-form-item label="Tag">
                <el-input v-model="newAddress.tag"></el-input>
              </el-form-item>
              <el-form-item label="Country">
                <el-input v-model="newAddress.country"></el-input>
              </el-form-item>
              <el-form-item label="Province">
                <el-input v-model="newAddress.province"></el-input>
              </el-form-item>
              <el-form-item label="City">
                <el-input v-model="newAddress.city"></el-input>
              </el-form-item>
              <el-form-item label="Address">
                <el-input v-model="newAddress.address"></el-input>
              </el-form-item>
              <el-form-item label="Remark">
                <el-input v-model="newAddress.remark"></el-input>
              </el-form-item>
              <el-form-item label="Postcode">
                <el-input v-model="newAddress.postcode"></el-input>
              </el-form-item>
              <el-form-item label="Phone">
                <el-input v-model="newAddress.phone"></el-input>
              </el-form-item>
              <el-form-item label="Contact Person">
                <el-input v-model="newAddress.contact_person"></el-input>
              </el-form-item>
              <el-form-item label="Default">
                <el-switch v-model="newAddress.is_default"></el-switch>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="isEditing ? updateAddress() : addAddress()">
                  {{ isEditing ? 'Update Address' : 'Add Address' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <el-button @click="addressDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmSelectedAddress">
            Confirm
          </el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted } from 'vue'
// import defaultAvatar from '@/assets/avatar/defaultAvatar.jpeg'

import api from '@/api.js'

const router = useRouter()
const newPostContent = ref('')
const taskReward = ref(0)
const newPostImageUrl = ref('')
const fileList = ref([])


const acceptedTasks = inject('acceptedTasks', () => { })
// const addAcceptedTask = inject('addAcceptedTask', () => { })

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
])

const addressDialogVisible = ref(false)
const activeTab = ref('select')
const addressList = ref([])
const selectedAddress = ref('')
const isEditing = ref(false)
const editingAddressId = ref(null)
const newAddress = ref({
  tag: '',
  country: '',
  province: '',
  city: '',
  address: '',
  remark: '',
  postcode: '',
  phone: '',
  is_default: false,
  contact_person: ''
})

function openAddressDialog() {
  if (!newPostContent.value.trim()) {
    ElMessage.warning('Empty content')
    return
  }
  getAddressList()
  activeTab.value = 'select'
  isEditing.value = false
  editingAddressId.value = null
  addressDialogVisible.value = true
}

function getAddressList() {
  api.get('user/address/')
    .then((res) => {
      if (res.data.success) {
        addressList.value = res.data.address || res.data
      } else {
        ElMessage.error('Failed to fetch address list')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to fetch address list')
    })
}

function selectAddress(addr) {
  selectedAddress.value = addr
}

function addAddress() {
  api.post('user/address/', newAddress.value, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('Address added successfully')
        activeTab.value = 'select'
        getAddressList()
        newAddress.value = {
          tag: '',
          country: '',
          province: '',
          city: '',
          address: '',
          remark: '',
          postcode: '',
          phone: '',
          is_default: false,
          contact_person: ''
        }
      } else {
        ElMessage.error(res.data.message || 'Failed to add address')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to add address')
    })
}

function startEditing(addr) {
  newAddress.value = { ...addr }
  isEditing.value = true
  editingAddressId.value = addr.id
  activeTab.value = 'add'
}

function confirmSelectedAddress() {
  if (!selectedAddress.value) {
    ElMessage.warning('Please select an address')
    return
  }
  addressDialogVisible.value = false
  handlePost(selectedAddress.value)
}

function updateAddress() {
  if (!editingAddressId.value) {
    ElMessage.error('No address ID found')
    return
  }
  api.patch(`user/address/${editingAddressId.value}/`, newAddress.value, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (res.data.success) {
        ElMessage.success('Address updated successfully')
        activeTab.value = 'select'
        getAddressList()
        resetNewAddressForm()
        isEditing.value = false
        editingAddressId.value = null
      } else {
        ElMessage.error(res.data.message || 'Failed to update address')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to update address')
    })
}

function deleteAddress(addrId) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this address?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      type: 'warning'
    }
  )
    .then(() => {
      api.delete(`user/address/${addrId}/`)
        .then((res) => {
          if (res.data.success) {
            ElMessage.success('Address deleted successfully')
            getAddressList()
          } else {
            ElMessage.error(res.data.message || 'Failed to delete address')
          }
        })
        .catch((err) => {
          console.error(err)
          ElMessage.error('Failed to delete address')
        })
    })
    .catch(() => {
    })
}

function handlePost(address) {

  const publishTime = new Date().toISOString()

  const payload = {
    destination: {
      id: 0,
      tag: '',
      country: '',
      province: '',
      city: '',
      address: address,
      remark: '',
      postcode: '',
      contact_person: '',
      country_code: '',
      phone: '',
      is_default: true,
      user_id: 0
    },
    description: newPostContent.value,
    commission: taskReward.value,
    status: 1,
    user_id: 0,
    image_ids: newPostImageUrl.value ? [parseInt(newPostImageUrl.value) || 0] : [],
    publish_time: publishTime
  }
  api.post('order/', payload, {
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

function handlePictureCardPreview(file) {
  console.log("Preview file:", file)
}

function resetForm() {
  newPostContent.value = ''
  newPostImageUrl.value = ''
  fileList.value = []
}

function resetNewAddressForm() {
  newAddress.value = {
    tag: '',
    country: '',
    province: '',
    city: '',
    address: '',
    remark: '',
    postcode: '',
    phone: '',
    is_default: false,
    contact_person: ''
  }
  selectedAddress.value = ''
}

function handleAccpet(post) {
  api.get('order/')
    .then((res) => {
      if (res.data && res.data.success) {
        ElMessage.success('Task accepted')
        acceptedTasks(post)
      } else {
        ElMessage.error('Failed to accept task')
      }
    })
    .catch(err => {
      console.error('Failed to accept task', err)
      ElMessage.error('Failed to accept task')
    })
}


onMounted(() => {
  // api.get('order/')
  //   .then((res) => {
  //     posts.value = res.data
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //     ElMessage.error('Failed to fetch tasks')
  //   })
})



</script>

<style scoped>
@import '../assets/HomeLayout.css';
</style>
