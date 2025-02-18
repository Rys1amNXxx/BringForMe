<template>

  <div class="profile-page">
    <h2 style="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">My Profile</h2>
    <el-card class="profile-card" shadow="hover">
      <el-form :model="userForm" ref="userFormRef" :rules="rules" label-width="100px">

        <el-form-item label="邮箱" prop="email">
      </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile-page {
  width: 100%;
  max-width: 600px;
}
</style>
