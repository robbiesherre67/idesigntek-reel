import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WorkView from './views/WorkView.vue'
import ContactView from './views/ContactView.vue'

export default createRouter({
  history: createWebHistory('/portfolio/'), // <-- subfolder history base
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/work', name: 'work', component: WorkView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})