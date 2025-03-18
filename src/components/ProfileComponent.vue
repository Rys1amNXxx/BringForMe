<template>
  <div class="profile-page">
    <h2 style="font-weight: bold">Profile Page</h2>
    <p>Here is your personal info...</p>

    <!-- user Profile -->
    <div v-if="user && Object.keys(user).length" class="user-info">
      <!-- upload avatar -->
      <div class="avatar-section">
        <el-avatar :size="100" :src="user.profile.avatar || default_avatar" class="avatar" />
        <el-upload 
        :http-request="uploadAvatar"
        :show-file-list="false" 
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload" 
        :headers="uploadHeaders"
        name="avatar"
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

    <!-- edit profile dialog -->
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

    <!-- change password dialog -->
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

// fetch user data from App.vue provide
const user = inject('user')
if (!user) {
  console.error('No user data found. Please check App.vue provide setup.')
}

const router = useRouter()

// upload avatar headers
const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
}

// edit profile form data
const isEditing = ref(false)
const isEditingPassword = ref(false)
const editForm = ref({
  nickname: '',
  email: ''
})
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

// init edit form data
onMounted(() => {
  if (user && user.profile) {
    editForm.value.nickname = user.profile.nickname || ''
    editForm.value.email = user.profile.email || ''
  }
})



// save edited profile
async function saveProfile() {
  try {
    const updateData = {
      nickname: editForm.value.nickname,
      email: editForm.value.email
    }
    await api.patch('/user/profile/', updateData)
    // update user profile data
    const response = await api.get('/user/profile/')
    const updatedProfile = response.data
    Object.assign(user.profile, updatedProfile)
    localStorage.setItem('user', JSON.stringify(user))
    isEditing.value = false
    ElMessage.success('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    ElMessage.error('Failed to update profile.')
  }
}

// save password
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

// logout function
function handleLogout() {
  localStorage.removeItem('user')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  router.push({ name: 'Login' })
}

// handle avatar upload success
function handleAvatarSuccess(response) {
  if (response.status === 'ok' && response.data && response.data.length) {
    const avatarUrl = response.data[0].image;
    // update avatar
    api.patch('user/profile/', { avatar: avatarUrl })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          user.avatar = avatarUrl;
          localStorage.setItem('userProfile', JSON.stringify(user));
          ElMessage.success('Avatar updated successfully!');
        } else {
          ElMessage.error('Failed to update avatar.');
        }
      })
      .catch((error) => {
        console.error(error);
        ElMessage.error('Failed to update avatar.');
      });
  } else {
    ElMessage.error('Failed to upload avatar.');
  }
}

// before avatar upload
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