<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/AboutUs" class="nav-link" active-class="active">
            AboutUs
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Activity" class="nav-link" active-class="active">
            Activity
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Service" class="nav-link" active-class="active">
            Service
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Administor" class="nav-link" active-class="active">
            Administor
          </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
// No specific script needed here for navigation links
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.nav-link.active {
  font-weight: bold;
  color: #007bff;
}
</style>
