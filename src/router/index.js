// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      { path: '/user_manage', component: () => import('../views/UserManage.vue') },
      { path: '/menu_manage', component: () => import('../views/MenuManage.vue') },
      { path: '/news_manage', component: () => import('../views/NewsManage.vue') },
      { path: '/team_manage', component: () => import('../views/TeamManage.vue') },
      { path: '/field_manage', component: () => import('../views/FieldManage.vue') },
      { path: '/product_manage', component: () => import('../views/ProductManage.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/admin/'), 
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router