export function clampMinutes(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(180, Math.max(1, Math.round(parsed)))
}

export function CompletionProgress({ completed, total }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="completion-progress">
      <div className="completion-progress-copy">
        <p className="completion-percent">{percent}%</p>
        <div>
          <p className="completion-title">Tasks completed</p>
          <p className="muted">
            {total === 0 ? 'Add a task to start tracking progress.' : `${completed} of ${total} tasks done`}
          </p>
        </div>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Percentage of completed tasks"
      >
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export function DurationFields({ workMinutes, breakMinutes, onChange, disabled }) {
  return (
    <div className="duration-fields">
      <label htmlFor="work-minutes">
        Work (minutes)
        <input
          id="work-minutes"
          type="number"
          min="1"
          max="180"
          value={workMinutes}
          disabled={disabled}
          onChange={(event) => onChange({ workMinutes: clampMinutes(event.target.value, 25) })}
        />
      </label>
      <label htmlFor="break-minutes">
        Break (minutes)
        <input
          id="break-minutes"
          type="number"
          min="1"
          max="180"
          value={breakMinutes}
          disabled={disabled}
          onChange={(event) => onChange({ breakMinutes: clampMinutes(event.target.value, 5) })}
        />
      </label>
      <button
        type="button"
        className="ghost"
        disabled={disabled}
        onClick={() => onChange({ workMinutes: 25, breakMinutes: 5 })}
      >
        Reset to 25 / 5
      </button>
    </div>
  )
}
