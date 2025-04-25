<template>
  <div class="main-layout">
    <header class="header-bar flex justify-between items-center px-4 py-1 bg-black text-white">
      <div class="flex gap-1">
        <span>{{ currentUser?.username }}</span>
        <span v-show="hasRole('admin')">(admin)</span>
      </div>
      <div class="ml-auto">
        <button
          @click="logout"
          class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Déconnexion
        </button>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/functions/useAuth'

const { logout, currentUser, hasRole } = useAuth()
</script>

<style scoped>
/* .header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #4f4c4cf2;
} */
</style>
