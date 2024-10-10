<template>
  <div class="about">
    <h1>About Our Library</h1>
    <p>
      Welcome to Activity! We are committed to offering a comprehensive collection of activities and resources to serve our community's needs.
    </p>
    <div class="calendar-container">
      <h2>Choose a Date</h2>
      <label for="date-picker">Select Date:</label>
      <input type="date" id="date-picker" class="date-input" v-model="pickedDate" @change="onDateSelect" />
      <p v-if="pickedDate">Selected Date: {{ pickedDate }}</p>
      
      <div v-if="availableTimes.length > 0">
        <h3>Select a Time</h3>
        <select v-model="pickedTime">
          <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
        </select>
        <button @click="makeReservation" class="reserve-button">Reserve</button>
      </div>
    </div>

    <h3>Your Reservations</h3>
    <ul v-if="allReservations.length">
      <li v-for="(reservation, index) in allReservations" :key="index">
        {{ reservation.date }} at {{ reservation.time }}
        <button @click="cancelReservation(reservation.date, reservation.time)" class="cancel-button">Cancel</button>
      </li>
    </ul>
    <p v-else>No reservations found.</p>

    <h2>Activity Schedule</h2>
    <div class="table-filters">
      <label for="activity-search" class="sr-only">Search Activity</label>
      <input id="activity-search" v-model="filters.activity" placeholder="Search Activity" />

      <label for="location-search" class="sr-only">Search Location</label>
      <input id="location-search" v-model="filters.location" placeholder="Search Location" />
    </div>

    <DataTable :value="filteredActivities" :paginator="true" :rows="10" :sortField="'date'" :sortOrder="1" :responsiveLayout="'scroll'">
      <Column field="activity" header="Activity" sortable></Column>
      <Column field="date" header="Date" sortable></Column>
      <Column field="time" header="Time"></Column>
      <Column field="location" header="Location"></Column>
    </DataTable>

    <button @click="exportToCSV" class="export-button" style="min-width: 44px; min-height: 44px;">Export Data</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const pickedDate = ref('');
const pickedTime = ref('');
const availableTimes = ref([]);
const filters = ref({
  activity: '',
  location: ''
});


const allReservations = ref([]);
let loggedInUser = '';

const loadUserID = () => {
  loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    console.error('User not logged in');
  }
};

const loadReservations = () => {
  const savedReservations = JSON.parse(localStorage.getItem(`reservations_${loggedInUser}`)) || [];
  allReservations.value = savedReservations;
};

const saveReservations = () => {
  localStorage.setItem(`reservations_${loggedInUser}`, JSON.stringify(allReservations.value));
};

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

const onDateSelect = () => {
  availableTimes.value = activities.value
    .filter(activity => activity.date === pickedDate.value)
    .map(activity => activity.time);
  pickedTime.value = '';
};

const makeReservation = () => {
  if (pickedDate.value && pickedTime.value) {
    allReservations.value.push({
      date: pickedDate.value,
      time: pickedTime.value
    });
    saveReservations(); 
  }
};


const cancelReservation = (date, time) => {
  allReservations.value = allReservations.value.filter(reservation => !(reservation.date === date && reservation.time === time));
  saveReservations(); 
};

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    return (
      (!filters.value.activity || activity.activity.toLowerCase().includes(filters.value.activity.toLowerCase())) &&
      (!filters.value.location || activity.location.toLowerCase().includes(filters.value.location.toLowerCase())) &&
      (!pickedDate.value || activity.date === pickedDate.value)
    );
  });
});

const exportToCSV = () => {
  const headers = ['Activity', 'Date', 'Time', 'Location'];
  const rows = filteredActivities.value.map(activity => [
    activity.activity,
    activity.date,
    activity.time,
    activity.location
  ]);
  let csvContent = headers.join(",") + "\n";
  rows.forEach(row => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'activities.csv';
  link.click();
};

onMounted(() => {
  loadUserID();
  loadReservations();
});
</script>




<style scoped>
.about {
  padding: 20px;
  max-width: 750px;
  margin: 20px auto;
  text-align: center;
  background-color: #f7f2ed;
  border: 1px solid #d6cfc7;
  border-radius: 12px;
}
.reserve-button, .cancel-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #8b5e3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.reserve-button:hover, .cancel-button:hover {
  background-color: #73492f;
}
.cancel-button {
  margin-left: 10px;
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
@media (max-width: 768px) {
  .table-filters {
    flex-direction: column;
    align-items: center;
  }
  .table-filters input {
    width: 100%;
  }
}
.cancel-button {
  margin-left: 10px;
}
</style>

