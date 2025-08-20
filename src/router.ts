// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/work', name: 'work', component: () => import('@/views/WorkView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  // Uses Vite's base. Set base to "/idesigntek-reel/" in vite.config.ts for subfolder deploys.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition           // back/forward restores
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 0 } // hash anchors
    return { top: 0 }
  },
})

export default router