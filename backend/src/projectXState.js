import dotenv from 'dotenv'
dotenv.config()

const cities = [
  'Washington',
  'Casablanca',
  'Tripoli',
  'Cairo',
  'Dhaka',
  'Hong Kong',
  'Santiago',
  'Greenville',
  'Agadez',
  'Damascus',
  'Astana',
  'Novosibirsk',
]

const destroyCityIntervalMinutes = 0.05

// projectXState.js
let projectX = {
  isStarted: false,
  timeStarted: null,
  timeDiffused: null,
  citiesDestroyed: [],
  destroyCityIntervalMinutes: destroyCityIntervalMinutes,
  durationMinutes: destroyCityIntervalMinutes * cities.length,
  totalCities: cities.length,
}

export function getProjectX() {
  return projectX
}

export function getProjectXInfos() {
  const now = Date.now()
  const timeStarted = projectX.timeStarted

  if (projectX.isStarted && timeStarted && !projectX.timeDiffused) {
    const cityIntervalMs = projectX.destroyCityIntervalMinutes * 60 * 1000
    const elapsed = now - timeStarted

    // Nombre total de destructions qui auraient dû se produire
    const totalDestructions = Math.floor(elapsed / cityIntervalMs)

    // Nombre de nouvelles destructions depuis le dernier calcul
    const newDestructions = Math.min(
      totalDestructions - projectX.citiesDestroyed.length,
      cities.length - projectX.citiesDestroyed.length
    )

    // Ajout des nouvelles villes détruites dans l'ordre du tableau
    if (newDestructions > 0) {
      const nextCities = cities
        .filter((city) => !projectX.citiesDestroyed.includes(city))
        .slice(0, newDestructions)
      projectX.citiesDestroyed.push(...nextCities)
    }

    // Si toutes les villes sont détruites, on peut éventuellement désactiver le projet
    if (projectX.citiesDestroyed.length >= cities.length) {
      projectX.isStarted = false
    }
  }

  return {
    ...projectX,
  }
}

export function startProjectX() {
  cancelProjectX()
  projectX.isStarted = true
  projectX.timeStarted = Date.now()
}

export function cancelProjectX() {
  projectX.isStarted = false
  projectX.timeStarted = null
  projectX.timeDiffused = null
  projectX.citiesDestroyed = []
}

const DISARM_CODE = process.env.DISARM_CODE || null // Assuming it's coming from .env

export function diffuseProjectX(disarmCode) {
  if (!DISARM_CODE) {
    console.error('Invalid disarm code format in .env')
    return false
  }

  // Split DISARM_CODE and input code by the dash
  const [correctCity, correctCode] = DISARM_CODE.trim().toLowerCase().split('-')
  const [inputCity, inputCode] = disarmCode.trim().toLowerCase().split('-')

  if (!inputCity || !inputCode) {
    console.error('Invalid input code format')
    return false
  }

  // Case-insensitive city comparison
  if (inputCity !== correctCity) {
    return false
  }

  // Allow a ±3 difference in the code number
  const correctNumber = parseInt(correctCode, 10)
  const inputNumber = parseInt(inputCode, 10)
  const diff = Math.abs(correctNumber - inputNumber)

  if (diff <= 3) {
    projectX.timeDiffused = Date.now() // Diffuse the project
    return true
  } else {
    return false
  }
}
