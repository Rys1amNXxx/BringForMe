<template>
  <div class="login-container">
    <!-- LOGO -->
    <div class="logo-section">
      <img src="@/assets/runner-icon.png" alt="Runner" class="runner-icon" />
      <h1>Bring For Me</h1>
      <img src="@/assets/shopping-bag-icon.png" alt="Shopping Bag" class="bag-icon" />
    </div>

    <!-- Login -->
    <el-card class="login-card">
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item label="Email" prop="email">
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
      console.log('Logging in with:', loginForm.value)
      localStorage.setItem('user', JSON.stringify({ email: loginForm.value.email }))
      router.push('/')
    }
  })
}

// function goToSignUp() {
//   router.push('/register')
// }
// </script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.runner-icon,
.bag-icon {
  width: 50px;
  height: 50px;
}

.runner-icon {
  margin-right: 10px;
}

.bag-icon {
  margin-left: 10px;
}

.login-card {
  width: 400px;
  /* 卡片宽度，可自行调整 */
  text-align: center;
  /* 让表单文字居中 */
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
