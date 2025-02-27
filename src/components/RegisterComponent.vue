<template>
  <div class="register-container">

    <div class="logo-section">
      <img src="@/assets/runner-icon.png" alt="Runner" class="runner-icon" />
      <h1 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Bring For Me</h1>
      <img src="@/assets/shopping-bag-icon.png" alt="Shopping Bag" class="bag-icon" />
    </div>

    <el-card class="register-card">
      <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
        <el-form-item label="Username" prop="username">
          <el-input v-model="registerForm.username" placeholder="Enter your username"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="registerForm.email" placeholder="Enter your e-mail"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword"
            palceholder="Please confirm your password"></el-input>
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="registerForm.nickname" placeholder="Please enter your nickname"></el-input>
        </el-form-item>
        <el-form-item label="Phone Number" prop="phoneNumber">
          <el-input v-model="registerForm.phoneNumber" placeholder="Please enter your phone number"></el-input>
        </el-form-item>
        <el-form-item label="First Name">
          <el-input v-model="registerForm.firstname" placeholder="Enter your first name"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="registerForm.lastname" placeholder="Enter your last name"></el-input>
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
import { ElMessage } from 'element-plus'
import api from '@/api.js'

const router = useRouter()
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  phoneNumber: '',
  firstname: '',
  lastname: ''
})

const registerFormRef = ref(null)

const rules = {
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your e-mail', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid e-mail', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== registerForm.password) {
          return Promise.reject(new Error('Passwords do not match'))
        } else {
          return Promise.resolve()
        }
      }, trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: 'Please enter your nickname', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' }
  ]

}

function handleRegister() {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      const registrationData = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        confirm_password: registerForm.confirmPassword,
        nickname: registerForm.nickname,
        phone: registerForm.phoneNumber,
        firs_tname: registerForm.firstname,
        last_name: registerForm.lastname
      }
      api.post('user/register/', registrationData
        , {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          if (res.data.status === true) {
            console.log(res.data)
            ElMessage.success('Registration successful!')
            resetForm()
            router.push('/login')
          } else {
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

function resetForm() {
  registerForm.username = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.nickname = ''
  registerForm.phoneNumber = ''
  registerForm.firstname = ''
  registerForm.lastname = ''
}

</script>

<style scoped>
@import '../assets/RegisterComponent.css';
</style>
