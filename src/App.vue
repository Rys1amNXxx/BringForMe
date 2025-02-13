<!-- <template>
  <div id="app">
    <header>
      <h1>BringForMe</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/profile">Profile</router-link>
        <router-link to="/messages">Messages</router-link>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>
    <main>
      <router-view/>
    </main>
    >
  </div>
</template> -->

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

<!-- <script>
import router from './router';

export default {
  name: 'App',
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
header {
  background: #f2f2f2;
  padding: 1rem;
  margin-bottom: 1rem;
}
nav {
  margin: 0 0.5rem;
  text-decoration: none;
  color: #333;
}
</style> -->

