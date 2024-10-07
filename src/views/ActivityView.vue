<template>
  <div class="about">
    <h1>About Our Library</h1>
    <p>
      Welcome to Activity! We are committed to offering a comprehensive collection of activities and resources to serve our community's needs.
    </p>
    <div class="calendar-container">
      <h2>Choose a Date</h2>
      <input type="date" class="date-input" v-model="pickedDate" @change="onDateSelect" />
      <p v-if="pickedDate">Selected Date: {{ pickedDate }}</p>
    </div>
    
    <h2>Activity Schedule</h2>
    <!-- 搜索功能 -->
    <div class="table-filters">
      <input v-model="filters.activity" placeholder="Search Activity" />
      <input v-model="filters.location" placeholder="Search Location" />
    </div>

    <DataTable :value="filteredActivities" :paginator="true" :rows="10" :sortField="'date'" :sortOrder="1" :responsiveLayout="'scroll'">
      <Column field="activity" header="Activity" sortable></Column>
      <Column field="date" header="Date" sortable></Column>
      <Column field="time" header="Time"></Column>
      <Column field="location" header="Location"></Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const pickedDate = ref('');
const filters = ref({
  activity: '',
  location: ''
});

const activities = ref([
  { activity: 'Yoga Class', date: '2024-10-07', time: '10:00 AM', location: 'Community Hall' },
  { activity: 'Health Checkup', date: '2024-10-07', time: '02:00 PM', location: 'Health Center' },
  { activity: 'Book Reading', date: '2024-10-08', time: '11:00 AM', location: 'Library' },
  { activity: 'Walking Group', date: '2024-10-09', time: '08:00 AM', location: 'Park' },
  { activity: 'Cooking Workshop', date: '2024-10-10', time: '01:00 PM', location: 'Community Center' },
  { activity: 'Movie Night', date: '2024-10-11', time: '07:00 PM', location: 'Community Hall' },
  { activity: 'Art Class', date: '2024-10-12', time: '10:00 AM', location: 'Art Studio' },
  { activity: 'Music Concert', date: '2024-10-13', time: '06:00 PM', location: 'Concert Hall' },
  { activity: 'Gardening Workshop', date: '2024-10-14', time: '09:00 AM', location: 'Community Garden' },
  { activity: 'Dance Class', date: '2024-10-15', time: '03:00 PM', location: 'Dance Studio' },
  { activity: 'Cycling Tour', date: '2024-10-16', time: '07:00 AM', location: 'City Park' },
  { activity: 'Photography Workshop', date: '2024-10-17', time: '02:00 PM', location: 'Photo Studio' },
  { activity: 'Cooking Class', date: '2024-10-18', time: '01:00 PM', location: 'Community Center' },
  { activity: 'Tech Seminar', date: '2024-10-19', time: '10:00 AM', location: 'Tech Center' },
  { activity: 'Fitness Training', date: '2024-10-20', time: '08:00 AM', location: 'Gym' }
]);

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    return (
      (!filters.value.activity || activity.activity.toLowerCase().includes(filters.value.activity.toLowerCase())) &&
      (!filters.value.location || activity.location.toLowerCase().includes(filters.value.location.toLowerCase())) &&
      (!pickedDate.value || activity.date === pickedDate.value)
    );
  });
});

const onDateSelect = () => {
  console.log(`Date chosen: ${pickedDate.value}`);
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

.table-filters {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
}

.table-filters input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
  width: 150px;
}
</style>
