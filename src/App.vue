<template>
  <router-view />
</template>

<script setup>
import { ref, provide,onMounted } from 'vue';

const user = ref({
  username: '',
  user_id: 0,
  nickname: '',
  email: '',
  avatar: '',
  address: ''
})

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      // 更新响应式对象
      Object.assign(user.value, parsedUser);
    } catch (e) {
      console.error('解析用户数据失败：', e);
    }
  }
});

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
