import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AboutUs from '../views/AboutUs.vue';
import Activity from '../views/Activity.vue';
import Service from '../views/Service.vue';
import Administor from '../views/Administor.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/AboutUs',
    name: 'AboutUs',
    component: AboutUs,
  },
  {
    path: '/Activity',
    name: 'Activity',
    component: Activity,
  },
  {
    path: '/Service',
    name: 'Service',
    component: Service,
  },
  {
    path: '/Administor',
    name: 'Administor',
    component: Administor,
    meta: { requiresAuth: true, role: 'Admin' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global route guard for access control
router.beforeEach((to, from, next) => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedInUser) {
      alert('You need to log in to access this page.');
      next({ name: 'Home' }); // Redirect to Home if not logged in
    } else if (to.meta.role && to.meta.role !== userRole) {
      alert('You do not have permission to access this page.');
      next({ name: 'Home' }); // Redirect to Home if role does not match
    } else {
      next(); // Allow access
    }
  } else {
    next(); // Allow access to routes without auth requirements
  }
});

export default router;

