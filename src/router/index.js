import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import Login from '../components/LoginComponent.vue'
import Register from '../components/RegisterComponent.vue'
import Messages from '../components/MessagesComponent.vue'
import TaskFeed from '../components/TaskFeed.vue'
import Profile from '../components/ProfileComponent.vue'

// const routes = [
//   { path: '/', name:'HomePage', component: HomePage, meta: { requiresAuth: true } },
//   { path: '/login', name:'Login', component: Login },
//   { path: '/register', name:'Register', component: Register },
//   { path: '/profile', name:'Profile', component: Profile, meta: { requiresAuth: true } },
//   { path: '/messages', name:'Messages', component: Messages , meta: { requiresAuth: true }},
//   { path: '/tasks', name:'TaskFeed', component: TaskFeed, meta: { requiresAuth: true } }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('user')
//   if(to.meta.requiresAuth && !isAuthenticated) {
//     next({ name: 'Login' })
//   } else {
//     next()
//   }
// })

// export default router


const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'TaskFeed',
    component: TaskFeed,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router