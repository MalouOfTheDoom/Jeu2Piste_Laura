<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">Project X Control Panel</h1>

    <div class="mt-4">
      <button @click="startProject" class="btn">Start ProjectX</button>
      <button @click="cancelProject" class="btn ml-2">Cancel</button>
      <button @click="diffuseProject" class="btn ml-2">Diffuse</button>
    </div>

    <div v-if="projectInfo" class="mt-6">
      <h2 class="text-xl font-semibold">ProjectX Status</h2>
      <p><strong>Ticking:</strong> {{ projectInfo.isTicking }}</p>
      <p><strong>Time remaining:</strong> {{ projectInfo.timeRemaining }} seconds</p>
      <p><strong>Destroyed cities:</strong> {{ projectInfo.citiesDestroyed.join(', ') }}</p>
      <p><strong>Total cities:</strong> {{ projectInfo.totalCities }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import axiosClient from '@/axiosClient'

const projectInfo = ref<null | {
  isTicking: boolean
  timeRemaining: number
  citiesDestroyed: string[]
  totalCities: number
}>(null)

const fetchProjectInfo = async () => {
  const { data } = await useAxios('/checkProjectXInfos', { method: 'GET' }, axiosClient)
  projectInfo.value = data.value
}

const startProject = async () => {
  await useAxios('startProjectX', { method: 'POST' }, axiosClient)
  fetchProjectInfo()
}

const cancelProject = async () => {
  await useAxios('/cancelProjectX', { method: 'POST' }, axiosClient)
  fetchProjectInfo()
}

const diffuseProject = async () => {
  await useAxios('/diffuseProjectX', { method: 'POST' }, axiosClient)
  fetchProjectInfo()
}

// Initial fetch
fetchProjectInfo()
</script>
