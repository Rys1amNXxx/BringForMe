<template>
  <div class="profile-page">
    <h2 style="font-weight: bold">Profile Page</h2>
    <p>Here is your personal info...</p>

    <!-- 用户信息展示 -->
    <div v-if="user" class="user-info">
      <!-- 头像上传 -->
      <div class="avatar-section">
        <el-avatar :size="100" :src="user.avatar || default_avatar" class="avatar" />
        <el-upload action="https://your-upload-endpoint.com/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <el-button type="primary">Change Avatar</el-button>
        </el-upload>
      </div>


      <p><strong>Nickname:</strong> {{ user.nickname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <el-button @click="isEditing = true">Edit Profile</el-button>
      <el-button @click="isEditingPassword = true">Change Password</el-button>
      <el-button type="danger" @click="handleLogout">Logout</el-button>
    </div>
    <p v-else>No user data found.</p>

    <!-- 编辑用户信息的弹窗 -->
    <el-dialog v-model="isEditing" title="Edit Profile">
      <el-form :model="editForm">
        <el-form-item label="Nickname">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditing = false">Cancel</el-button>
        <el-button type="primary" @click="saveProfile">Save</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码的弹窗 -->
    <el-dialog v-model="isEditingPassword" title="Change Password">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="Old Password" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" />
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
        <el-form-item label="Confirm New Password" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditingPassword = false">Cancel</el-button>
        <el-button type="primary" @click="savePassword">Save</el-button>
      </template>
    </el-dialog>

    <!-- Address 界面 -->
    <!-- <div class="address-section">
      <h3>Address</h3>
      <p><strong>Current Address:</strong> {{ user.address || 'No address provided' }}</p>
      <el-button @click="isEditingAddress = true">Edit Address</el-button>
    </div> -->

    <!-- 编辑地址的弹窗 -->
    <!-- <el-dialog v-model="isEditingAddress" title="Edit Address">
      <el-form :model="addressForm">
        <el-form-item label="Address">
          <el-input v-model="addressForm.address" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditingAddress = false">Cancel</el-button>
        <el-button type="primary" @click="saveAddress">Save</el-button>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import defaultAvatar from '../assets/avatar/defaultAvatar.jpeg'
import api from '@/api.js'

const router = useRouter()
const user_id = user.value.id
const default_avatar = defaultAvatar

// 通过 inject 获取全局用户数据（确保父组件已提供）
const user = inject('user')
if (!user) {
  console.error('No user data found.')
}

// 编辑状态
const isEditing = ref(false)
const isEditingPassword = ref(false)
// const isEditingAddress = ref(false)


// 编辑表单数据，字段统一为 nickname 和 email
const editForm = ref({
  nickname: '',
  email: ''
})

// 密码表单数据
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 地址表单数据
const addressForm = ref({
  address: ''
})

// 密码验证规则
const passwordRules = {
  oldPassword: [{ required: true, message: 'Please input old password', trigger: 'blur' }],
  newPassword: [{ required: true, message: 'Please input new password', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: 'Please confirm new password', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

async function fetchUserProfile() {
  try {
    const response = await api.get(`/user/${user_id}/profile/`)
    const data = response.data
    user.value = { ...user.value, ...data }
    editForm.value = {
      nickname: user.value.nickname,
      email: user.value.email
    }
    addressForm.value.address = user.value.address || ''
    localStorage.setItem('user', JSON.stringify(user.value))
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    ElMessage.error('Failed to fetch user profile.')
  }
}

// 页面加载时从 localStorage 获取用户信息（如果存在）
onMounted(() => {
  fetchUserProfile()
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    // 合并已有的全局用户数据，避免覆盖其他字段
    user.value = { ...user.value, ...JSON.parse(storedUser) }
    // 初始化编辑表单，确保字段名称一致
    editForm.value = {
      nickname: user.value.nickname,
      email: user.value.email
    }
    addressForm.value.address = user.value.address || ''
  }
})

// 保存编辑后的用户信息
async function saveProfile() {
  try {
    const updateData = {
      nickname: editForm.value.nickname,
      email: editForm.value.email
    }
    const response = await api.patch(`/user/${user_id}/profile/`, updateData)
    user.value = { ...user.value, ...response.data }
    localStorage.setItem('user', JSON.stringify(user.value))
    isEditing.value = false
    ElMessage.success('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    ElMessage.error('Failed to update profile.')
  }
}

// 保存修改后的密码
async function savePassword() {
  try {
    const passwordData = {
      old_password: passwordForm.value.oldPassword,
      new_password: passwordForm.value.newPassword,
      confirm_new_password: passwordForm.value.confirmPassword
    }
    await api.patch(`/user/${user_id}/password/`, passwordData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    ElMessage.success('Password updated successfully!')
    isEditingPassword.value = false
    // 清空密码表单
    passwordForm.value.oldPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  } catch (error) {
    console.error('Failed to update password:', error)
    ElMessage.error('Failed to update password.')
  }
}

// 保存修改后的地址
// function saveAddress() {
//   user.value.address = addressForm.value.address
//   localStorage.setItem('user', JSON.stringify(user.value))
//   isEditingAddress.value = false
//   ElMessage.success('Address updated successfully!')
// }

// 退出登录
function handleLogout() {
  localStorage.removeItem('user')
  router.push('/login')
}

//头像上传成功回调
function handleAvatarSuccess(response) {
  user.value.avatar = response.url // 假设服务器返回头像 URL
  localStorage.setItem('user', JSON.stringify(user.value))
  ElMessage.success('Avatar updated successfully!')
}

// 头像上传前的验证
function beforeAvatarUpload(file) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Avatar must be an image!')
  }
  return isImage
}

</script>

<style scoped>
@import '../assets/ProfileComponent.css';
</style>