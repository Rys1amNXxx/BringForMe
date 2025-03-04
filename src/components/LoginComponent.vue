<template>
  <div class="login-container">
    <div class="logo-section">
      <img src="@/assets/runner-icon.png" alt="Runner" class="runner-icon" />
      <h1 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Bring For Me</h1>
      <img src="@/assets/shopping-bag-icon.png" alt="Shopping Bag" class="bag-icon" />
    </div>

    <el-card class="login-card">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item label="Username" prop="username">
          <el-input v-model="loginForm.username" placeholder="Enter your username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="Password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
        <div style="text-align: center; margin-top: 10px;">
          Not a member?
          <router-link to="/register">Register Now!</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { parseJwt } from '@/utils/jwt.js'
import api from '../api.js'
import { userStore } from '../store/user.js'

const router = useRouter()
const loginFormRef = ref(null)
const loginForm = ref({
  username: '',
  password: ''
})
const rules = {
  username: [{ required: true, message: 'Please input your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input your password', trigger: 'blur' }]
}

function refreshToken() {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (!storedRefreshToken) {
    console.error('No refresh token available.')
    return
  }
  api.post('user/token/refresh/', { refresh: storedRefreshToken })
    .then((res) => {
      // 假设后端返回 { access: '...', refresh: '...' }
      if (res.data.access) {
        localStorage.setItem('accessToken', res.data.access)
        if (res.data.refresh) {
          localStorage.setItem('refreshToken', res.data.refresh)
        }
        console.log('Token refreshed successfully')
      } else {
        console.error('Token refresh failed')
      }
    })
    .catch((err) => {
      console.error('Error during token refresh:', err)
    })
}

async function handleLogin() {
  // 使用 validate 回调进行表单校验
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 登录接口：获取 access 与 refresh token
      const res = await api.post(
        'user/token/',
        {
          username: loginForm.value.username,
          password: loginForm.value.password
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      
      const accessToken = res.data.access
      if (accessToken) {
        // 存储 Token
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', res.data.refresh)
        ElMessage.success('Login successful')

        // 解析 JWT，获取 payload（例如 user_id 等信息）
        const payload = parseJwt(accessToken)
        if (payload && payload.user_id) {
          localStorage.setItem('userId', payload.user_id)
        }
        
        // 每5分钟刷新一次 Token
        setInterval(refreshToken, 1000 * 60 * 5)

        // 获取用户资料
        // const userId = localStorage.getItem('userId')
        const profileRes = await api.get(`user/profile/`)
        const userInfo = profileRes.data.data
        userStore.profile = userInfo
        // userStore.profile = profileRes.data.data || profileRes.data
        localStorage.setItem('userProfile', JSON.stringify(userInfo))
        
        // 跳转到主页
        router.push('/').then(() => {
          console.log('Redirected to home page successfully')
        }).catch((err) => {
          console.error('Failed to redirect:', err)
        })
      } else {
        ElMessage.error('Login failed: No access token received')
      }
    } catch (err) {
      console.error('Login error:', err)
      ElMessage.error('An error occurred during login')
    }
  })
}
</script>

<style scoped>
@import '../assets/LoginComponent.css';
</style>
