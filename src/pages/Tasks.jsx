import { useState } from 'react'
import { CompletionProgress } from '../components/ProgressAndDuration.jsx'

export function Tasks({ tasks, onAdd, onToggle, onDelete, celebratingId }) {
  const [title, setTitle] = useState('')
  const open = tasks.filter((task) => !task.completed)
  const done = tasks.filter((task) => task.completed)
  const total = tasks.length

  function handleSubmit(event) {
    event.preventDefault()
    onAdd(title)
    setTitle('')
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Project management</p>
        <h1>Tasks</h1>
        <p className="lede">Tiny checkboxes, big relief. Your list stays here after refresh.</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="task-title">
          New task
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task…"
          autoComplete="off"
        />
        <button type="submit" className="primary" disabled={!title.trim()}>
          Add task
        </button>
      </form>

      <CompletionProgress completed={done.length} total={total} />

      {total === 0 ? (
        <article className="card empty">
          <p>No tasks yet. Add your first one above.</p>
        </article>
      ) : (
        <div className="task-groups">
          <TaskGroup
            title={`To do · ${open.length}`}
            tasks={open}
            onToggle={onToggle}
            onDelete={onDelete}
            celebratingId={celebratingId}
          />
          <TaskGroup
            title={`Done · ${done.length}`}
            tasks={done}
            onToggle={onToggle}
            onDelete={onDelete}
            celebratingId={celebratingId}
          />
        </div>
      )}
    </section>
  )
}

function TaskGroup({ title, tasks, onToggle, onDelete, celebratingId }) {
  if (tasks.length === 0) return null

  return (
    <article className="card compact-card">
      <h2>{title}</h2>
      <ul className="task-list compact">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`${task.completed ? 'completed' : ''} ${celebratingId === task.id ? 'celebrating' : ''}`}
          >
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
              />
              <span>{task.title}</span>
            </label>
            <button
              type="button"
              className="ghost danger"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete ${task.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
