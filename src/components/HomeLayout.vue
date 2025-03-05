<template>
  <!-- Post Box -->
  <el-scrollbar class="scrollbar">
    <el-container class="main-content">
      <div class="post-box">
        <el-input type="textarea" resize="none" placeholder="What's happening?" v-model="newPostContent"
          :autosize="{ minRows: 1, maxRows: 4 }" style="width: 100%;" />
        <div class="reward-box">
          <span class="rewardLabel">Order Reward(￡):</span>
          <el-input-number v-model="taskReward" :min="0" :step="1" placeholder="Enter reward" class="rewardInput" />
        </div>
        <!-- 图片上传 -->
        <el-upload 
        class="picture-upload" 
        v-model:file-list="fileList" 
        action="/api/v1/media-manager/image/"
        list-type="picture" 
        :on-preview="handlePictureCardPreview" 
        :on-remove="handleUploadRemove"
        :on-success="handleUploadSuccess" 
        :headers="uploadHeaders"
        :multiple="true"
        :limit="4"
        name="images"
        >
          <el-button type="primary">Upload</el-button>
          <!-- <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template> -->
        </el-upload>
        <!-- Post Actions -->
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
              <el-card v-for="addr in addressList" :key="addr.id" class="address-card" @click="selectAddress(addr)"
                :class="{ selected: selectedAddress && selectedAddress.id === addr.id }"
                style="margin-bottom: 10px; cursor: pointer;">
                <div>
                  <p><strong>Address:</strong> {{ addr.address }}</p>
                  <p>{{ addr.city }}, {{ addr.province }}, {{ addr.country }}</p>
                  <el-tag v-if="addr.is_default" type="success">Default</el-tag>
                </div>
                <div style="margin-top: 8px; text-align: right;">
                  <el-button size="small" @click.stop="startEditing(addr)">Edit</el-button>
                  <el-button size="small" type="danger" @click.stop="deleteAddress(addr.id)">Delete</el-button>
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
              <el-form-item label="Country Code">
                <el-input v-model="newAddress.country_code"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="isEditing ? updateAddress() : addAddress()">
                  {{ isEditing ? "Update Address" : "Add Address" }}
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

      <!-- Post List (适配新的 OrderModel 数据结构) -->
      <div class="post-list">
        <!-- 这里的 posts 是在 onMounted 时从后端获取的 order 列表 -->
        <div v-for="order in orders" :key="order.id" class="post-item">
          <div class="post-header">
            <!-- 使用默认头像 -->
            <el-avatar :size="40" :src="order.avatar || defaultAvatar" style="margin-right: 10px;" />
            <div class="post-user">
              <!-- 以前 post.user.name 改为 order.user_id 或其它字段 -->
              <p class="postUserNickname">{{ order.nickname }}</p>
              <!-- 以前 post.time 改为 order.created_at 或 updated_at -->
              <p class="post-time">Created: {{ order.created_at }}</p>
            </div>
          </div>

          <!-- Content of the post (适配新的字段) -->
          <div class="post-content">
            <!-- 原先 post.content 改为 order.description -->
            <p>{{ order.description }}</p>

            <!-- 如果后端返回 image_urls 数组，遍历展示所有图片 -->
            <div v-if="order.image_urls && order.image_urls.length">
              <div v-for="(imgUrl, idx) in order.image_urls" :key="idx" class="image-wrapper">
                <img :src="getFullUrl(imgUrl)" alt="Order Image" class="post-image" />
              </div>
            </div>

            <!-- 如果有 destination 对象，显示地址信息 -->
            <div v-if="order.destination">
              <span class="displayAddress">Address: {{ order.destination.address }}</span>
              <!-- 你也可以进一步展示 city, province, etc. -->
            </div>

            <!-- 原先 post.reward 改为 order.commission -->
            <div class="post-reward">
              <el-tag type="success">Reward: ￡{{ order.commission }}</el-tag>
            </div>
          </div>

          <div class="post-footer">
            <template v-if="order.user_id !== currentUserId">
              <el-button size="small" type="primary" @click="contactNow(order)">Contact Now</el-button>
              <el-button size="small" type="success" @click="handleAccept(order)">Accept</el-button>
            </template>
          </div>
        </div>
      </div>
    </el-container>
  </el-scrollbar>
</template>

<script setup>
import { onBeforeUnmount, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api.js'
import defaultAvatar from '@/assets/avatar/defaultAvatar.jpeg'
import _ from 'lodash'
const currentUserId = parseInt(localStorage.getItem('userId') || '0', 10)
const backendBaseUrl = 'http://localhost:8000'

// 上传头（如果你有全局拦截器，el-upload 默认不会走拦截器，需手动添加）
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
}

const router = useRouter()
const newPostContent = ref('')
const taskReward = ref(0)
// const newPostImageUrl = ref('')
const fileList = ref([])
// const newPostImageUrls = ref([])
const newPostImageIds = ref([])

// const user_id = localStorage.getItem('user_id') || 1 // 或从后端获取



const orders = ref([])
const publishedTasks = ref([])
const acceptedTasks = ref([])


const newOrder = ref({
  destination: {
    tag: '',
    country: '',
    province: '',
    city: '',
    address: '',
    remark: '',
    postcode: '',
    contact_person: '',
    country_code: '',
    phone: ''
  },
  description: '',
  commission: 0,
  acceptor: null,  // 或者 0
  images: []
})

// 地址弹窗
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
  country_code: '',
  phone: '',
  is_default: false,
  contact_person: ''
})

function getFullUrl(relativePath) {
    // 如果后端直接返回 '/media/xxx.png'，就拼接一下
    return backendBaseUrl + relativePath
  }

// 打开地址弹窗
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

import axios from 'axios'
const CancelToken = axios.CancelToken
let cancelFetchOrders = null

async function fetchOrders() {
  try {
    const res = await api.get('order/',{
      cancelToken: new CancelToken(c => {
        cancelFetchOrders = c
      })
    })
    const allOrders = res.data.data || []
    orders.value = allOrders

    // 使用缓存避免重复请求
    const userCache = {}

    // 遍历订单，对每个订单获取发布者信息（如果没获取过）
    const promises = orders.value.map(async (order) => {
      const uid = order.user_id
      if (!userCache[uid]) {
        // 请求该发布者信息
        const userRes = await api.get(`user/profile/${uid}/`)
        // 假设后端返回结构为 { status: 'ok', data: { nickname: ..., avatar: ... } }
        userCache[uid] = userRes.data.data
      }
      // 合并用户资料到订单中
      order.nickname = userCache[uid].nickname
      order.avatar = userCache[uid].avatar
    })

    // 等待所有用户信息请求完成
    await Promise.all(promises)
    publishedTasks.value = orders.value.filter(order => order.user_id === currentUserId)
    acceptedTasks.value = orders.value.filter(order => order.acceptor === currentUserId && order.status === 1)
    console.log('Orders with publisher info:', orders.value)
  } catch (err) {
    console.error('Failed to fetch orders:', err)
    ElMessage.error('Failed to fetch orders')
  }
}

// 获取地址列表
function getAddressList() {
  // 假设 user_id 为 1 或实际获取
  api.get(`user/address/`)
    .then((res) => {
      console.log('Address response:', res.data)
      addressList.value = res.data.status === 'ok' ? res.data.data : []
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to fetch address list')
    })
}

// 选择地址
function selectAddress(addr) {
  selectedAddress.value = addr
}

// 新增地址
function addAddress() {
  api.post(`user/address/`, newAddress.value, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        ElMessage.success('Address added successfully')
        activeTab.value = 'select'
        getAddressList()
        resetNewAddressForm()
      } else {
        ElMessage.error(res.data.message || 'Failed to add address')
      }
    })
    .catch((err) => {
      console.error(err.response?.data)
      ElMessage.error('Failed to add address')
    })
}

// 编辑地址
function startEditing(addr) {
  newAddress.value = { ...addr }
  isEditing.value = true
  editingAddressId.value = addr.id
  activeTab.value = 'add'
}

// 确认所选地址并发起任务发布
function confirmSelectedAddress() {
  if (!selectedAddress.value) {
    ElMessage.warning('Please select an address')
    return
  }
  addressDialogVisible.value = false
  createOrderWithSelectedAddress()
}

function createOrderWithSelectedAddress() {
  // 把选中的地址对象合并到 newOrder.destination
  newOrder.value.destination = {
    tag: selectedAddress.value.tag,
    country: selectedAddress.value.country,
    province: selectedAddress.value.province,
    city: selectedAddress.value.city,
    address: selectedAddress.value.address,
    remark: selectedAddress.value.remark,
    postcode: selectedAddress.value.postcode,
    contact_person: selectedAddress.value.contact_person,
    country_code: selectedAddress.value.country_code,
    phone: selectedAddress.value.phone
  }
  // 赋值描述与奖励
  newOrder.value.description = newPostContent.value
  newOrder.value.commission = taskReward.value
  // 如果上传成功返回的是图片 URL，则放到 images 数组中
  newOrder.value.images = newPostImageIds.value

  // 发起请求创建订单
  api.post('order/', newOrder.value, {
    headers: { 'Content-Type': 'application/json' }
  })
    .then((res) => {
      // 具体判断逻辑看后端返回
      if (res.status >= 200 && res.status < 300) {
        ElMessage.success('Post successful')
        resetForm()
        // 刷新订单列表
        fetchOrders()
      } else {
        ElMessage.error('Failed to post')
      }
    })
    .catch((err) => {
      console.error(err)
      ElMessage.error('Failed to post')
    })
}

// 更新地址
function updateAddress() {
  if (!editingAddressId.value) {
    ElMessage.error('No address ID found')
    return
  }
  api.patch(`user/address/${editingAddressId.value}/`, newAddress.value, {
    headers: { 'Content-Type': 'application/json' }
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

// 删除地址
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
          if (res.status >= 200 && res.status < 300) {
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
      // 用户取消删除
    })
}

// 联系任务发布者
function contactNow(order) {
  const newContact = {
    id: order.user_id,
    nickname: order.nickname,
    avatar: defaultAvatar
  }
  router.push({
    name: 'Messages',
    query: { newContact: JSON.stringify(newContact) }
  })
}

// 接受任务
async function handleAccept(order) {
  try {
    const currentUserId = parseInt(localStorage.getItem('userId') || '0', 10)
    const payload = {
      status: 1,  // 1 表示 Order Accepted
      acceptor: currentUserId
    }
    const res = await api.patch(`order/${order.id}/`, payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.data.status === 'ok') {
      ElMessage.success('Task accepted successfully')
      refreshTasks()
    } else {
      ElMessage.error(res.data.message || 'Failed to accept task')
    }
  } catch (err) {
    console.error('Failed to accept task:', err)
    ElMessage.error('Failed to accept task')
  }
}

async function refreshTasks() {
  try {
    const res = await api.get('order/')
    const allOrders = res.data.data || []
    orders.value = allOrders

    // 利用缓存获取发布者信息（与 fetchOrders 中相同逻辑）
    const userCache = {}
    const promises = orders.value.map(async (order) => {
      const uid = order.user_id
      if (!userCache[uid]) {
        const userRes = await api.get(`user/profile/${uid}/`)
        userCache[uid] = userRes.data.data
      }
      order.nickname = userCache[uid].nickname
      order.avatar = userCache[uid].avatar
    })
    await Promise.all(promises)

    publishedTasks.value = orders.value.filter(order => order.user_id === currentUserId)
    acceptedTasks.value = orders.value.filter(order => order.acceptor === currentUserId && order.status === 1)
  } catch (err) {
    console.error('Failed to refresh tasks:', err)
  }
}

// 图片上传成功
// eslint-disable-next-line no-unused-vars
function handleUploadSuccess(response, _file, _fileListRef) {
  console.log('Upload success:', response)
  if (response.status === 'ok' && response.data && response.data.length) {
    const {id} = response.data[0]
    newPostImageIds.value.push(id)
    console.log('Collected image IDs:', newPostImageIds.value)
  } else {
    ElMessage.error('Upload failed')
  }
}

// 图片移除
// eslint-disable-next-line no-unused-vars
function handleUploadRemove(file, _fileListRef) {
  console.log('Remove file:', file)
  if (file.response && file.response.data && file.response.data.length) {
    const imageId = file.response.data[0].id
    const index = newPostImageIds.value.indexOf(imageId)
    if (index !== -1) {
      newPostImageIds.value.splice(index, 1)
    }
  }
}

// 预览图片
function handlePictureCardPreview(file) {
  console.log('Preview file:', file)
}

// 重置表单
function resetForm() {
  newPostContent.value = ''
  // newPostImageUrl 不再使用，可忽略
  fileList.value = []
  newPostImageIds.value = []  // 清空已收集的图片 ID
}

// 重置新地址表单
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
  selectedAddress.value = null
}

const throttleFetchOrders = _.throttle(fetchOrders, 60000)

let pollingTimer = null
// 组件挂载时获取最新订单列表
onMounted(() => {
  fetchOrders()
  pollingTimer = setInterval(() => {
    throttleFetchOrders()
  }, 60000)
})

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (pollingTimer) clearInterval(pollingTimer)
  if (cancelFetchOrders) cancelFetchOrders('Component unmounted, canceling request.')
})
</script>


<style scoped>
@import '../assets/HomeLayout.css';
</style>
