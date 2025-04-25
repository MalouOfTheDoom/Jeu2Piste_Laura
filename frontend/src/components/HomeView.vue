<template>
  <div class="p-6">
    <!-- SECTION AFFICHAGE APOCALYPSE -->
    <div class="mt-10">
      <h2 class="text-3xl font-bold text-red-600">⚠️ Project X ⚠️</h2>

      <div class="mt-4 p-6 border-2 border-red-500 rounded-xl bg-red-50 text-red-900">
        <div v-if="!projectInfo?.timeStarted">
          <p class="text-lg font-medium">L'apocalypse va bientôt commencer...</p>
        </div>
        <div v-else>
          <div class="flex flex-row justify-around items-center gap-6">
            <div class="text-center">
              <p class="text-lg font-medium">⏳ Temps restant avant la fin du monde :</p>
              <p class="text-2xl font-bold my-1">
                {{ formatTime(timeRemaining) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-lg font-medium">🔥 Prochaine ville détruite dans :</p>
              <p class="text-2xl font-bold my-1">
                {{ formatTime(timeUntilNextCity) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Carte des villes détruites dans le cadre -->
        <div class="mt-10" v-if="projectInfo">
          <h3 class="text-xl font-bold mb-2">🗺️ Carte des villes détruites</h3>
          <div class="relative w-full max-w-5xl mx-auto" style="aspect-ratio: 80/51" ref="mapRef">
            <img
              src="@/assets/images/projet-x-map.png"
              class="absolute inset-0 w-full h-full object-contain"
              alt="Carte"
            />
            <div
              v-for="city in destroyedCities"
              :key="city"
              :style="computePosition(cityPositions[city].x, cityPositions[city].y)"
              class="absolute rounded-full bg-red-600 shadow-md"
              :class="{ explosion: true }"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <button
          @click="diffuseProject"
          class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          💣 Désamorcer la bombe
        </button>
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
import { useCityMap } from '@/functions/useCityMap'

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

// #region Map

const cityPositions: Record<string, { x: number; y: number }> = {
  //   Washington: { x: 0, y: 0 },
  Washington: { x: 476, y: 641 },
  //   Casablanca: { x: 1037, y: 695 },
  //   Tripoli: { x: 1204, y: 701 },
  //   Cairo: { x: 1349, y: 728 },
  //   Dhaka: { x: 1828, y: 785 },
  //   'Hong Kong': { x: 2021, y: 797 },
  //   Santiago: { x: 526, y: 1268 },
  //   Greenville: { x: 1025, y: 941 },
  //   Agadez: { x: 1183, y: 821 },
  //   Damascus: { x: 1391, y: 695 },
  //   Astana: { x: 1676, y: 500 },
  //   Novosibirsk: { x: 1766, y: 449 },
}

// const destroyedCities = computed(() => projectInfo.value?.citiesDestroyed ?? [])
const destroyedCities = computed(() => [
  'Washington',
  //   'Casablanca',
  //   'Tripoli',
  //   'Cairo',
  //   'Dhaka',
  //   'Hong Kong',
  //   'Santiago',
  //   'Greenville',
  //   'Agadez',
  //   'Damascus',
  //   'Astana',
  //   'Novosibirsk',
])

const mapRef = ref<HTMLElement | null>(null)
const { computePosition } = useCityMap(mapRef)

// #endregion

// #region action

const fetchProjectInfo = async () => {
  const { data } = await useAxios<ProjectX>('/checkProjectXInfos', { method: 'GET' }, axiosClient)
  projectInfo.value = data.value
}

const diffuseProject = async () => {
  console.log('Tentative de désamorçage...') // TODO: appeler l’API ici plus tard
  //   await useAxios('/diffuseProjectX', { method: 'POST' }, axiosClient)
  //   fetchProjectInfo()
}

// #endregion
</script>

<style @scoped>
@keyframes explosion {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(4); /* Augmentation de la taille */
    opacity: 0.7;
  }
  100% {
    transform: scale(1); /* Retour à la taille d'origine */
    opacity: 1;
  }
}

.explosion {
  animation: explosion 1s ease-out forwards; /* Plus long pour une meilleure explosion */
}
</style>
