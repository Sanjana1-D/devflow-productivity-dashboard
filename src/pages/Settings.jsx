import { DurationFields } from '../components/ProgressAndDuration.jsx'

export function Settings({ settings, onChange }) {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Preferences</p>
        <h1>Settings</h1>
        <p className="lede">Personalize DevFlow. Changes are saved in this browser.</p>
      </header>

      <article className="card settings-card">
        <label htmlFor="display-name">Display name</label>
        <input
          id="display-name"
          value={settings.displayName}
          onChange={(event) => onChange({ ...settings, displayName: event.target.value })}
        />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={settings.soundOnComplete}
            onChange={(event) =>
              onChange({ ...settings, soundOnComplete: event.target.checked })
            }
          />
          Play a sound when a timer session ends
        </label>
      </article>

      <article className="card settings-card">
        <h2>Focus timer</h2>
        <p className="muted">Default is 25 minutes of work and 5 minutes of break.</p>
        <DurationFields
          workMinutes={settings.workMinutes}
          breakMinutes={settings.breakMinutes}
          onChange={(next) => onChange({ ...settings, ...next })}
        />
      </article>
    </section>
  )
}
