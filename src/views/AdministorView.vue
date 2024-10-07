<template>
  <div class="container-fluid mt-5"> 
    <h1 class="text-center">Administer Page</h1>

    <!-- 用户管理部分 -->
    <div v-if="isAdmin">
      <p>Welcome, Admin! You can delete users on this page.</p>
      <div class="row justify-content-center"> 
        <div class="col-12 col-md-10 col-lg-8"> 
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
      </div>
    </div>

    <!-- 邮件发送部分 -->
    <div class="mt-5">
      <h2>Send Survey Email</h2>
      <form @submit.prevent="sendEmail">
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
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { getFunctions, httpsCallable } from "firebase/functions";

// Define reactive variables
const isAdmin = ref(false);
const submittedCards = ref([]);
const toEmail = ref('');
const subject = ref('');
const content = ref('');
const attachment = ref(null);

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
  submittedCards.value = [];
  console.log('Cleaning up Administer component...');
});

// Function to load user data from localStorage
const loadUserData = () => {
  const users = [];
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'loggedInUser' && key !== 'userRole') {
      try {
        const userData = JSON.parse(localStorage.getItem(key));
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
  console.log('Loaded users:', submittedCards.value);
};

// Function to delete a user
const deleteUser = (username) => {
  localStorage.removeItem(username);
  submittedCards.value = submittedCards.value.filter(user => user.username !== username);
  alert(`${username} has been deleted.`);
};

// Handle file change for email attachment
const handleFileChange = (event) => {
  attachment.value = event.target.files[0];
};

// Function to send email
const sendEmail = async () => {
  const functions = getFunctions();
  const sendEmailFunction = httpsCallable(functions, 'sendEmailWithAttachment');

  if (attachment.value) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Attachment = reader.result.split(',')[1]; 

      try {
        const result = await sendEmailFunction({
          toEmail: toEmail.value,
          subject: subject.value,
          content: content.value,
          attachmentFileName: attachment.value.name,
          attachmentContentBase64: base64Attachment,
        });

        if (result.data.success) {
          alert('Email sent successfully with attachment!');
        } else {
          alert('Something went wrong!');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Failed to send email with attachment.');
      }
    };

    reader.readAsDataURL(attachment.value); 
  } else {
    try {
      const result = await sendEmailFunction({
        toEmail: toEmail.value,
        subject: subject.value,
        content: content.value,
      });

      if (result.data.success) {
        alert('Email sent successfully without attachment!');
      } else {
        alert('Something went wrong!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  }
};
</script>

<style scoped>
.container-fluid {
  width: 100%;
  max-width: 100%; /* Ensure full width */
  padding: 20px;
  margin: 0 auto;
}

h1, h2 {
  text-align: center;
  margin-bottom: 20px;
}

p, label {
  text-align: center;
  font-size: 1.2em;
  margin-top: 20px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>




