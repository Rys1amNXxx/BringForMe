<template>
  <el-container style="min-height: 100vh; width: 200%;">
    <el-header style="background: #409eff; color: #fff; display: flex; justify-content: space-between; align-items: center; ">
      <div style="font-size: 24px; font-weight: bold;">Bring For Me</div>
      <el-menu mode="horizontal" :default-active="$route.name" background-color="transparent" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="HomePage">
          <router-link style="color:inherit;" to="/">Home</router-link>
        </el-menu-item>
        <el-menu-item index="Profile">
          <router-link style="color: inherit;" to="/profile">Profile</router-link>
        </el-menu-item>
        <el-menu-item index="Messages">
          <router-link style="color: inherit;" to="/messages">Messages</router-link>
        </el-menu-item>
        <el-menu-item index="Login">
          <router-link style="color: inherit;" to="/login">Login</router-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'App',
}
</script>

