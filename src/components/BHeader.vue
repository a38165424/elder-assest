<template>
    <!-- Using Bootstrap's Header template (starter code) -->
    <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
    <div class="container">
      <header class="d-flex justify-content-center py-3">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/AboutUs" class="nav-link" active-class="active">AboutUs</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Activity" class="nav-link" active-class="active">Activity</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Service" class="nav-link" active-class="active">Service</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Administor" class="nav-link" active-class="active">Administor</router-link>
          </li>
        </ul>
      </header>
    </div>
</template>