<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p>
      <select v-model="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </p>
    <p><button @click="register">Save to Firebase</button></p>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
  
  const email = ref("");
  const password = ref("");
  const role = ref("user"); // Default role selection
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  
  const register = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (data) => {
        console.log("Firebase Register Successful!");
        const user = data.user;
  
        // Save the user role to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: role.value, // Save the selected role to Firestore
        });
  
        router.push("/FireLogin"); // Redirect to login page after registration
      })
      .catch((error) => {
        console.log(error.code);
      });
  };
  </script>
  
  
  