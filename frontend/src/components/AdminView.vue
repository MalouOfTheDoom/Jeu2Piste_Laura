<template>
  <h1 class="text-2xl font-bold">Project X Control Panel</h1>

  <div class="mt-4 flex gap-4">
    <button
      @click="startProject"
      class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Start ProjectX
    </button>
    <button
      @click="cancelProject"
      class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Cancel
    </button>
    <button
      @click="diffuseProject"
      class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Diffuse
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAxios } from '@vueuse/integrations/useAxios'
import axiosClient from '@/axiosClient'

// #region action

const startProject = async () => {
  await useAxios('startProjectX', { method: 'POST' }, axiosClient)
}

const cancelProject = async () => {
  await useAxios('/cancelProjectX', { method: 'POST' }, axiosClient)
}

const diffuseProject = async () => {
  console.log('Tentative de désamorçage...') // TODO: appeler l’API ici plus tard
  //   await useAxios('/diffuseProjectX', { method: 'POST' }, axiosClient)
  //   fetchProjectInfo()
}

// #endregion
</script>
