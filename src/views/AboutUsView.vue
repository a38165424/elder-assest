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
        <label for="service-rating">Rating</label>
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
        <label for="service-comment">Comment</label>
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

    <div v-if="averageRating !== null" class="average-rating text-center">
      <h4>Average User Rating: {{ averageRating }}</h4>
    </div>

    <div class="table-filters mt-4">
      <input v-model="filters.rating" placeholder="Search by Rating" />
      <input v-model="filters.comment" placeholder="Search by Comment" />
    </div>

    <DataTable :value="filteredRatings" :paginator="true" :rows="5" :sortField="'rating'" :sortOrder="1" :responsiveLayout="'scroll'">
      <Column field="username" header="Username" sortable></Column>
      <Column field="rating" header="Rating" sortable></Column>
      <Column field="comment" header="Comment"></Column>
    </DataTable>

    <div v-if="isAdmin" class="admin-actions text-center mt-4">
      <button @click="clearAllRatings" class="btn-clear">Clear All Feedback</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const isAdmin = ref(false);
const username = ref('');
const rating = ref(null);
const comment = ref('');
const ratings = ref([]);
const filters = ref({
  rating: '',
  comment: '',
});
const errors = ref({
  rating: null,
  comment: null,
});

const averageRating = computed(() => {
  if (ratings.value.length === 0) return null;
  const total = ratings.value.reduce((sum, feedback) => sum + feedback.rating, 0);
  return (total / ratings.value.length).toFixed(2);
});

const validateForm = () => {
  let isValid = true;

  if (!rating.value || rating.value < 1 || rating.value > 5) {
    errors.value.rating = 'Please provide a rating between 1 and 5.';
    isValid = false;
  } else {
    errors.value.rating = null;
  }

  if (!comment.value.trim()) {
    errors.value.comment = 'Please provide a comment with your feedback.';
    isValid = false;
  } else {
    errors.value.comment = null;
  }

  if (!username.value) {
    alert('Please log in to provide feedback.');
    isValid = false;
  }

  return isValid;
};

const submitFeedback = () => {
  if (!validateForm()) return;

  const feedback = {
    username: username.value,
    rating: parseFloat(rating.value),
    comment: comment.value.trim(),
  };

  ratings.value.push(feedback);
  localStorage.setItem('ratings', JSON.stringify(ratings.value));

  alert('Thank you for your feedback!');
  resetForm();
};

const clearAllRatings = () => {
  localStorage.removeItem('ratings');
  ratings.value = [];
  alert('All feedback has been cleared.');
};

const resetForm = () => {
  rating.value = null;
  comment.value = '';
};

const filteredRatings = computed(() => {
  return ratings.value.filter(feedback => {
    const matchesRating = filters.value.rating
      ? feedback.rating.toString().includes(filters.value.rating)
      : true;
    const matchesComment = filters.value.comment
      ? feedback.comment.toLowerCase().includes(filters.value.comment.toLowerCase())
      : true;
    return matchesRating && matchesComment;
  });
});

onMounted(() => {
  const storedUsername = localStorage.getItem('loggedInUser');
  if (storedUsername) {
    username.value = storedUsername;
  } else {
    alert('Please log in to provide feedback.');
  }

  const userRole = localStorage.getItem('userRole');
  if (userRole === 'Admin') {
    isAdmin.value = true;
  }

  const storedRatings = localStorage.getItem('ratings');
  if (storedRatings) {
    ratings.value = JSON.parse(storedRatings);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');

.intro-banner {
  padding: 20px;
  background-color: #f7f2ed;
  border: 1px solid #d6cfc7;
  border-radius: 10px;
  margin: 0 auto 25px;
  max-width: 850px;
  text-align: center;
}

.description {
  font-family: 'Lora', serif;
  color: #5b4636;
  font-size: 1.15em;
  line-height: 1.7;
}

.feedback-section {
  max-width: 650px;
  margin: auto;
  padding: 35px;
  border: 1px solid #d6cfc7;
  border-radius: 12px;
  background-color: #ffffff;
}

.feedback-header {
  margin-bottom: 30px;
}

.table-filters {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.rating-input,
.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdaea0;
  border-radius: 6px;
}

.btn-submit {
  padding: 12px 24px;
  background-color: #8b5e3c; 
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #73492f; 
}

.admin-actions {
  margin-top: 25px;
}

.btn-clear {
  padding: 10px 20px;
  background-color: #b04b4b;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
::v-deep .p-datatable-paginator-bottom .p-paginator-content .p-paginator-page,
::v-deep .p-datatable-paginator-bottom .p-paginator-content .p-paginator-prev,
::v-deep .p-datatable-paginator-bottom .p-paginator-content .p-paginator-next {
  min-width: 20px !important;
  min-height: 20px !important;
  margin: 6px !important;
  padding: 12px !important;
  font-size: 1em !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.btn-clear:hover {
  background-color: #903c3c;
}
</style>
