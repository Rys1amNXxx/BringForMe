<template>
  <router-view />
</template>

<script setup>
import { onMounted, provide, onBeforeUnmount } from 'vue'
import { userStore } from '@/store/user.js'
import api from '@/api.js'


let tokenRefreshInterval = null

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

onMounted(() => {
  const storedUserProfile = localStorage.getItem('userProfile')
  if (storedUserProfile) {
    try {
      userStore.profile = JSON.parse(storedUserProfile)
      console.log('Restored user profile:', userStore.profile)
    } catch (e) {
      console.error('解析用户数据失败：', e)
    }
  }
  provide('user', userStore)
  tokenRefreshInterval = setInterval(refreshToken, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval)
  }
})

</script>
<style>
html,
body,
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}
</style>
