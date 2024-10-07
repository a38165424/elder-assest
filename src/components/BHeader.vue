<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            Home View
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/AboutUsView" class="nav-link" active-class="active">
            AboutUs
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ActivityView" class="nav-link" active-class="active">
            Activity
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/ServiceView" class="nav-link" active-class="active">
            Service
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/AdministorView" class="nav-link" active-class="active">
            Administor
          </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
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
