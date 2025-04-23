import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router' // Vue Router pour Vue 3
import App from './App.vue'
import axios from 'axios'
import routes from '@/routes'
import { useAuth } from '@/functions/useAuth'

// Création de l'application Vue
const app = createApp(App)

// Configuration de Vue Router (exemple basique)
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

// Garde de route globale
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, currentUser, hasRole } = useAuth()

  // Redirection si non authentifié
  if (to.meta.requiresAuth && !isAuthenticated.value && to.name !== 'login') {
    console.log('not authentified, redirecting to login')
    return next({ name: 'login' })
  }

  // Redirection si déjà authentifié
  if (isAuthenticated.value && to.name === 'login') {
    console.log('already authentified, redirecting to home')
    return next({ name: 'home' })
  }

  // Vérification des rôles
  // if (to.meta.roles && !to.meta.roles.some((role) => hasRole(role))) {
  //   return next('/home') // Ou une page 403
  // }

  next()
})

export default router

// Configuration d'Axios
app.config.globalProperties.$axios = axios

// Installation des plugins
app.use(router)

// Provide axios pour l'utilisation avec inject()
app.provide('axios', axios)

// Montage de l'application
app.mount('#app')
