<template>
  <div class="about">
    <h1>About Our Library</h1>
    <p>
      Welcome to Activity! We are committed to offering a comprehensive collection of books and resources to serve our community's needs.
    </p>
    <div class="calendar-container">
      <h2>Choose a Date</h2>
      <input type="date" class="date-input" v-model="pickedDate" @change="onDateSelect" />
      <p v-if="pickedDate">Selected Date: {{ pickedDate }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive variable to store selected date
const pickedDate = ref('');

// Function to handle date selection
const onDateSelect = () => {
  alert(`Date chosen: ${pickedDate.value}`);
};
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 750px;
  margin: 20px auto;
  text-align: center;
  background-color: #f4f4f9;
  border: 1px solid #ccc;
  border-radius: 12px;
}

h1 {
  color: #333;
  font-size: 2.1em;
  margin-bottom: 12px;
}

p {
  color: #666;
  line-height: 1.7;
  margin-bottom: 15px;
}

.calendar-container {
  margin-top: 25px;
  padding: 18px;
  background-color: #eaf1f8;
  border: 1px solid #bbb;
  border-radius: 10px;
}

h2 {
  font-size: 1.6em;
  margin-bottom: 10px;
  color: #3a3a3a;
}

.date-input {
  padding: 10px;
  font-size: 1.1em;
  border: 1px solid #aaa;
  border-radius: 6px;
  cursor: pointer;
}

.date-input:focus {
  border-color: #7aaddf;
  outline: none;
}
</style>
