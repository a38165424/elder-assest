<template>
  <section class="intro-banner">
    <p class="description">
      At ElderCare Services, our mission is to empower seniors with compassionate, personalized care that supports their independence and honors their dignity.
    </p>
  </section>
  <div class="feedback-section mt-5">
    <header class="feedback-header text-center">
      <h1>Share Your Feedback</h1>
      <p>Your insights help us improve our services.</p>
    </header>
    <form @submit.prevent="submitFeedback" class="rating-form">
      <fieldset class="rating-group">
        <legend>Rate Your Experience (1-5)</legend>
        <input
          type="number"
          class="rating-input"
          id="service-rating"
          min="1"
          max="5"
          v-model="rating"
        />
        <small v-if="errors.rating" class="error-message">{{ errors.rating }}</small>
      </fieldset>
      <fieldset class="comment-group">
        <legend>Leave a Comment</legend>
        <textarea
          class="comment-input"
          id="service-comment"
          rows="3"
          v-model="comment"
        ></textarea>
        <small v-if="errors.comment" class="error-message">{{ errors.comment }}</small>
      </fieldset>
      <div class="submit-section text-center">
        <button type="submit" class="btn-submit">Submit Feedback</button>
      </div>
    </form>

    <!-- Display the average rating if available -->
    <div v-if="averageRating !== null" class="average-rating text-center">
      <h4>Average User Rating: {{ averageRating }}</h4>
    </div>

    <!-- Display a list of user feedbacks -->
    <div v-if="ratings.length > 0" class="user-feedback-list mt-4">
      <h4>Customer Feedback:</h4>
      <ul class="feedback-list">
        <li v-for="(feedback, index) in ratings" :key="index">
          <strong>{{ feedback.username }}</strong> - Rated: {{ feedback.rating }}<br>
          Comment: {{ feedback.comment }}
        </li>
      </ul>
    </div>

    <!-- Admin-only section to clear all feedbacks -->
    <div v-if="isAdmin" class="admin-actions text-center mt-4">
      <button @click="clearAllRatings" class="btn-clear">Clear All Feedback</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Admin role check
const isAdmin = ref(false);
const username = ref('');

// Input fields for rating and comments
const rating = ref(null);
const comment = ref('');

// Store all ratings from users
const ratings = ref([]);

// Form validation error messages
const errors = ref({
  rating: null,
  comment: null,
});

// Calculate the average rating from all user feedbacks
const averageRating = computed(() => {
  if (ratings.value.length === 0) return null;
  const total = ratings.value.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (total / ratings.value.length).toFixed(2);
});

// Validate the feedback form inputs
const validateForm = () => {
  let isValid = true;

  // Validate rating value between 1 and 5
  if (!rating.value || rating.value < 1 || rating.value > 5) {
    errors.value.rating = 'Please provide a rating between 1 and 5.';
    isValid = false;
  } else {
    errors.value.rating = null;
  }

  // Check if comment is provided
  if (!comment.value.trim()) {
    errors.value.comment = 'Please provide a comment with your feedback.';
    isValid = false;
  } else {
    errors.value.comment = null;
  }

  // Ensure the user is logged in before allowing feedback submission
  if (!username.value) {
    alert('Please log in to provide feedback.');
    isValid = false;
  }

  return isValid;
};

// Handle feedback form submission
const submitFeedback = () => {
  if (!validateForm()) return;

  // Create a new feedback object and add it to the ratings list
  const feedback = {
    username: username.value,
    rating: parseFloat(rating.value),
    comment: comment.value.trim(),
  };

  ratings.value.push(feedback);

  // Save feedback to localStorage
  localStorage.setItem('ratings', JSON.stringify(ratings.value));

  alert('Thank you for your feedback!');
  resetForm();
};

// Clear all user feedbacks (admin action)
const clearAllRatings = () => {
  localStorage.removeItem('ratings');
  ratings.value = [];
  alert('All feedback has been cleared.');
};

// Reset the feedback form inputs
const resetForm = () => {
  rating.value = null;
  comment.value = '';
};

// Initialize the component and load data on mount
onMounted(() => {
  // Check logged in user
  const storedUsername = localStorage.getItem('loggedInUser');
  if (storedUsername) {
    username.value = storedUsername;
  } else {
    alert('Please log in to provide feedback.');
  }

  // Check if user is an admin
  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Admin') {
    isAdmin.value = true;
  }

  // Load existing ratings from localStorage
  const storedRatings = localStorage.getItem('ratings');
  if (storedRatings) {
    ratings.value = JSON.parse(storedRatings);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');

/* Styling for the intro banner section */
.intro-banner {
  padding: 20px;
  background: #f0f4f8;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  margin: 0 auto 25px;
  max-width: 850px;
  text-align: center;
}

/* Text styling for the description */
.description {
  font-family: 'Lora', serif;
  color: #555;
  font-size: 1.15em;
  line-height: 1.7;
}

/* Main feedback form container styling */
.feedback-section {
  max-width: 650px;
  margin: auto;
  padding: 35px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #ffffff;
}

/* Header styling for feedback section */
.feedback-header {
  margin-bottom: 30px;
}

/* Layout styling for feedback form */
.rating-form {
  display: flex;
  flex-direction: column;
}

/* Rating and comment group styling */
.rating-group,
.comment-group {
  margin-bottom: 20px;
}

/* Input styling for rating and comments */
.rating-input,
.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Submit button styling */
.btn-submit {
  padding: 12px 24px;
  background-color: #2869c8;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #2157a6;
}

/* Average rating and feedback list styling */
.average-rating,
.user-feedback-list {
  text-align: center;
}

/* Styling for the feedback list */
.feedback-list {
  list-style-type: none;
  padding: 0;
}

/* Styling for each feedback item */
.feedback-list li {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Admin action button styling */
.admin-actions {
  margin-top: 25px;
}

.btn-clear {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-clear:hover {
  background-color: #c0392b;
}
</style>
