<template>
  <h1 class="text-2xl font-bold">Project X Control Panel</h1>

  <div class="mt-4">
    <button @click="startProject" class="btn">Start ProjectX</button>
    <button @click="cancelProject" class="btn ml-2">Cancel</button>
    <button @click="diffuseProject" class="btn ml-2">Diffuse</button>
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
