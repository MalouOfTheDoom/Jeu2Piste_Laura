const routes = [
  {
    path: '/',
    component: () => import('@/components/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/components/HomeView.vue'),
        meta: { roles: ['user', 'admin'] },
      },
      // {
      //   path: 'admin',
      //   name: 'admin',
      //   component: () => import('@/components/AdminView.vue'),
      //   meta: { roles: ['admin'] },
      // },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/TheLogin.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export default routes
