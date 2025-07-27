import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'hotel',
    component: () => import('../views/hotelView.vue')
  },
  {
    path: '/cliente',
    name: 'cliente',    
    component: () => import('../views/cliente/IndexView.vue')
  },
  {
    path: '/about',
    name: 'about',    
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
