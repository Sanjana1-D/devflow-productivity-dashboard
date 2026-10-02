import { useEffect, useState } from 'react'

const STORAGE_KEY = 'devflow.settings'

const defaults = {
  displayName: 'Developer',
  soundOnComplete: true,
  workMinutes: 25,
  breakMinutes: 5,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return defaults
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return { settings, setSettings }
}
