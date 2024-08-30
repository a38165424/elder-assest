<template>
  <div class="container mt-5">
    <h1 class="text-center">Administer Page</h1>
    <div v-if="isAdmin">
      <p>Welcome, Admin! You have full access to this page.</p>
      <DataTable v-if="submittedCards.length" :value="submittedCards" class="mt-5">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="role" header="Role"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column header="Actions">
          <template #body="slotProps">
            <button class="btn btn-danger" @click="deleteUser(slotProps.data.username)">
              Delete
            </button>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else>
      <p>You are not an admin. You do not have permission to view this content.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Define reactive variables
const isAdmin = ref(false);
const submittedCards = ref([]);

// Check if the user is an admin
const userRole = localStorage.getItem('userRole');
if (userRole === 'Admin') {
  isAdmin.value = true;
} else {
  isAdmin.value = false;
}

// Load registered users from localStorage when component mounts
onMounted(() => {
  loadUserData();
});

// Cleanup states or listeners when leaving the page
onBeforeUnmount(() => {
  // Reset states, clear intervals, event listeners, etc.
  submittedCards.value = [];
  console.log('Cleaning up Administor component...');
});

// Function to load user data from localStorage
const loadUserData = () => {
  const users = [];
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'loggedInUser' && key !== 'userRole') {
      try {
        const userData = JSON.parse(localStorage.getItem(key));
        // Only include users with role "User"
        if (userData.role === 'User') {
          users.push({
            username: key,
            password: userData.password,
            role: userData.role,
            gender: userData.gender,
          });
        }
      } catch (error) {
        console.error(`Error parsing data for key: ${key}`, error);
      }
    }
  });
  submittedCards.value = users;
  console.log('Loaded users:', submittedCards.value); // Log the loaded users
};

// Function to delete a user
const deleteUser = (username) => {
  localStorage.removeItem(username);
  submittedCards.value = submittedCards.value.filter(user => user.username !== username);
  alert(`${username} has been deleted.`);
};
</script>

<script>
// Ensure navigation away from Administor is handled correctly
export default {
  beforeRouteLeave(_, __, next) {
    console.log('Leaving Administor...');

    // Use setTimeout to allow the next route to be fully processed before reloading
    next(); // Allow the navigation
    setTimeout(() => {
      if (window.location.pathname !== '/Administor') {
        window.location.reload(); // Refresh the page only after navigating away
      }
    }, 10);
  },
};
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

button.btn-danger {
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #d9534f;
}

button.btn-danger:hover {
  background-color: #c9302c;
}
</style>




