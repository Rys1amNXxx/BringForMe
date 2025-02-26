<template>
  <div class="profile-page">
    <h2>Profile Page</h2>
    <p>Here is your personal info...</p>

    <!-- 用户信息展示 -->
    <div v-if="user" class="user-info">
      <!-- 头像上传 -->
      <div class="avatar-section">
        <el-avatar :size="100" :src="user.avatar" class="avatar" />
        <el-upload action="https://your-upload-endpoint.com/upload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <el-button type="primary">Change Avatar</el-button>
        </el-upload>
      </div>

      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <el-button @click="isEditing = true">Edit Profile</el-button>
      <el-button @click="isEditingPassword = true">Change Password</el-button>
      <el-button type="danger" @click="handleLogout">Logout</el-button>
    </div>
    <p v-else>No user data found.</p>

    <!-- 编辑用户信息的弹窗 -->
    <el-dialog v-model="isEditing" title="Edit Profile">
      <el-form :model="editForm">
        <el-form-item label="Name">
          <el-input v-model="editForm.name" />
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
    <div class="address-section">
      <h3>Address</h3>
      <p><strong>Current Address:</strong> {{ user.address || 'No address provided' }}</p>
      <el-button @click="isEditingAddress = true">Edit Address</el-button>
    </div>

    <!-- 编辑地址的弹窗 -->
    <el-dialog v-model="isEditingAddress" title="Edit Address">
      <el-form :model="addressForm">
        <el-form-item label="Address">
          <el-input v-model="addressForm.address" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditingAddress = false">Cancel</el-button>
        <el-button type="primary" @click="saveAddress">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 用户信息
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://via.placeholder.com/100',
  address: '123 Main St, New York, USA'
})

// 编辑状态
const isEditing = ref(false)
const isEditingPassword = ref(false)
const isEditingAddress = ref(false)

// 编辑表单数据
const editForm = ref({
  name: '',
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

// 页面加载时从 localStorage 获取用户信息
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    editForm.value = { ...user.value }
    addressForm.value.address = user.value.address || ''
  }
})

// 保存编辑后的用户信息
function saveProfile() {
  user.value = { ...editForm.value }
  localStorage.setItem('user', JSON.stringify(user.value))
  isEditing.value = false
  ElMessage.success('Profile updated successfully!')
}

// 保存修改后的密码
function savePassword() {
  // 这里可以添加密码修改的逻辑，例如调用 API
  ElMessage.success('Password updated successfully!')
  isEditingPassword.value = false
}

// 保存修改后的地址
function saveAddress() {
  user.value.address = addressForm.value.address
  localStorage.setItem('user', JSON.stringify(user.value))
  isEditingAddress.value = false
  ElMessage.success('Address updated successfully!')
}

// 退出登录
function handleLogout() {
  localStorage.removeItem('user')
  router.push('/login')
}

// 头像上传成功
function handleAvatarSuccess(response) {
  user.value.avatar = response.url // 假设服务器返回头像 URL
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
.profile-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  /* 增大字体 */
}

.user-info {
  margin-top: 20px;
}

.user-info p {
  margin: 10px 0;
  font-size: 18px;
  /* 增大字体 */
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  border: 2px solid #ddd;
}

.address-section {
  margin-top: 30px;
}

.address-section h3 {
  font-size: 20px;
  /* 增大字体 */
}

.el-button {
  margin-top: 20px;
  margin-right: 10px;
  font-size: 16px;
  /* 增大字体 */
}
</style>
