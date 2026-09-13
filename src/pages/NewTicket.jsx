import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import Shell from '../components/Shell'

export default function NewTicket() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ticket = await api.createTicket(title, description)
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <header className="page-head">
        <div>
          <h1 className="page-head__title">New ticket</h1>
          <p className="page-head__sub">Describe the issue — you can update its status once it's raised.</p>
        </div>
      </header>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Title</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of the issue"
          />
        </label>
        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's happening, and what did you expect instead?"
          />
        </label>
        {error && <p className="banner banner--error">{error}</p>}
        <div className="ticket-form__actions">
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create ticket'}
          </button>
        </div>
      </form>
    </Shell>
  )
}
