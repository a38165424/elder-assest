<template>
  <div class="container mt-5">
    <h1 class="text-center">Rate Our Service</h1>
    <form @submit.prevent="submitRating">
      <div class="mb-3">
        <label for="rating" class="form-label">Rating (1 to 5)</label>
        <input
          type="number"
          class="form-control"
          id="rating"
          min="1"
          max="5"
          v-model="rating"
        />
        <div v-if="errors.rating" class="text-danger">{{ errors.rating }}</div>
      </div>
      <div class="mb-3">
        <label for="comment" class="form-label">Your Comment</label>
        <textarea
          class="form-control"
          id="comment"
          rows="3"
          v-model="comment"
        ></textarea>
        <div v-if="errors.comment" class="text-danger">{{ errors.comment }}</div>
      </div>
      <div class="text-center">
        <button type="submit" class="btn btn-primary">Submit Rating</button>
      </div>
    </form>

    <!-- 显示平均评分 -->
    <div v-if="averageRating !== null" class="mt-4 text-center">
      <h4>Average Rating: {{ averageRating }}</h4>
    </div>

    <!-- 显示所有用户的评分 -->
    <div v-if="ratings.length > 0" class="mt-4">
      <h4>User Ratings:</h4>
      <ul>
        <li v-for="(userRating, index) in ratings" :key="index">
          <strong>{{ userRating.username }}</strong> (Rating:
          {{ userRating.rating }}): {{ userRating.comment }}
        </li>
      </ul>
    </div>

    <!-- Admin Only: 清除所有评分按钮 -->
    <div v-if="isAdmin" class="text-center mt-4">
      <button @click="clearAllRatings" class="btn btn-danger">Clear All Ratings</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 当前用户角色
const isAdmin = ref(false);

// 获取当前登录的用户名
const username = ref('');

// 评分和评论
const rating = ref(null);
const comment = ref('');

// 存储所有评分
const ratings = ref([]);

// 表单错误信息
const errors = ref({
  rating: null,
  comment: null,
});

// 计算平均评分
const averageRating = computed(() => {
  if (ratings.value.length === 0) return null;
  const sum = ratings.value.reduce(
    (total, userRating) => total + userRating.rating,
    0
  );
  return (sum / ratings.value.length).toFixed(2);
});

// 表单验证函数
const validateForm = () => {
  let isValid = true;

  if (rating.value === null || rating.value < 1 || rating.value > 5) {
    errors.value.rating = 'Rating must be between 1 and 5';
    isValid = false;
  } else {
    errors.value.rating = null;
  }

  if (!comment.value.trim()) {
    errors.value.comment = 'Comment is required';
    isValid = false;
  } else {
    errors.value.comment = null;
  }

  if (!username.value) {
    alert('User is not logged in. Please log in to submit a rating.');
    isValid = false;
  }

  return isValid;
};

// 提交评分
const submitRating = () => {
  if (!validateForm()) {
    return;
  }

  const newRating = {
    username: username.value,
    rating: parseFloat(rating.value),
    comment: comment.value.trim(),
  };

  ratings.value.push(newRating);

  // 保存评分到 localStorage
  localStorage.setItem('ratings', JSON.stringify(ratings.value));

  alert('Thank you for your rating!');
  clearForm();
};

// 清除所有评分
const clearAllRatings = () => {
  // 清除 localStorage 中的所有评分记录
  localStorage.removeItem('ratings');
  ratings.value = [];
  alert('All ratings have been cleared.');
};

// 清除表单
const clearForm = () => {
  rating.value = null;
  comment.value = '';
};

// 组件加载时执行
onMounted(() => {
  // 获取当前登录的用户名
  const storedUsername = localStorage.getItem('loggedInUser');
  if (storedUsername) {
    username.value = storedUsername;
  } else {
    alert('No user is currently logged in.');
  }

  // 获取当前用户角色
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Admin') {
    isAdmin.value = true;
  }

  // 获取已存在的评分数据
  const storedRatings = localStorage.getItem('ratings');
  if (storedRatings) {
    ratings.value = JSON.parse(storedRatings);
  }
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
}

input,
textarea {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.btn-primary {
  background-color: #275fda;
}

button.btn-primary:hover {
  background-color: #1e4bb5;
}

button.btn-danger {
  background-color: #d9534f;
}

button.btn-danger:hover {
  background-color: #c9302c;
}

.text-center {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}
</style>
