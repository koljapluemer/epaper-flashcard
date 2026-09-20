import { createRouter, createWebHistory } from 'vue-router'
import SyncPage from '@/pages/sync/SyncPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: SyncPage }],
})
