// src/composables/useAuth.ts
import { ref, computed, onMounted } from 'vue'
import { useLocalStorage, useStorage, StorageSerializers } from '@vueuse/core'
import { strHash } from '@/functions/strHash'
import { useRouter } from 'vue-router'

type Role = 'user' | 'admin'

type User = {
  username: string
  passwordHash: string
  role: Role
}

// Store only these minimal credentials
type StoredCredentials = {
  username: string
  passwordHash: string
} | null

// Full user object available after matching credentials
type AuthUser = User | null

const knownUsers = ref<User[]>()

// Initialize users asynchronously
const initUsers = async () => {
  knownUsers.value = [
    {
      username: 'sombregore',
      passwordHash: await strHash('malicenight'),
      role: 'user',
    },
    {
      username: 'admin',
      passwordHash: await strHash('limacevelue'),
      role: 'admin',
    },
  ]
}

await initUsers()

export function useAuth() {
  const router = useRouter()
  initUsers()

  // Only store these minimal creds in localStorage
  // bind object with default null value
  const storedCreds = useStorage<StoredCredentials>('auth_credentials', null, undefined, {
    serializer: StorageSerializers.object,
  })

  // Derive the actual user from known users
  const currentUser = computed<AuthUser>(() => {
    if (!storedCreds.value) return null
    return (
      knownUsers.value?.find(
        (u) =>
          u.username === storedCreds.value?.username &&
          u.passwordHash === storedCreds.value?.passwordHash,
      ) ?? null
    )
  })

  // Fonction de login
  const login = async (credentials: { username: string; password: string }) => {
    const { username, password } = credentials
    const inputUsername = username.trim().toLowerCase()
    const inputPassword = password.trim().toLowerCase() // In this case, the players do not have information about password capitalization.

    if (!inputUsername || !inputPassword) {
      throw new Error('Username and password are required')
    }

    const inputHash = await strHash(inputPassword)
    const user = knownUsers.value?.find(
      (u) => u.username.toLowerCase() === inputUsername && u.passwordHash === inputHash,
    )

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Store only minimal credentials
    storedCreds.value = {
      username: user.username,
      passwordHash: user.passwordHash,
    }

    // console.log('User logged in, redirecting to home page.')
    // router.push({ name: 'home' })
    // return true

    // Redirect based on role
    const targetRoute = user.role === 'admin' ? 'admin' : 'home'
    console.log(`User logged in as ${user.role}, redirecting to ${targetRoute}`)
    router.push({ name: targetRoute })
    return true
  }

  // Fonction de logout
  const logout = () => {
    storedCreds.value = null
    console.log('User logged out, redirecting to login page.')
    router.push({ name: 'login' })
  }

  // Vérifie si l'utilisateur est authentifié
  const isAuthenticated = computed(() => currentUser.value !== null)

  // Vérifie les rôles
  const hasRole = (role: Role): boolean => currentUser.value?.role === role

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    hasRole,
    login,
    logout,
  }
}
