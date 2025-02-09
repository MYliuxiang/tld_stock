import { createRouter, createWebHistory } from 'vue-router'
import StockView from '../views/StockView.vue'
import StockDetailView from '@/views/StockDetailView.vue'

const routes = [
  {
    path: '/stock',
    component:StockView,
    name:'stock',
    props:true
  },
  {
    path: '/stockdetail',
    component:StockDetailView,
    name:'stockdetail',
    props:true
  },
  // {path: '/',redirect:'/stock'}

]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
