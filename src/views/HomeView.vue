<template>
  <div class="intro-container">
    <p class="intro-text">
      Welcome to our home!
    </p>
  </div>
  <div class="container-fluid mt-5">
    <!-- User info and logout button -->
    <div v-if="loggedInUser" class="row justify-content-center mb-3">
      <div class="col-auto d-flex align-items-center">
        <span class="welcome-message">Welcome, {{ loggedInUser }}</span>
        <button @click="logout" class="btn btn-link ms-3 logout-button">Logout</button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-4">
        <div class="auth-container p-4 shadow-sm rounded">
          <h1 class="text-center mb-4">{{ isLoginMode ? 'Login' : 'User Information Form' }}</h1>
          <form @submit.prevent="submitForm">
            <!-- Authentication method selector -->
            <div class="mb-3">
              <label for="authMethod" class="form-label">Choose Authentication Method:</label>
              <select class="form-select" id="authMethod" v-model="authMethod">
                <option value="local">Local Storage</option>
                <option value="firebase">Firebase</option>
              </select>
            </div>

            <!-- Username/Email input -->
            <div class="mb-3">
              <label for="username" class="form-label">Username / Email</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="validateName"
                @input="validateName"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <!-- Password input -->
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="validatePassword"
                @input="validatePassword"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>

            <!-- Additional fields for registration -->
            <div v-if="!isLoginMode">
              <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirm password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirm-password"
                  @blur="validateConfirmPassword"
                  @input="validateConfirmPassword"
                  v-model="formData.confirmPassword"
                />
                <div v-if="errors.confirmPassword" class="text-danger">
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <div class="mb-3" v-if="authMethod === 'firebase'">
                <label for="gender" class="form-label">Gender</label>
                <select
                  class="form-select"
                  id="gender"
                  @blur="validateGender"
                  @input="validateGender"
                  v-model="formData.gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
              </div>

              <!-- Admin role checkbox -->
              <div class="form-check mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAdmin"
                  @blur="validateRole"
                  @input="validateRole"
                  v-model="formData.isAdmin"
                />
                <label class="form-check-label" for="isAdmin">Are you admin?</label>
                <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
              </div>
            </div>

            <!-- Submit and toggle button -->
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2 form-button">
                {{ isLoginMode ? 'Login' : 'Submit' }}
              </button>
              <button type="button" class="btn btn-link toggle-link" @click="toggleMode">
                {{ isLoginMode ? 'Create an account' : 'Already have an account? Login' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const isLoginMode = ref(true);
const loggedInUser = ref(localStorage.getItem('loggedInUser') || '');

// Authentication method
const authMethod = ref('local');

// Form data and errors
const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
  gender: ''
});

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  role: null,
  gender: null
});

// Firebase setup
const auth = getAuth();
const db = getFirestore();

// Sanitize input
const sanitizeInput = (input) => {
  return input.replace(/[<>/"']/g, '');
};

// Toggle between login and register mode
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  clearForm();
};

// Validation functions
const validateConfirmPassword = () => {
  formData.value.confirmPassword = sanitizeInput(formData.value.confirmPassword);
  if (!isLoginMode.value && formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

const validateName = () => {
  formData.value.username = sanitizeInput(formData.value.username);
  if (formData.value.username.length < 3) {
    errors.value.username = 'Name must be at least 3 characters';
  } else {
    errors.value.username = null;
  }
};

const validateGender = () => {
  formData.value.gender = sanitizeInput(formData.value.gender);
  if (!isLoginMode.value && formData.value.gender.length === 0) {
    errors.value.gender = 'Please select at least one gender option';
  } else {
    errors.value.gender = null;
  }
};

const validatePassword = () => {
  formData.value.password = sanitizeInput(formData.value.password);
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    errors.value.password = 'Password must contain at least one uppercase letter.';
  } else if (!hasLowercase) {
    errors.value.password = 'Password must contain at least one lowercase letter.';
  } else if (!hasNumber) {
    errors.value.password = 'Password must contain at least one number.';
  } else {
    errors.value.password = null;
  }
};

const validateRole = () => {
  if (!isLoginMode.value && formData.value.isAdmin === null) {
    errors.value.role = 'Please select a role';
  } else {
    errors.value.role = null;
  }
};

// Clear form fields
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    gender: ''
  };
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = null;
  });
};

// Form submission handling
const submitForm = () => {
  validateName();
  validatePassword();

  if (!isLoginMode.value) {
    validateConfirmPassword();
    validateGender();
    validateRole();
  }

  if (isLoginMode.value) {
    if (authMethod.value === 'local') {
      loginLocal();
    } else {
      loginFirebase();
    }
  } else {
    if (authMethod.value === 'local') {
      registerLocal();
    } else {
      registerFirebase();
    }
  }
};

// Local login function
const loginLocal = () => {
  const storedUser = localStorage.getItem(formData.value.username);
  if (storedUser) {
    const storedData = JSON.parse(storedUser);
    const storedPassword = storedData.password;

    if (formData.value.password === storedPassword) {
      alert(`Login successful! You are logged in as ${storedData.role}`);
      localStorage.setItem('loggedInUser', formData.value.username);
      localStorage.setItem('userRole', storedData.role);
      loggedInUser.value = formData.value.username;
      errors.value.password = null;
    } else {
      errors.value.password = 'Incorrect password!';
    }
  } else {
    alert('Username does not exist!');
  }
};

// Local register function
const registerLocal = () => {
  if (localStorage.getItem(formData.value.username)) {
    alert('Username already exists!');
    return;
  }

  if (formData.value.password === formData.value.confirmPassword) {
    localStorage.setItem(
      formData.value.username,
      JSON.stringify({
        password: formData.value.password,
        role: formData.value.isAdmin ? 'Admin' : 'User'
      })
    );
    alert('Registration successful!');
    clearForm();
    toggleMode();
  } else {
    errors.value.confirmPassword = 'Passwords do not match.';
  }
};

// Firebase login function
const loginFirebase = () => {
  signInWithEmailAndPassword(auth, formData.value.username, formData.value.password)
    .then(async (data) => {
      const user = data.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        loggedInUser.value = user.email;
        localStorage.setItem('loggedInUser', user.email);
        localStorage.setItem('userRole', userDoc.data().role);
        alert(`Login successful (Firebase)! Role: ${userDoc.data().role}`);
      }
    })
    .catch((error) => {
      alert('Login failed! ' + error.message);
    });
};

// Firebase register function
const registerFirebase = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.';
    return;
  }
  createUserWithEmailAndPassword(auth, formData.value.username, formData.value.password)
    .then(async (data) => {
      const user = data.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: formData.value.isAdmin ? 'Admin' : 'User',
        gender: formData.value.gender
      });
      alert('Registration successful (Firebase)!');
      clearForm();
      toggleMode();
    })
    .catch((error) => {
      alert('Registration failed! ' + error.message);
    });
};

// Logout function
const logout = () => {
  if (authMethod.value === 'firebase') {
    signOut(auth).then(() => {
      alert('Logged out from Firebase');
      loggedInUser.value = null;
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('userRole');
    });
  } else {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userRole');
    alert('You have been logged out.');
    loggedInUser.value = null;
    location.reload();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap');

.intro-container {
  padding: 20px;
  background-color: #f7f2ed;
  border: 1px solid #d6cfc7;
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
  color: #5b4636;
  line-height: 1.6;
  margin: 0;
  text-align: justify;
}

.container-fluid {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.auth-container {
  background-color: #ffffff;
  border: 1px solid #d6cfc7;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

input,
select,
textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #bdaea0;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-button {
  background-color: #8b5e3c; 
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #73492f; /* 更深的棕色 */
}

.toggle-link {
  color: #8b5e3c; /* 深棕色 */
  text-decoration: none;
  cursor: pointer;
}

.toggle-link:hover {
  color: #73492f;
  text-decoration: underline;
}

h1 {
  color: #5b4636;
  font-size: 1.75em;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 15px;
    width: 90%;
  }

  .intro-text {
    font-size: 1em;
  }

  .form-button,
  .toggle-link {
    width: 100%;
    margin-top: 10px;
  }

  .text-center {
    flex-direction: column;
  }
}
</style>
