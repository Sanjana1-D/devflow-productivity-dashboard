import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'devflow.tasks'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback((title) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((current) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...current,
    ])
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }, [])

  return { tasks, addTask, toggleTask, deleteTask }
}
