import { useEffect, useRef } from 'react'
import { DurationFields } from '../components/ProgressAndDuration.jsx'
import { formatClock } from '../hooks/useFocus.js'

export function FocusTimer({
  mode,
  secondsLeft,
  running,
  soundOnComplete,
  onStart,
  onPause,
  onReset,
  onSwitchMode,
  workMinutes,
  breakMinutes,
  onChangeDurations,
  workSeconds,
  breakSeconds,
}) {
  const prevSeconds = useRef(secondsLeft)

  useEffect(() => {
    if (prevSeconds.current > 0 && secondsLeft === 0 && soundOnComplete) {
      playChime()
    }
    prevSeconds.current = secondsLeft
  }, [secondsLeft, soundOnComplete])

  const total = mode === 'work' ? workSeconds : breakSeconds
  const progress = total === 0 ? 0 : 1 - secondsLeft / total

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Pomodoro</p>
        <h1>Focus timer</h1>
        <p className="lede">
          Defaults are 25 minutes of work and a 5-minute break. Edit the lengths anytime.
        </p>
      </header>

      <article className="card timer-card">
        <div className="blob blob-peach" aria-hidden="true" />
        <div className="blob blob-mint" aria-hidden="true" />
        <div className="mode-switch" role="tablist" aria-label="Timer mode">
          <button
            type="button"
            className={mode === 'work' ? 'active' : ''}
            onClick={() => onSwitchMode('work')}
          >
            Work · {workMinutes} min
          </button>
          <button
            type="button"
            className={mode === 'break' ? 'active' : ''}
            onClick={() => onSwitchMode('break')}
          >
            Break · {breakMinutes} min
          </button>
        </div>

        <div
          className="ring"
          style={{
            background: `conic-gradient(var(--accent) ${progress * 360}deg, var(--ring-track) 0deg)`,
          }}
        >
          <div className="ring-inner">
            <p className="timer-mode">{mode === 'work' ? 'Focus' : 'Break'}</p>
            <p className="timer-display">{formatClock(secondsLeft)}</p>
          </div>
        </div>

        <div className="timer-actions">
          {running ? (
            <button type="button" className="primary" onClick={onPause}>
              Pause
            </button>
          ) : (
            <button type="button" className="primary" onClick={onStart}>
              Start
            </button>
          )}
          <button type="button" className="ghost" onClick={onReset}>
            Reset
          </button>
        </div>
      </article>

      <article className="card compact-card duration-card">
        <h2>Custom session length</h2>
        <p className="muted">
          {running
            ? 'Pause or reset the timer to apply a new length.'
            : 'Changes apply immediately and are saved in this browser.'}
        </p>
        <DurationFields
          workMinutes={workMinutes}
          breakMinutes={breakMinutes}
          disabled={running}
          onChange={onChangeDurations}
        />
      </article>
    </section>
  )
}

function playChime() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return
  const ctx = new AudioContextClass()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.08
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.25)
}
