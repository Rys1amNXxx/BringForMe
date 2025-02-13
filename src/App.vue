<template>
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
</template>

<script>
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
</style>