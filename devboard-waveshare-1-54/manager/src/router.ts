import { createRouter, createWebHistory } from 'vue-router'
import StatsPage from '@/pages/stats/StatsPage.vue'
import SyncPage from '@/pages/sync/SyncPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: SyncPage },
    { path: '/stats', component: StatsPage },
  ],
})
