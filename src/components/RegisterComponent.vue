<template>
  <div class="register-container">

    <div class="logo-section">
      <img src="@/assets/runner-icon.png" alt="Runner" class="runner-icon" />
      <h1 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Bring For Me</h1>
      <img src="@/assets/shopping-bag-icon.png" alt="Shopping Bag" class="bag-icon" />
    </div>


    <el-card class="register-card">
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="registerForm.email" placeholder="Enter your e-mail"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" palceholder="Please confirm your password"></el-input>
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="Please enter your nickname"></el-input>
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
import {ElMessage} from 'element-plus'
import axios from 'axios'

const router = useRouter()
const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  nickname: ''
})

const registerFormRef = ref(null)

const rules = {
  email: [
    { required: true, message: 'Enter your e-mail', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid e-mail', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    { validator: (rule, value) => {
      if (value !== registerForm.password) {
        return Promise.reject(new Error('Passwords do not match'))
      } else {
        return Promise.resolve()
      }
    }, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: 'Please enter your nickname', trigger: 'blur' }
  ]
}

function handleRegister() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      const registrationData = {
        email: registerForm.email,
        password: registerForm.password,
        nickname: registerForm.nickname
      }
      axios.post ('http://localhost:3000/api/auth/register', registrationData)
        .then(res => {
          if(res.data.status === true){
          console.log(res.data)
          ElMessage.success('Registration successful!')
          resetForm()
          router.push('/login')
          }else{
            ElMessage.error(res.data.message || 'Registration failed!')
          }
        })
        .catch(err => {
          console.log(err)
          ElMessage.error('Registration failed!')
        })
    } else {
      console.log('submit failed!')
      return false
    }
  })
}

function resetForm(){
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.nickname = ''
}

</script>

<style scoped>
.register-container {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.register-card {
  width: 400px;
  text-align: center;
}

.runner-icon {
  margin-right: 10px;
}

.bag-icon {
  margin-left: 10px;
}

.runner-icon,
.bag-icon {
  width: 50px;
  height: 50px;
}

</style>
