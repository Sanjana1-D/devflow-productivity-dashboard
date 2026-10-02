import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'devflow.focus'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadFocus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayKey(), seconds: 0 }
    const parsed = JSON.parse(raw)
    if (parsed.date !== todayKey()) return { date: todayKey(), seconds: 0 }
    return { date: parsed.date, seconds: Number(parsed.seconds) || 0 }
  } catch {
    return { date: todayKey(), seconds: 0 }
  }
}

export function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatFocus(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function minutesToSeconds(minutes, fallback) {
  const parsed = Number(minutes)
  const safe = Number.isFinite(parsed) ? Math.min(180, Math.max(1, Math.round(parsed))) : fallback
  return safe * 60
}

export function useFocus(workMinutes = 25, breakMinutes = 5) {
  const workSeconds = minutesToSeconds(workMinutes, 25)
  const breakSeconds = minutesToSeconds(breakMinutes, 5)
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(workSeconds)
  const [running, setRunning] = useState(false)
  const [focusSecondsToday, setFocusSecondsToday] = useState(() => loadFocus().seconds)
  const modeRef = useRef(mode)
  const durationRef = useRef({ workSeconds, breakSeconds })
  const runningRef = useRef(running)
  modeRef.current = mode
  durationRef.current = { workSeconds, breakSeconds }
  runningRef.current = running

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: todayKey(), seconds: focusSecondsToday }),
    )
  }, [focusSecondsToday])

  useEffect(() => {
    if (!running) return undefined

    const id = window.setInterval(() => {
      if (modeRef.current === 'work') {
        setFocusSecondsToday((seconds) => seconds + 1)
      }
      setSecondsLeft((current) => (current > 1 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (runningRef.current) return
    setSecondsLeft(mode === 'work' ? workSeconds : breakSeconds)
  }, [workSeconds, breakSeconds, mode])

  useEffect(() => {
    if (secondsLeft !== 0) return
    setRunning(false)
    const nextMode = mode === 'work' ? 'break' : 'work'
    setMode(nextMode)
    setSecondsLeft(nextMode === 'work' ? durationRef.current.workSeconds : durationRef.current.breakSeconds)
  }, [secondsLeft, mode])

  function start() {
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(mode === 'work' ? durationRef.current.workSeconds : durationRef.current.breakSeconds)
  }

  function switchMode(next) {
    setRunning(false)
    setMode(next)
    setSecondsLeft(next === 'work' ? durationRef.current.workSeconds : durationRef.current.breakSeconds)
  }

  return {
    mode,
    secondsLeft,
    running,
    focusSecondsToday,
    workSeconds,
    breakSeconds,
    start,
    pause,
    reset,
    switchMode,
  }
}
