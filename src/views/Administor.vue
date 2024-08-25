<template>
  <div class="container mt-5">
    <h1 class="text-center">Administer Page</h1>
    <div v-if="isAdmin">
      <p>Welcome, Admin! You have full access to this page.</p>
      <!-- 添加更多管理员可以看到的内容 -->
    </div>
    <div v-else>
      <!-- 非管理员用户看到的内容 -->
      <p>You are not an admin. You do not have permission to view this content.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isAdmin = ref(false);

// 检查用户角色
const userRole = localStorage.getItem('userRole');
if (userRole === 'Admin') {
  isAdmin.value = true;
} else {
  isAdmin.value = false;
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
}
</style>
