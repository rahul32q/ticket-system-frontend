import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import Shell from '../components/Shell'
import Status from '../components/Status'

const NEXT_STATUS = {
  open: { value: 'in_progress', label: 'Start progress' },
  in_progress: { value: 'closed', label: 'Close ticket' },
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  function load() {
    api
      .getTicket(id)
      .then(setTicket)
      .catch((err) => setError(err.message))
  }

  useEffect(load, [id])

  async function advanceStatus() {
    const next = NEXT_STATUS[ticket.status]
    if (!next) return
    setUpdating(true)
    setError('')
    try {
      const updated = await api.updateTicketStatus(id, next.value)
      setTicket(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (error && !ticket) {
    return (
      <Shell>
        <p className="banner banner--error">{error}</p>
        <Link to="/" className="btn btn--ghost">
          Back to queue
        </Link>
      </Shell>
    )
  }

  if (!ticket) {
    return (
      <Shell>
        <p className="empty">Loading ticket…</p>
      </Shell>
    )
  }

  const next = NEXT_STATUS[ticket.status]

  return (
    <Shell>
      <Link to="/" className="back-link">
        ← Back to queue
      </Link>

      <header className="detail-head">
        <div>
          <span className="detail-head__id">Ticket #{ticket.id}</span>
          <h1 className="detail-head__title">{ticket.title}</h1>
        </div>
        <Status value={ticket.status} />
      </header>

      <dl className="detail-meta">
        <div>
          <dt>Created</dt>
          <dd>{formatDateTime(ticket.created_at)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDateTime(ticket.updated_at)}</dd>
        </div>
      </dl>

      <div className="detail-body">
        <h2 className="detail-body__label">Description</h2>
        <p className="detail-body__text">
          {ticket.description || 'No description was provided.'}
        </p>
      </div>

      {error && <p className="banner banner--error">{error}</p>}

      <div className="detail-actions">
        {next ? (
          <button className="btn btn--primary" onClick={advanceStatus} disabled={updating}>
            {updating ? 'Updating…' : next.label}
          </button>
        ) : (
          <p className="detail-actions__done">This ticket is closed and can't be reopened.</p>
        )}
      </div>
    </Shell>
  )
}
