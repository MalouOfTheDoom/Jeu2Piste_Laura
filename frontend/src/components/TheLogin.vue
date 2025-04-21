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
        <form class="space-y-6">
          <div>
            <input
              placeholder="Identifiant"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <div>
            <input
              placeholder="Mot de passe"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <div>
            <button
              type="submit"
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
import { ref } from 'vue'

// Déclaration des variables
const username = ref('')
const password = ref('')
const errorMessage = ref('')

// Fonction de connexion
const login = async () => {
  // try {
  //   // Envoi des informations de connexion au backend
  //   const response = await axios.post('http://localhost:3000/login', {
  //     username: username.value,
  //     password: password.value,
  //   });
  //   const token = response.data.token;
  //   const decoded = decodeToken(token);
  //   // Sauvegarde du token et du rôle dans le localStorage
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('role', decoded.role);
  //   // Redirection vers une page protégée
  //   // Exemple de redirection après connexion réussie
  //   // Utilise $router pour rediriger si tu utilises Vue Router
  //   window.location.href = '/protected';
  // } catch (error) {
  //   // Gestion des erreurs de connexion
  //   errorMessage.value = 'Nom d\'utilisateur ou mot de passe incorrect.';
  // }
}

// Fonction pour décoder le token JWT
const decodeToken = (token: string) => {
  const payload = token.split('.')[1]
  const decoded = JSON.parse(atob(payload))
  return decoded
}

import { onMounted } from 'vue'

// onMounted(() => {
//   const canvas = document.getElementById('matrix') as HTMLCanvasElement
//   const ctx = canvas.getContext('2d')

//   if (!ctx) return

//   canvas.height = window.innerHeight
//   canvas.width = window.innerWidth

//   const letters =
//     'アァイィウヴエカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
//   const fontSize = 14
//   const columns = canvas.width / fontSize
//   const drops = new Array(Math.floor(columns)).fill(1)

//   const draw = () => {
//     ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
//     ctx.fillRect(0, 0, canvas.width, canvas.height)

//     ctx.fillStyle = '#FFEA00' // Vert matrix
//     ctx.font = `${fontSize}px monospace`

//     for (let i = 0; i < drops.length; i++) {
//       const text = letters[Math.floor(Math.random() * letters.length)]
//       ctx.fillText(text, i * fontSize, drops[i] * fontSize)

//       if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
//         drops[i] = 0
//       }

//       drops[i]++
//     }
//   }

//   setInterval(draw, 33)
// })

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
      // Rare chance d'ajouter "JeSuisP." sur une colonne vide
      if (!specialSequences[i] && Math.random() > 0.7) {
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
