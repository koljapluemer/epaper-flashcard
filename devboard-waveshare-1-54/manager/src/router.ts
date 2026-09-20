import { createRouter, createWebHistory } from 'vue-router'
import SettingsPage from '@/pages/settings/SettingsPage.vue'
import StatsPage from '@/pages/stats/StatsPage.vue'
import SyncPage from '@/pages/sync/SyncPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: SyncPage },
    { path: '/stats', component: StatsPage },
    { path: '/settings', component: SettingsPage },
  ],
})
