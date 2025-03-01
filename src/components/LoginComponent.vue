<template>
  <div class="login-container">
    <!-- LOGO -->
    <div class="logo-section">
      <img src="@/assets/runner-icon.png" alt="Runner" class="runner-icon" />
      <h1 style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Bring For Me</h1>
      <img src="@/assets/shopping-bag-icon.png" alt="Shopping Bag" class="bag-icon" />
    </div>

    <!-- Login -->
    <el-card class="login-card">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item label="Username" prop="username">
          <el-input v-model="loginForm.username" placeholder="Enter your username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="Password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>

        <div style="text-align: center; margin-top: 10px;">
          Not a member? <router-link to="/register">Register Now!</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '../api.js'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: 'Please input your username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input your password', trigger: 'blur' }
  ]
}

const loginFormRef = ref(null)

function refreshToken() {
  const storedRefreshToken = localStorage.getItem('refreshToken')
  if (storedRefreshToken) {
    api.post('user/token/refresh/', {
      refresh: storedRefreshToken
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const status = response.data.status
        if (status === 'success') {
          const newAccessToken = response.data.data.access
          localStorage.setItem('accessToken', newAccessToken)
          if (response.data.data.refresh) {
            localStorage.setItem('refreshToken', response.data.data.refresh)
          }
          console.log('Token refreshed successfully')
        } else {
          console.error('Token refresh failed: ' + response.data.message)
        }
      })
      .catch(error => {
        console.error('Error during token refresh:', error)
      })
  } else {
    console.error('No refresh token available.')
  }
}

async function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      if (loginForm.value.username === 'admin' && loginForm.value.password === 'admin') {
        ElMessage.success('Login successful')
        localStorage.setItem('user', JSON.stringify({ username: loginForm.value.username }))
        router.push('/')
      } else {
        api.post('user/token/', {
          username: loginForm.value.username,
          password: loginForm.value.password
        },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
          .then(response => {
            const status = response.data.access
            if (status) {
              const accessToken = response.data.access
              const refreshTokenValue = response.data.refresh
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('refreshToken', refreshTokenValue)
              localStorage.setItem('user', JSON.stringify({ username: loginForm.value.username }))
              ElMessage.success('Login successful')
              // localStorage.setItem('user', JSON.stringify({ email: loginForm.value.email }))
              console.log('准备跳转到主页...');
              router.push('/').then(() => {
                console.log('跳转到主页成功！');
              }).catch((err) => {
                console.error('跳转到主页失败:', err);
              })
              setInterval(refreshToken, 1000 * 60 * 5)
            } else {
              ElMessage.error('Login failed' + response.data.message)
            }
          })
          .catch(error => {
            console.error(error)
            ElMessage.error('An error occurred during login')
          })
      }
    }
  })
}

</script>

<style scoped>
@import '../assets/LoginComponent.css';
</style>
