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
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="loginForm.email" placeholder="Enter your e-mail"></el-input>
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
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Please input your email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input your password', trigger: 'blur' }
  ]
}

const loginFormRef = ref(null)

function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      if (loginForm.value.email === 'admin' && loginForm.value.password === 'admin') {
        ElMessage.success('Login successful')
        localStorage.setItem('user', JSON.stringify({ email: loginForm.value.email }))
        router.push('/')
      } else {
        axios.post('http://localhost:8000/api/user/login', {
          email: loginForm.value.email,
          password: loginForm.value.password
        },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
          .then(response => {
            const status = response.data.status
            if (status === 'success') {
              const token = response.data.data.token
              localStorage.setItem('token', token)
              ElMessage.success('Login successful')
              // localStorage.setItem('user', JSON.stringify({ email: loginForm.value.email }))
              router.push('/')
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
