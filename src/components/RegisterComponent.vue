<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 style="text-align: center;">Register</h2>
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="registerForm.email" placeholder="Enter your e-mail"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">Register</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center; margin-top: 10px;">
        Already a member? <router-link to="/login">Login Now!</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [{ required: true, message: 'Enter your e-mail', trigger: 'blur' }],
  password: [{ required: true, message: 'Enter your password', trigger: 'blur' }]
}

const registerFormRef = ref(null)

function handleRegister() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      console.log("Register:", registerForm.email, registerForm.password)
      router.push({ name: 'Login' })
    } else {
      console.log('submit failed!')
      return false
    }
  })
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.register-card {
  width: 400px;
  padding: 20px;
}
</style>
