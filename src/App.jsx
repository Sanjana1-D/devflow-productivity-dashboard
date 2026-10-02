import { useState } from 'react'
import { Sidebar } from './components/Sidebar.jsx'
import { useFocus } from './hooks/useFocus.js'
import { useSettings } from './hooks/useSettings.js'
import { useTasks } from './hooks/useTasks.js'
import { Dashboard } from './pages/Dashboard.jsx'
import { FocusTimer } from './pages/FocusTimer.jsx'
import { Settings } from './pages/Settings.jsx'
import { Tasks } from './pages/Tasks.jsx'
import './App.css'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [celebratingId, setCelebratingId] = useState(null)
  const { tasks, addTask, toggleTask, deleteTask } = useTasks()
  const { settings, setSettings } = useSettings()
  const focus = useFocus(settings.workMinutes, settings.breakMinutes)

  function updateDurations(next) {
    setSettings({ ...settings, ...next })
  }

  function navigate(next) {
    setPage(next)
    setMenuOpen(false)
  }

  function handleToggle(id) {
    const task = tasks.find((item) => item.id === id)
    if (task && !task.completed) {
      setCelebratingId(id)
      window.setTimeout(() => {
        setCelebratingId((current) => (current === id ? null : current))
      }, 700)
    }
    toggleTask(id)
  }

  return (
    <div className="app-shell">
      <div className="ambiance" aria-hidden="true">
        <span className="glow glow-lilac" />
        <span className="glow glow-peach" />
        <span className="glow glow-mint" />
      </div>
      <Sidebar page={page} onNavigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <p>DevFlow</p>
        </header>
        {page === 'dashboard' && (
          <Dashboard
            tasks={tasks}
            displayName={settings.displayName}
            onNavigate={navigate}
            onToggle={handleToggle}
            celebratingId={celebratingId}
            focusSecondsToday={focus.focusSecondsToday}
            running={focus.running}
            secondsLeft={focus.secondsLeft}
            mode={focus.mode}
            workMinutes={settings.workMinutes}
            breakMinutes={settings.breakMinutes}
          />
        )}
        {page === 'tasks' && (
          <Tasks
            tasks={tasks}
            onAdd={addTask}
            onToggle={handleToggle}
            onDelete={deleteTask}
            celebratingId={celebratingId}
          />
        )}
        {page === 'focus' && (
          <FocusTimer
            mode={focus.mode}
            secondsLeft={focus.secondsLeft}
            running={focus.running}
            soundOnComplete={settings.soundOnComplete}
            onStart={focus.start}
            onPause={focus.pause}
            onReset={focus.reset}
            onSwitchMode={focus.switchMode}
            workMinutes={settings.workMinutes}
            breakMinutes={settings.breakMinutes}
            workSeconds={focus.workSeconds}
            breakSeconds={focus.breakSeconds}
            onChangeDurations={updateDurations}
          />
        )}
        {page === 'settings' && <Settings settings={settings} onChange={setSettings} />}
      </div>
    </div>
  )
}
