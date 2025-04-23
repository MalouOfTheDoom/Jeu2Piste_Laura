// projectXState.ts
let projectX = {
  isStarted: false,
  timeStarted: null,
  timeDiffused: null,
  durationMinutes: 60,
  destroyCityInterval: 5,
  cities: ['Tokyo', 'Paris', 'New York', 'Moscow', 'London'],
}

export function getProjectX() {
  return projectX
}

export function getProjectXInfos() {
  const now = Date.now()
  const timeStarted = projectX.timeStarted
  const durationMs = projectX.durationMinutes * 60 * 1000
  const citiesDestroyed = []
  if (projectX.isStarted && timeStarted) {
    const elapsed = now - timeStarted
    const cityIntervalMs = projectX.destroyCityInterval * 60 * 1000
    const citiesToDestroy = Math.floor(elapsed / cityIntervalMs)
    citiesDestroyed.push(...projectX.cities.slice(0, citiesToDestroy))
  }
  return {
    isTicking: projectX.isStarted,
    timeRemaining:
      projectX.isStarted && timeStarted
        ? Math.max(0, Math.floor((durationMs - (now - timeStarted)) / 1000))
        : projectX.durationMinutes * 60,
    citiesDestroyed,
    totalCities: projectX.cities.length,
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
}

export function diffuseProjectX() {
  projectX.timeDiffused = Date.now()
}
