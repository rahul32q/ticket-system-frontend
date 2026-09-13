import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Shell({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <aside className="shell__rail">
        <div className="shell__mark">
          <span className="shell__mark-glyph">§</span>
          <span className="shell__mark-text">Deskline</span>
        </div>
        <nav className="shell__nav">
          <Link to="/" className="shell__nav-link">
            Queue
          </Link>
          <Link to="/tickets/new" className="shell__nav-link">
            New ticket
          </Link>
        </nav>
        <button className="shell__logout" onClick={handleLogout}>
          Sign out
        </button>
      </aside>
      <main className="shell__main">{children}</main>
    </div>
  )
}
