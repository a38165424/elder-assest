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
    component: Administor,
    meta: { requiresAuth: true, role: 'Admin' }  // 添加角色验证的元信息
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守卫，检查访问权限
router.beforeEach((to, from, next) => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userRole = localStorage.getItem('userRole');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedInUser) {
      alert('You need to log in to access this page.');
      next({ name: 'Home' });  // 未登录用户被重定向到首页
    } else if (to.meta.role && to.meta.role !== userRole) {
      alert('You do not have permission to access this page.');
      next(false);  // 阻止访问
    } else {
      next();  // 允许访问
    }
  } else {
    next();  // 允许访问
  }
});

export default router;
