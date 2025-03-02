<template>
  <router-view />
</template>

<script setup>
import { onMounted, provide } from 'vue'
import { userStore } from '@/store/user.js'

onMounted(() => {
  const storedUserProfile = localStorage.getItem('userProfile')
  if (storedUserProfile) {
    try {
      userStore.profile = JSON.parse(storedUserProfile)
      // 将解析后的数据合并到全局状态 userStore 中
      console.log('Restored user profile:', userStore.profile)
    } catch (e) {
      console.error('解析用户数据失败：', e)
    }
  }
})

// 提供全局用户状态
provide('user', userStore)
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
