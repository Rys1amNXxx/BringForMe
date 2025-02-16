<template>
  <el-countainer style="height:100vh">
    <el-aside width="240px" class="aside-bar">
      <div class="profile-section">
        <el-avatar :size="60" src="https://via.placeholder.com/60" />
        <p>TOM</p>
      </div>

      <el-menu default-active="home" router>
        <el-menu-item index="home">
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

      <el-menu-item index="profile">
        <el-icon style="margin-right: 8px;">
          <i class="el-icon-user"></i>
        </el-icon> 
        <router-link to="/profile" style="color: inherit;">Profile</router-link>
      </el-menu-item>
      </el-menu>

      <div class="logout-section">
        <el-button type="danger" @click="handleLogout">Log out</el-button>
      </div>
    </el-aside>

    <el-menu class="main-content">
      <router-view />
    </el-menu>
  </el-countainer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('user')
  router.push({name: 'Login'})
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
}

.main-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>