<template>
  <div class="container mt-5">
    <!-- 显示当前登录的用户名和登出按钮 -->
    <div v-if="loggedInUser" class="row justify-content-end mb-3">
      <div class="col-auto">
        <span>Welcome, {{ loggedInUser }}</span>
        <button @click="logout" class="btn btn-link ms-3">Logout</button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-4">
        <h1 class="text-center">{{ isLoginMode ? 'Login' : 'User Information Form' }}</h1>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
              v-model="formData.username"
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
              v-model="formData.password"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>

          <!-- 根据模式显示额外的注册字段 -->
          <div v-if="!isLoginMode">
            <div class="mb-3">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                @blur="() => validateConfirmPassword(true)"
                @input="() => validateConfirmPassword(false)"
                v-model="formData.confirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>

            <div class="mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                @blur="() => validateGender(true)"
                @input="() => validateGender(false)"
                v-model="formData.gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>

            <div class="form-check mb-3">
              <input
                type="checkbox"
                class="form-check-input"
                id="isAdmin"
                @blur="() => validateRole(true)"
                @input="() => validateRole(false)"
                v-model="formData.isAdmin"
              />
              <label class="form-check-label" for="isAdmin">Are you admin?</label>
              <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">
              {{ isLoginMode ? 'Login' : 'Submit' }}
            </button>
            <button type="button" class="btn btn-link" @click="toggleMode">
              {{ isLoginMode ? 'Create an account' : 'Already have an account? Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoginMode = ref(true); // 控制显示登录还是注册模式
const loggedInUser = ref(localStorage.getItem('loggedInUser'));

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAdmin: false, // 默认角色为User（不是Admin）
  gender: ''
});

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  role: null,
  gender: null
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  clearForm(); // 切换模式时清除表单
};

const validateConfirmPassword = () => {
  if (!isLoginMode.value && formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.';
  } else {
    errors.value.confirmPassword = null;
  }
};

const validateName = () => {
  if (formData.value.username.length < 3) {
    errors.value.username = 'Name must be at least 3 characters';
  } else {
    errors.value.username = null;
  }
};

const validateGender = () => {
  if (!isLoginMode.value && formData.value.gender.length === 0) {
    errors.value.gender = 'Please select at least one gender option';
  } else {
    errors.value.gender = null;
  }
};

const validatePassword = () => {
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

const submitForm = () => {
  validateName();
  validatePassword();

  if (!isLoginMode.value) {
    validateConfirmPassword();
    validateGender();
    validateRole();
  }

  if (isLoginMode.value) {
    login();
  } else {
    register();
  }
};

const login = () => {
  const storedUser = localStorage.getItem(formData.value.username);
  if (storedUser) {
    const storedData = JSON.parse(storedUser);
    const storedPassword = storedData.password;

    if (formData.value.password === storedPassword) {
      alert(`Login successful! You are logged in as ${storedData.role}`);
      localStorage.setItem('loggedInUser', formData.value.username);
      localStorage.setItem('userRole', storedData.role); // 保存用户角色信息
      loggedInUser.value = formData.value.username;
      errors.value.password = null; // 清除错误消息
    } else {
      errors.value.password = 'Incorrect password!'; // 显示密码错误的消息
    }
  } else {
    alert('Username does not exist!');
  }
};

const register = () => {
  validateName();
  validatePassword();
  validateConfirmPassword();
  validateGender();
  validateRole();

  if (localStorage.getItem(formData.value.username)) {
    alert('Username already exists!');
    return;
  }

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.gender &&
    !errors.value.role
  ) {
    const role = formData.value.isAdmin ? 'Admin' : 'User';
    localStorage.setItem(
      formData.value.username,
      JSON.stringify({
        password: formData.value.password,
        role: role,
        gender: formData.value.gender
      })
    );
    alert('Registration successful!');
    clearForm(); // 注册成功后清除表单
    toggleMode(); // 注册成功后切换到登录模式
  } else {
    alert('Please fix the errors before submitting.');
  }
};

const logout = () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userRole');
  alert('You have been logged out.');
  loggedInUser.value = null;
  location.reload(); // 刷新页面
};
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select,
textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #275FDA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #1e4bb5;
}

.text-center {
  margin-top: 20px;
}

a {
  color: #007bff;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}
</style>
