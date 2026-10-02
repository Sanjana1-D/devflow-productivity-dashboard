import { CompletionProgress } from '../components/ProgressAndDuration.jsx'
import { formatClock, formatFocus } from '../hooks/useFocus.js'

export function Dashboard({
  tasks,
  displayName,
  onNavigate,
  onToggle,
  celebratingId,
  focusSecondsToday,
  running,
  secondsLeft,
  mode,
  workMinutes,
  breakMinutes,
}) {
  const total = tasks.length
  const done = tasks.filter((task) => task.completed).length
  const openTasks = tasks.filter((task) => !task.completed)
  const greeting = getGreeting()
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">{dateLabel}</p>
        <h1>
          {greeting}, {displayName}
        </h1>
        <p className="lede">A soft landing for your day — tasks, focus, and a little progress glow.</p>
      </header>

      <section className="summary-panel" aria-label="Productivity summary">
        <div className="summary-copy">
          <p className="eyebrow">Today</p>
          <h2>Productivity summary</h2>
          <p className="muted">Keep a gentle pace. Completion is the treat, not the rush.</p>
        </div>
        <div className="summary-metrics">
          <article className="metric metric-lilac">
            <span className="metric-icon" aria-hidden="true">
              ✦
            </span>
            <p className="stat-label">Total tasks</p>
            <p className="stat-value">{total}</p>
          </article>
          <article className="metric metric-mint">
            <span className="metric-icon" aria-hidden="true">
              ✓
            </span>
            <p className="stat-label">Completed tasks</p>
            <p className="stat-value">{done}</p>
          </article>
          <article className="metric metric-peach">
            <span className="metric-icon" aria-hidden="true">
              ◔
            </span>
            <p className="stat-label">Current focus time</p>
            <p className="stat-value">{formatFocus(focusSecondsToday)}</p>
            <p className="metric-sub">
              {running
                ? `${mode === 'work' ? 'Focus' : 'Break'} · ${formatClock(secondsLeft)} left`
                : 'Ready when you are'}
            </p>
          </article>
        </div>
        <CompletionProgress completed={done} total={total} />
      </section>

      <div className="dashboard-grid">
        <article className="card compact-card">
          <div className="card-heading">
            <h2>Next up</h2>
            <button type="button" className="link-btn" onClick={() => onNavigate('tasks')}>
              All tasks
            </button>
          </div>
          {openTasks.length === 0 ? (
            <p className="muted">Nothing waiting. Add a task and give the list a little sparkle.</p>
          ) : (
            <ul className="task-list compact">
              {openTasks.slice(0, 5).map((task) => (
                <li key={task.id} className={celebratingId === task.id ? 'celebrating' : ''}>
                  <label>
                    <input type="checkbox" checked={false} onChange={() => onToggle(task.id)} />
                    <span>{task.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card compact-card focus-preview">
          <h2>Focus booth</h2>
          <p className="focus-preview-time">{formatClock(secondsLeft)}</p>
          <p className="muted">
            {mode === 'work' ? `${workMinutes}-minute work session` : `${breakMinutes}-minute break`}
            {running ? ' in progress' : ' on deck'}
          </p>
          <button type="button" className="primary" onClick={() => onNavigate('focus')}>
            {running ? 'Open timer' : 'Start a session'}
          </button>
        </article>
      </div>
    </section>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
