<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label>E-mail:</label>
        <input type="email" v-model="email" placeholder="Enter your e-mail" required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" placeholder="Enter your password" required />
      </div>
      <button type="submit">Login</button>
    </form>
      <p>Not a member? <router-link to="/register">Register Now!</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function login(){
  console.log("Login: ", email.value, password.value)
  localStorage.setItem('user', JSON.stringify({email: email.value}))
  router.push({name: 'HomePage'})
}
</script>

<style scoped>
form div{
  margin-bottom: 1rem;
}
</style>