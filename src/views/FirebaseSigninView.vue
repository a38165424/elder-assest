<template>
    <h1>Sign in</h1>
    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p><button @click="signin">Sign in via Firebase</button></p>
    <p v-if="role">Logged in as: {{ role }}</p> <!-- Display the user role on the page -->
    <p v-if="userInfo">Current User: {{ userInfo.email }} (Role: {{ role }})</p> <!-- Display current user info -->
    <button v-if="isLoggedIn" @click="signout">Sign Out</button> <!-- Logout button -->
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
  
  const email = ref("");
  const password = ref("");
  const role = ref(""); // To store the user's role
  const userInfo = ref(null); // To store the user's information
  const isLoggedIn = ref(false); // To track the user's login status
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  
  const signin = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        console.log("Firebase Sign-In Successful!"); // Confirm sign-in success
        router.push("/"); // Redirect to the home page after successful login
      })
      .catch((error) => {
        console.log("Sign-in error:", error.code); // Log any sign-in errors
      });
  };
  
  // Logout function
  const signout = () => {
    console.log("Current user before logout:", userInfo.value); // Print current user info before sign out
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully"); // Confirm sign-out
        role.value = ""; // Clear role information
        userInfo.value = null; // Clear user information
        isLoggedIn.value = false; // Reset login status
        router.push("/FireLogin"); // Redirect to the login page
      })
      .catch((error) => {
        console.log("Error signing out:", error); // Log sign-out errors
      });
  };
  
  // Use onAuthStateChanged to ensure the user state is correctly managed
  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userInfo.value = user; // Store current user info
        console.log("User state changed, current user:", user); // Log current user info after state change
        isLoggedIn.value = true;
  
        // Fetch user role from Firestore
        try {
          const userDoc = doc(db, "users", user.uid); // Ensure this path matches your Firestore structure
          const userSnap = await getDoc(userDoc);
  
          if (userSnap.exists()) {
            role.value = userSnap.data().role; // Set the user's role
            console.log(`Logged in as: ${role.value}`); // Log the role of the user
          } else {
            console.log("No such user data found!"); // Log if no user data is found
          }
        } catch (error) {
          console.log("Error fetching user role:", error); // Log errors when fetching role
        }
      } else {
        // User is not logged in
        userInfo.value = null;
        isLoggedIn.value = false;
        role.value = "";
        console.log("No user is currently logged in."); // Log when no user is logged in
      }
    });
  });
  </script>
  
  
    