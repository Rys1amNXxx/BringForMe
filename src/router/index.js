import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Messages from '../components/Messages.vue'
import TaskFeed from '../components/TaskFeed.vue'
import Profile from '../components/Profile.vue'

const routes = [
  { path: '/', name:'HomePage', component: HomePage, meta: { requiresAuth: true } },
  { path: '/login', name:'Login', component: Login },
  { path: '/register', name:'Register', component: Register },
  { path: '/profile', name:'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/messages', name:'Messages', component: Messages , meta: { requiresAuth: true }},
  { path: '/tasks', name:'TaskFeed', component: TaskFeed, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  if(to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
