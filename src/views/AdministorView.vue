<template>
  <div class="container-fluid mt-5"> 
    <h1 class="text-center">Administer Page</h1>

    <div v-if="isAdmin">
      <p>Welcome, Admin! You can delete users on this page.</p>
      <div class="row justify-content-center"> 
        <div class="col-12 col-md-10 col-lg-8"> 
          <div class="table-filters">
            <input v-model="filters.username" placeholder="Search Username" />
          </div>
          <DataTable v-if="submittedCards.length" :value="filteredUsers" class="mt-5" :paginator="true" :rows="10" :sortField="'username'" :sortOrder="1" :responsiveLayout="'scroll'">
            <Column field="username" header="Username" sortable></Column>
            <Column field="password" header="Password"></Column>
            <Column field="role" header="Role" sortable></Column>
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
      </div>
    </div>

    <div class="mt-5">
      <h2>{{ isBulkSend ? 'Bulk Send Email' : 'Send Survey Email' }}</h2>
      <button @click="toggleBulkSend">{{ isBulkSend ? 'Back to Single Send' : 'Bulk Send' }}</button>
      
      <form v-if="!isBulkSend" @submit.prevent="sendEmail">
        <div>
          <label for="email">Recipient Email:</label>
          <input type="email" v-model="toEmail" id="email" required placeholder="Enter recipient email" />
        </div>
        <div>
          <label for="subject">Email Subject:</label>
          <input type="text" v-model="subject" id="subject" required placeholder="Enter subject" />
        </div>
        <div>
          <label for="content">Email Content:</label>
          <textarea v-model="content" id="content" required placeholder="Enter email content"></textarea>
        </div>
        <div>
          <label for="attachment">Upload Attachment (Optional):</label>
          <input type="file" @change="handleFileChange" id="attachment" />
        </div>
        <button type="submit">Send Email</button>
      </form>

      <div v-if="isBulkSend">
        <form @submit.prevent="sendBulkEmails">
          <div>
            <label for="subject">Email Subject:</label>
            <input type="text" v-model="subject" id="subject" required placeholder="Enter subject" />
          </div>
          <div>
            <label for="content">Email Content:</label>
            <textarea v-model="content" id="content" required placeholder="Enter email content"></textarea>
          </div>
          <div>
            <label for="attachment">Upload Attachment (Optional):</label>
            <input type="file" @change="handleFileChange" id="attachment" />
          </div>
          <button type="submit">Send Bulk Emails</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const isAdmin = ref(false);
const isBulkSend = ref(false);
const submittedCards = ref([]);
const toEmail = ref('');
const subject = ref('');
const content = ref('');
const attachment = ref(null);

const filters = ref({
  username: '',
  role: ''
});

// Determine if the user is an admin
const userRole = localStorage.getItem('userRole');
isAdmin.value = userRole === 'Admin';

onMounted(() => {
  loadUserData();
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  submittedCards.value = [];
  console.log('Cleaning up Administer component...');
});

// Load user data from local storage
const loadUserData = () => {
  const users = [];
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'loggedInUser' && key !== 'userRole') {
      const data = localStorage.getItem(key);
      if (data && data.startsWith('{') && data.endsWith('}')) {
        try {
          const userData = JSON.parse(data);
          if (userData && typeof userData === 'object' && userData.role === 'User') {
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
    }
  });
  submittedCards.value = users;
};

// Remove user from local storage and update the list
const deleteUser = (username) => {
  localStorage.removeItem(username);
  submittedCards.value = submittedCards.value.filter(user => user.username !== username);
  alert(`${username} has been deleted.`);
};

// Filter user list based on search criteria
const filteredUsers = computed(() => {
  return submittedCards.value.filter(user => {
    return (
      (!filters.value.username || user.username.toLowerCase().includes(filters.value.username.toLowerCase()))
    );
  });
});

// Handle file input for attachment
const handleFileChange = (event) => {
  attachment.value = event.target.files[0];
};

// Toggle between single and bulk email sending
const toggleBulkSend = () => {
  isBulkSend.value = !isBulkSend.value;
};

// Send a single email
const sendEmail = async () => {
  const functions = getFunctions();
  const sendEmailFunction = httpsCallable(functions, 'sendEmailWithAttachment');

  const attachmentData = attachment.value ? await fileToBase64(attachment.value) : null;
  try {
    const result = await sendEmailFunction({
      toEmail: toEmail.value,
      subject: subject.value,
      content: content.value,
      attachmentFileName: attachment.value?.name,
      attachmentContentBase64: attachmentData,
    });

    if (result.data.success) {
      alert('Email sent successfully!');
      console.log(`Email sent to ${toEmail.value}`);
    } else {
      alert('Failed to send email!');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email.');
  }
};

// Send bulk emails to all users with role 'User' in Firebase
const sendBulkEmails = async () => {
  const functions = getFunctions();
  const sendEmailFunction = httpsCallable(functions, 'sendEmailWithAttachment');
  const db = getFirestore();

  const users = await getDocs(collection(db, "users"));
  const emailsToSend = [];
  users.forEach((doc) => {
    const userData = doc.data();
    if (userData.role === 'User') {
      emailsToSend.push(userData.email);
    }
  });

  const attachmentData = attachment.value ? await fileToBase64(attachment.value) : null;

  for (const email of emailsToSend) {
    try {
      await sendMail(email, subject.value, content.value, attachmentData);
      await new Promise(resolve => setTimeout(resolve, 200)); // Add delay between emails
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  }

  alert('Bulk emails sent!');
};

// Convert file to Base64 for attachment
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to send an email
const sendMail = async (email, subject, content, attachmentBase64) => {
  const sendEmailFunction = httpsCallable(getFunctions(), 'sendEmailWithAttachment');
  try {
    const result = await sendEmailFunction({
      toEmail: email,
      subject,
      content,
      attachmentFileName: attachment.value?.name,
      attachmentContentBase64: attachmentBase64,
    });
    if (result.data.success) {
      console.log(`Email sent to ${email}`);
    } else {
      console.log(`Failed to send email to ${email}`);
    }
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
};
</script>

<style scoped>
/* Import fonts and set base styles for the container and text */
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');

.container-fluid {
  width: 100%;
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;
  background-color: #f7f2ed;
  border: 1px solid #d6cfc7;
  border-radius: 10px;
}

h1, h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #5b4636;
  font-family: 'Lora', serif;
}

p, label {
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
  color: #5b4636;
  font-family: 'Lora', serif;
}

.table-filters {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #bdaea0;
  border-radius: 6px;
  background-color: #ffffff;
  color: #5b4636;
}

button {
  padding: 12px 24px;
  background-color: #8b5e3c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Lora', serif;
}

button:hover {
  background-color: #73492f;
}

.btn-clear {
  padding: 10px 20px;
  background-color: #b04b4b;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-clear:hover {
  background-color: #903c3c;
}
</style>
