import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AboutUs from '../views/AboutUs.vue'
import Activity from '../views/Activity.vue'
import Service from '../views/Service.vue'
import Administor from '../views/Administor.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/AboutUs',
    name: 'AboutUs',
    component: AboutUs
  },
  {
    path: '/Activity',
    name: 'Activity',
    component: Activity
  },
  {
    path: '/Service',
    name: 'Service',
    component: Service
  },
  {
    path: '/Administor',
    name: 'Administor',
    component: Administor
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router