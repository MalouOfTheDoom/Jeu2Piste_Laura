const cities = ['Tokyo', 'Paris', 'New York', 'Moscow', 'London']

// projectXState.js
let projectX = {
  isStarted: false,
  timeStarted: null,
  timeDiffused: null,
  citiesDestroyed: [],
  durationMinutes: 60,
  destroyCityIntervalMinutes: 0.25,
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
  projectX.isStarted = true
  projectX.timeStarted = Date.now()
}

export function cancelProjectX() {
  projectX.isStarted = false
  projectX.timeStarted = null
  projectX.timeDiffused = null
  projectX.citiesDestroyed = []
}

export function diffuseProjectX() {
  projectX.timeDiffused = Date.now()
}
