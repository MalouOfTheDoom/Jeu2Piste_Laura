<template>
  <div class="relative min-h-screen bg-white overflow-hidden">
    <!-- Canvas Matrix -->
    <canvas id="matrix" class="absolute inset-0 w-full h-full z-0"></canvas>

    <!-- Login Container -->
    <div class="relative z-10 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-40 w-auto" src="@/assets/images/nonXLogo.png" alt="X Logo" />
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <input
              v-model="username"
              placeholder="Identifiant"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <div>
            <input
              v-model="password"
              placeholder="Mot de passe"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <div>
            <button
              @click="handleLogin"
              class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enter The Apocalypse
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useAuth } from '@/functions/useAuth.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const { login, isAuthenticated } = useAuth()

// Déclaration des variables
const username = ref('')
const password = ref('')

async function handleLogin() {
  await login({ username: username.value, password: password.value })
}

// Background canvas draw function
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
        specialSequences[i] = { text: 'Je Suis Pascal', index: 0 }
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
</script>
