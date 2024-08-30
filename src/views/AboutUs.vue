<template>
  <div class="intro-container">
    <p class="intro-text">
      At ElderCare Services, we are dedicated to improving the quality of life for seniors by providing compassionate, personalized care and support that allows them to live independently and with dignity.
    </p>
  </div>
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

    <!-- Show average rate -->
    <div v-if="averageRating !== null" class="mt-4 text-center">
      <h4>Average Rating: {{ averageRating }}</h4>
    </div>

    <!-- Show all users rate -->
    <div v-if="ratings.length > 0" class="mt-4">
      <h4>User Ratings:</h4>
      <ul>
        <li v-for="(userRating, index) in ratings" :key="index">
          <strong>{{ userRating.username }}</strong> (Rating:
          {{ userRating.rating }}): {{ userRating.comment }}
        </li>
      </ul>
    </div>

    <!-- Admin Only: clear all rates -->
    <div v-if="isAdmin" class="text-center mt-4">
      <button @click="clearAllRatings" class="btn btn-danger">Clear All Ratings</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// current user role
const isAdmin = ref(false);

// get current username
const username = ref('');

const rating = ref(null);
const comment = ref('');

// store all rates
const ratings = ref([]);

// form error message
const errors = ref({
  rating: null,
  comment: null,
});

// calculate average rates
const averageRating = computed(() => {
  if (ratings.value.length === 0) return null;
  const sum = ratings.value.reduce(
    (total, userRating) => total + userRating.rating,
    0
  );
  return (sum / ratings.value.length).toFixed(2);
});

// form test function
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

// submit rate
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

  // save the rate to localStorage
  localStorage.setItem('ratings', JSON.stringify(ratings.value));

  alert('Thank you for your rating!');
  clearForm();
};

// clear all
const clearAllRatings = () => {
  // clear all the rate message in localStorage
  localStorage.removeItem('ratings');
  ratings.value = [];
  alert('All ratings have been cleared.');
};

// clear form
const clearForm = () => {
  rating.value = null;
  comment.value = '';
};

onMounted(() => {
  // get current username
  const storedUsername = localStorage.getItem('loggedInUser');
  if (storedUsername) {
    username.value = storedUsername;
  } else {
    alert('No user is currently logged in.');
  }

  // get current role
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Admin') {
    isAdmin.value = true;
  }

  // get rate exist
  const storedRatings = localStorage.getItem('ratings');
  if (storedRatings) {
    ratings.value = JSON.parse(storedRatings);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');

.intro-container {
  padding: 20px;
  background-color: #eef2f7;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  max-width: 800px; 
  margin-left: auto;
  margin-right: auto;
}

.intro-text {
  font-family: 'Lora', serif; 
  font-size: 1.2em;
  font-weight: 500;
  color: #333;
  line-height: 1.6;
  margin: 0;
  text-align: justify; 
}

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
