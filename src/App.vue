<template>
  <router-view />
</template>

<script setup>
import { ref, provide } from 'vue';

const user = ref({
  user_id: 1,
  nickname: 'Tom',
  email: '',
  avatar: '',
  address: '123 Main St, New York, USA'
})

provide('user', user);

// export default {
//   name: 'App',
//   components: {
//     TaskProvider,
//   },
// }
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
