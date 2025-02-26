<template>

  <el-container style="height:100vh">

    <el-aside width="240px" class="aside-bar">

      <div class="profile-section" @click="goToProfile" style="cursor: pointer;">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>

      <el-menu default-active="home" router>
        <el-menu-item index="/"
          style="width: 200px; font-size: large;font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
          <el-icon style="margin-right:30px">
            <House />
          </el-icon>
          <span>Home</span>
        </el-menu-item>

        <el-menu-item index="messages"
          style="width: 200px; font-size: large;font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
          <el-icon style="margin-right:30px">
            <ChatDotRound />
          </el-icon>
          <span>Messages</span>
        </el-menu-item>

      </el-menu>

      <div class="logout-section">
        <el-button type="danger" @click="handleLogout">Log out</el-button>
      </div>
    </el-aside>
    <el-scrollbar class="scrollbar">
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-scrollbar>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('user')
  router.push({ name: 'Login' })
}

function goToProfile() {
  router.push('/profile')
}
</script>

<style scoped>
@import '../assets/MainLayout.css';
</style>