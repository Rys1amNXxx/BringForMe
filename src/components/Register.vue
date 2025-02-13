<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label>E-mail:</label>
        <input type="email" v-model="email" placeholder="Enter your e-mail" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p>Already a member? <router-link to="/login">Login Now!</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function register(){
  console.log("Register: ", email.value, password.value)
  router.push('/login')
}
</script>

<style scoped>
form div{
  margin-bottom: 1rem;
}
</style>