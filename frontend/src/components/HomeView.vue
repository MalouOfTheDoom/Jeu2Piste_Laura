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
      <p>{{ projectInfo }}</p>
    </div>

    <!-- SECTION AFFICHAGE APOCALYPSE -->
    <div class="mt-10">
      <h2 class="text-3xl font-bold text-red-600">⚠️ Project X ⚠️</h2>

      <div class="mt-4 p-6 border-2 border-red-500 rounded-xl bg-red-50 text-red-900">
        <div v-if="!projectInfo?.timeStarted">
          <p class="text-lg font-medium">L'apocalypse va bientôt commencer...</p>
        </div>
        <div v-else>
          <p class="text-lg font-medium">⏳ Temps restant avant la fin du monde :</p>
          <p class="text-2xl font-bold my-1">
            {{ formatTime(timeRemaining) }}
          </p>

          <p class="text-lg font-medium mt-4">🔥 Prochaine ville détruite dans :</p>
          <p class="text-xl font-semibold my-1">
            {{ formatTime(timeUntilNextCity) }}
          </p>

          <p class="mt-6 font-semibold">🏙️ Villes détruites :</p>
          <ul class="list-disc list-inside">
            <li v-for="city in projectInfo.citiesDestroyed" :key="city">{{ city }}</li>
            <li v-if="projectInfo.citiesDestroyed.length === 0">Aucune pour l'instant.</li>
          </ul>
        </div>

        <button class="btn mt-6" @click="diffuseProject">💣 Désamorcer la bombe</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import axiosClient from '@/axiosClient'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import { watch } from 'vue'
import sleep from '@/functions/sleep'

type ProjectX = {
  isStarted: boolean
  timeStarted: number | null
  timeDiffused: number | null
  durationMinutes: number
  destroyCityIntervalMinutes: number
  citiesDestroyed: string[]
  totalCities: number
}

const projectInfo = ref<undefined | ProjectX>(undefined)

// #region Timer and auto-refetch logic
let intervalId: ReturnType<typeof setInterval>
let fetchIntervalId: ReturnType<typeof setInterval>

const setupIntervals = () => {
  // Met à jour "now" toutes les secondes pour recalculer les compteurs
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  // Refetch les données toutes les 10 secondes
  fetchIntervalId = setInterval(fetchProjectInfo, 10000)
}

onMounted(() => {
  fetchProjectInfo()
  setupIntervals()
})

onUnmounted(() => {
  clearInterval(intervalId)
  clearInterval(fetchIntervalId)
})

// Reset intervals when project state changes
watch(
  projectInfo,
  () => {
    clearInterval(fetchIntervalId)
    setupIntervals()
  },
  { deep: true },
)

// #endregion

// #region Compute times

const now = ref(Date.now())

const formatTime = (seconds: number | null): string => {
  if (!seconds) return `__:__`
  const hrs = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  const sec = Math.floor(seconds % 60)

  return `${hrs}h ${min.toString().padStart(2, '0')}m ${sec.toString().padStart(2, '0')}s`
}

const timeRemaining = computed(() => {
  if (
    !projectInfo.value ||
    !projectInfo.value.isStarted ||
    !projectInfo.value.timeStarted ||
    projectInfo.value.timeDiffused
  ) {
    return null
  }

  const elapsedSeconds = (now.value - projectInfo.value.timeStarted) / 1000
  const totalDurationSeconds = projectInfo.value.durationMinutes * 60
  return Math.max(0, Math.floor(totalDurationSeconds - elapsedSeconds))
})

const timeUntilNextCity = computed(() => {
  if (!projectInfo.value || timeRemaining.value === null) return null

  const intervalSeconds = projectInfo.value.destroyCityIntervalMinutes * 60
  return timeRemaining.value % intervalSeconds
})

// Watch for timers reaching 0
watch([timeRemaining, timeUntilNextCity], async ([remaining, nextCity]) => {
  await sleep(1000)
  if (remaining === 0 || nextCity === 0) {
    fetchProjectInfo()
  }
})

// #endregion

// #region action

const fetchProjectInfo = async () => {
  const { data } = await useAxios<ProjectX>('/checkProjectXInfos', { method: 'GET' }, axiosClient)
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
  console.log('Tentative de désamorçage...') // TODO: appeler l’API ici plus tard
  //   await useAxios('/diffuseProjectX', { method: 'POST' }, axiosClient)
  //   fetchProjectInfo()
}

// #endregion
</script>
