<template>
  <el-container style="height:100vh">

    <el-aside width="240px" class="aside-bar">

      <div class="profile-section" @click="goToProfile" style="cursor: pointer;">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>

      <el-menu default-active="home" router>
        <el-menu-item index="/">
          <el-icon style="margin-right:8px">
            <i class="el-icon-house"></i>
          </el-icon>
          <router-link to="/" style="color: inherit;">Home</router-link>
        </el-menu-item>

        <el-menu-item index="messages">
        <el-icon style="margin-right: 8px;">
          <i class="el-icon-message"></i>
        </el-icon>
        <router-link to="/messages" style="color: inherit;">Messages</router-link>
      </el-menu-item>

      </el-menu>

      <div class="logout-section">
        <el-button type="danger" @click="handleLogout">Log out</el-button>
      </div>
    </el-aside>

    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('user')
  router.push({name: 'Login'})
}

function goToProfile() {
  router.push('/profile')
}
</script>

<style scoped>

.aside-bar {
  background-color: #f8f8f8;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.profile-section {
  text-align: center;
  margin: 20px 0;
}

.profile-section p {
  margin-top: 8px;
  font-weight: bold;
}

.logout-section {
  margin-top: auto;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  width: 20px;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
}

</style>