<template>
  <div class="profile-page">
    <h2 style="font-weight: bold">Profile Page</h2>
    <p>Here is your personal info...</p>

    <!-- 用户信息展示 -->
    <div v-if="user && Object.keys(user).length" class="user-info">
      <!-- 头像上传 -->
      <div class="avatar-section">
        <el-avatar :size="100" :src="user.avatar || default_avatar" class="avatar" />
        <el-upload
          action="/api/v1/media_manager/image/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
        >
          <el-button type="primary">Change Avatar</el-button>
        </el-upload>
      </div>

      <p><strong>Nickname:</strong> {{ user.profile.nickname }}</p>
      <p><strong>Email:</strong> {{ user.profile.email }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import default_avatar from '@/assets/avatar/defaultAvatar.jpeg'
import api from '@/api.js'
import { parseJwt } from '@/utils/jwt.js'  // 如果需要解析Token的工具函数

// 获取全局用户状态（例如在 App.vue 中通过 provide('user', userStore) 提供）
const user = inject('user')

// 如果 user 不存在，建议报错或设置默认值
if (!user) {
  console.error('No user data found. Please check App.vue provide setup.')
}

const router = useRouter()

// 上传头（el-upload不走 axios 拦截器）
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
}

// 编辑状态
const isEditing = ref(false)
const isEditingPassword = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
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

// 编辑表单数据
const editForm = ref({
  nickname: '',
  email: ''
})

// 页面加载时初始化编辑表单数据
onMounted(() => {
  // 假设全局 user 已经在登录时通过 profile 接口更新到全局状态
  if (user && user.nickname) {
    editForm.value.nickname = user.nickname
    editForm.value.email = user.email
  }
})

// 保存编辑后的用户信息
async function saveProfile() {
  try {
    const updateData = {
      nickname: editForm.value.nickname,
      email: editForm.value.email
    }
    const response = await api.patch(`/user/${user.id}/profile/`, updateData, {
      headers: { 'Content-Type': 'application/json' }
    })
    // 假设后端返回更新后的数据在 response.data.data 中
    const updatedProfile = response.data.data || response.data
    Object.assign(user, updatedProfile)
    localStorage.setItem('user', JSON.stringify(user))
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
    await api.patch(`/user/${user.id}/password/`, passwordData, {
      headers: { 'Content-Type': 'application/json' }
    })
    ElMessage.success('Password updated successfully!')
    isEditingPassword.value = false
    passwordForm.value.oldPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  } catch (error) {
    console.error('Failed to update password:', error)
    ElMessage.error('Failed to update password.')
  }
}

// 退出登录
function handleLogout() {
  localStorage.removeItem('user')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  router.push({ name: 'Login' })
}

// 头像上传成功回调
function handleAvatarSuccess(response) {
  // 假设服务器返回头像 URL 在 response.url
  user.avatar = response.url
  localStorage.setItem('user', JSON.stringify(user))
  ElMessage.success('Avatar updated successfully!')
}

// 头像上传前验证
function beforeAvatarUpload(file) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Avatar must be an image!')
  }
  return isImage
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
}
.user-info {
  margin-top: 20px;
}
.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
</style>


<style scoped>
@import '../assets/ProfileComponent.css';
</style>