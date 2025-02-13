<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 style="text-align: center;">Login</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="loginForm.email" placeholder="Enter your e-mail"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center; margin-top: 10px;">
        Not a member? <router-link to="/register">Register Now!</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [{ required: true, message: 'Enter your e-mail', trigger: 'blur' }],
  password: [{ required: true, message: 'Enter your password', trigger: 'blur' }]
}

const loginFormRef = ref(null)

function handleLogin() {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Login:", loginForm.email, loginForm.password)
      localStorage.setItem('user', JSON.stringify({ email: loginForm.email }))
      router.push({ name: 'HomePage' })
    } else {
      console.log('submit failed!')
      return false
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.login-card {
  width: 400px;
  padding: 20px;
}
</style>
