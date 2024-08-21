<script setup>
import HelloWorld from './components/HelloWorld.vue'
import Form from "./views/Home.vue"
//import JSON from './components/JSON.vue'
import BHeader from './components/BHeader.vue'

</script>

<template>
  <!-- <JSON /-->
  <!-- <JSONSolution /> -->
  <BHeader />
  <router-view></router-view>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
