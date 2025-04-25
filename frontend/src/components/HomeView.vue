<template>
  <div class="relative min-h-screen bg-white overflow-hidden">
    <!-- Canvas Matrix -->
    <canvas id="matrix" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- Container -->
    <div
      class="relative z-10 flex min-h-full flex-1 flex-col justify-center px-2 lg:px-6 py-2 lg:py-4 lg:px-8"
    >
      <div class="p-1 lg:p-6">
        <!-- ADMIN CONTROL -->
        <div
          v-if="hasRole('admin')"
          class="mb-6 p-6 bg-gray-800 rounded-lg shadow-xl border-2 border-red-600"
        >
          <h1 class="text-2xl font-bold text-white">Contrôles Admin</h1>
          <div class="mt-4 flex gap-6">
            <button
              @click="startProject"
              class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              Start ProjectX
            </button>
            <button
              @click="cancelProject"
              class="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              Cancel Project X
            </button>
          </div>
        </div>

        <!-- SECTION AFFICHAGE APOCALYPSE -->
        <div class="mt-2">
          <div class="mt-2 flex justify-center">
            <h3
              class="bg-red-200 text-3xl font-extrabold text-red-700 tracking-wider drop-shadow-md animate-pulse px-4 py-1 rounded"
            >
              ⚠️ PROJECT X ⚠️
            </h3>
          </div>

          <div class="mt-4 p-1 lg:p-6 border-2 border-red-500 rounded-xl bg-red-50 text-red-900">
            <div v-if="!projectInfo?.timeStarted">
              <p class="text-lg font-medium text-center">L'apocalypse va bientôt commencer... 😈</p>
            </div>

            <div v-else-if="allCitiesDestroyed">
              <p class="text-lg font-medium text-center">Le monde est détruit hehe 😈</p>
            </div>

            <div v-else-if="projectInfo?.timeDiffused">
              <p class="text-lg font-medium text-center">Bombes désactivées ! 😟</p>
            </div>

            <div v-else>
              <div>
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
                <div
                  class="relative w-full max-w-5xl mx-auto"
                  style="aspect-ratio: 80/51"
                  ref="mapRef"
                >
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
          </div>

          <div
            class="flex justify-center mt-4"
            v-if="projectInfo?.timeStarted && !allCitiesDestroyed && !projectInfo?.timeDiffused"
          >
            <button
              @click="openDisarmPopup"
              class="rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              💣 Désamorcer la bombe
            </button>
          </div>
        </div>

        <!-- DISARM POPUP -->
        <div
          v-if="showPopup"
          class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
            <h2 class="text-xl font-bold text-red-600">Désamorçage</h2>
            <!-- City Input -->
            <input
              type="text"
              v-model="disarmCity"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ville"
            />

            <!-- Disarm Code Input -->
            <input
              type="text"
              v-model="disarmCode"
              class="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Code (4 chiffres)"
            />

            <div class="flex justify-end gap-2 mt-4">
              <button class="px-4 py-2 rounded bg-gray-200" @click="cancelDisarm">Annuler</button>
              <button class="px-4 py-2 rounded bg-red-600 text-white" @click="confirmDisarm">
                Valider
              </button>
            </div>
          </div>
        </div>
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
import { useAuth } from '@/functions/useAuth'
const { isAuthenticated, currentUser, hasRole } = useAuth()

type ProjectX = {
  isStarted: boolean
  timeStarted: number | null
  timeDiffused: number | null
  durationMinutes: number
  destroyCityIntervalMinutes: number
  citiesDestroyed: string[]
  totalCities: number
}

// const projectInfo = ref<undefined | ProjectX>(undefined)
const { data: projectInfo, execute: fetchProjectInfo } = useAxios<ProjectX | undefined>(
  '/checkProjectXInfos',
  { method: 'GET' },
  axiosClient,
)

const allCitiesDestroyed = computed(() => {
  return projectInfo.value?.citiesDestroyed.length === projectInfo.value?.totalCities
})

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
  Washington: { x: 476, y: 641 },
  Casablanca: { x: 1037, y: 695 },
  Tripoli: { x: 1204, y: 701 },
  Cairo: { x: 1349, y: 728 },
  Dhaka: { x: 1828, y: 785 },
  'Hong Kong': { x: 2021, y: 797 },
  Santiago: { x: 526, y: 1268 },
  Greenville: { x: 1025, y: 941 },
  Agadez: { x: 1183, y: 821 },
  Damascus: { x: 1391, y: 695 },
  Astana: { x: 1676, y: 500 },
  Novosibirsk: { x: 1766, y: 449 },
}

const destroyedCities = computed(() => projectInfo.value?.citiesDestroyed ?? [])
// const destroyedCities = computed(() => [
//   'Washington',
//     'Casablanca',
//     'Tripoli',
//     'Cairo',
//     'Dhaka',
//     'Hong Kong',
//     'Santiago',
//     'Greenville',
//     'Agadez',
//     'Damascus',
//     'Astana',
//     'Novosibirsk',
// ])

const mapRef = ref<HTMLElement | null>(null)
const { computePosition } = useCityMap(mapRef)

// #endregion

// #region action

const showPopup = ref(false)
const disarmCode = ref('')
const disarmCity = ref('')

const openDisarmPopup = () => {
  showPopup.value = true
  disarmCity.value = '' // Reset city input
  disarmCode.value = '' // Reset code input
}

const cancelDisarm = () => {
  showPopup.value = false
  disarmCity.value = ''
  disarmCode.value = ''
}

const confirmDisarm = async () => {
  if (!disarmCity.value || !disarmCode.value) {
    alert('Veuillez entrer le nom de la ville et le code de désactivation.')
    return
  }

  // Send the request to the backend with city and disarm code
  try {
    const response = await useAxios<{ success: boolean; message?: string }>(
      '/diffuseProjectX',
      {
        method: 'POST',
        data: {
          disarmCode: `${disarmCity.value}-${disarmCode.value}`, // Send city
        },
      },
      axiosClient,
    )
    if (response.data.value.message) {
      alert(response.data.value.message)
    }
    showPopup.value = false
    fetchProjectInfo() // Fetch the updated project info
  } catch (e: any) {
    alert(e.response.data.message)
  }
}

const startProject = async () => {
  await useAxios('startProjectX', { method: 'POST' }, axiosClient)
  fetchProjectInfo()
}

const cancelProject = async () => {
  await useAxios('/cancelProjectX', { method: 'POST' }, axiosClient)
  fetchProjectInfo()
}

// #endregion

// #region matrix

onMounted(() => {
  const canvas = document.getElementById('matrix') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  canvas.height = window.innerHeight
  canvas.width = window.innerWidth

  const letters =
    'アァイィウヴエカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = new Array(columns).fill(1)

  const specialSequences: Record<number, { text: string; index: number }> = {}

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#FFEA00'
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      // Rare chance d'ajouter "Je Suis Pascal" sur une colonne vide
      if (!specialSequences[i] && Math.random() > 0.9) {
        specialSequences[i] = { text: 'Pomodoy', index: 0 }
      }

      let char
      if (specialSequences[i]) {
        char = specialSequences[i].text[specialSequences[i].index]
        specialSequences[i].index++

        // Supprimer une fois terminé
        if (specialSequences[i].index >= specialSequences[i].text.length) {
          delete specialSequences[i]
        }
      } else {
        char = letters[Math.floor(Math.random() * letters.length)]
      }

      ctx.fillText(char, i * fontSize, drops[i] * fontSize)

      // Remet à zéro aléatoirement
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }

      drops[i]++
    }
  }

  setInterval(draw, 33)
})
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
