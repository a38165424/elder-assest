import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutUsView from '../views/AboutUsView.vue';
import ActivityView from '../views/ActivityView.vue';
import ServiceView from '../views/ServiceView.vue';
import AdministorView from '../views/AdministorView.vue';
const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/AboutUsView',
    name: 'AboutUsView',
    component: AboutUsView,
  },
  {
    path: '/ActivityView',
    name: 'ActivityView',
    component: ActivityView,
  },
  {
    path: '/ServiceView',
    name: 'ServiceView',
    component: ServiceView,
  },
  {
    path: '/AdministorView',
    name: 'AdministorView',
    component: AdministorView,
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
      next({ name: 'HomeView' }); // Redirect to Home if not logged in
    } else if (to.meta.role && to.meta.role !== userRole) {
      alert('You do not have permission to access this page.');
      next({ name: 'HomeView' }); // Redirect to Home if role does not match
    } else {
      next(); // Allow access
    }
  } else {
    next(); // Allow access to routes without auth requirements
  }
});

export default router;

