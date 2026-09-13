import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Shell from '../components/Shell'
import Status from '../components/Status'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'closed', label: 'Closed' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Tickets() {
  const [tickets, setTickets] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    api
      .listTickets()
      .then((data) => {
        if (!cancelled) setTickets(data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visible = tickets?.filter((t) => filter === 'all' || t.status === filter) ?? []

  return (
    <Shell>
      <header className="page-head">
        <div>
          <h1 className="page-head__title">Ticket queue</h1>
          <p className="page-head__sub">Everything you've raised, in one place.</p>
        </div>
        <Link to="/tickets/new" className="btn btn--primary">
          New ticket
        </Link>
      </header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filters__pill ${filter === f.key ? 'filters__pill--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="banner banner--error">{error}</p>}

      {!tickets && !error && <p className="empty">Loading tickets…</p>}

      {tickets && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">
            {filter === 'all' ? 'No tickets yet' : `No ${filter.replace('_', ' ')} tickets`}
          </p>
          <p className="empty-state__body">
            {filter === 'all'
              ? 'Raise your first ticket and it will show up here.'
              : 'Try a different filter, or raise a new ticket.'}
          </p>
          {filter === 'all' && (
            <Link to="/tickets/new" className="btn btn--primary">
              New ticket
            </Link>
          )}
        </div>
      )}

      {visible.length > 0 && (
        <ul className="ticket-list">
          {visible.map((t) => (
            <li key={t.id}>
              <Link to={`/tickets/${t.id}`} className={`ticket-row ticket-row--${t.status}`}>
                <div className="ticket-row__main">
                  <span className="ticket-row__id">#{t.id}</span>
                  <span className="ticket-row__title">{t.title}</span>
                </div>
                <div className="ticket-row__meta">
                  <span className="ticket-row__date">{formatDate(t.created_at)}</span>
                  <Status value={t.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  )
}
