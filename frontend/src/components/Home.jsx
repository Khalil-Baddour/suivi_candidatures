import { useState, useEffect } from 'react'
import '../assets/styleHome.css'
import AddApplication from './AddApplication.jsx'
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL

// ─── Sous-composant liste ─────────────────────────────────────────────────────
export default function ShowApplications({ onSelectApplication }) {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading]       = useState(true)
  const [showAddApp, setShowAddApp]     = useState(false)
  const { token, logout, user } = useAuth(); 

  console.log("Payload JWT :", user)

  const loadApplications = () => {
    setIsLoading(true)
    fetch(`${API_URL}/applications/`, {
      headers:{
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(data => { setApplications(data); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }

  useEffect(() => { loadApplications() }, [])

  const handleSuccess = () => {
    setShowAddApp(false)
    loadApplications()
  }

  // Stats rapides
  const total     = applications.length
  const entretien = applications.filter(a => a.status === 'INTERVIEW').length
  const enAttente = applications.filter(a => a.status === 'SENT').length
  const acceptees = applications.filter(a => a.status === 'ACCEPTED').length

  const headers = [
    'Entreprise', 'Poste', 'Contrat', 'Statut',
    'Prochaine action', 'Date', 'Ville', '',
  ]

  if (isLoading) return <div className="loading">Chargement</div>

  return (
    <div className="home-page">

      {/* ── EN-TÊTE ── */}
      <div className="home-header">
        <div className="home-header__titles">
          <h1>Suivi des <em>candidatures</em></h1>
          {user?.username && (
            <p className="home-welcome">
              Bienvenue, <strong>{user.username.toUpperCase()}</strong> 👋
            </p>
          )}
          <p>{total} candidature{total > 1 ? 's' : ''} enregistrée{total > 1 ? 's' : ''}</p>
        </div>

        <div className="home-header__actions"> 
          <button className="btn-add" onClick={() => setShowAddApp(true)}>
            + Nouvelle candidature
          </button>
          <button className="btn-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* ── STATS RAPIDES ── */}
      <div className="home-stats">
        <span className="stat-pill"><strong>{total}</strong> total</span>
        <span className="stat-pill"><strong>{enAttente}</strong> envoyées</span>
        <span className="stat-pill"><strong>{entretien}</strong> entretiens</span>
        <span className="stat-pill"><strong>{acceptees}</strong> acceptées</span>
      </div>

      {/* ── TABLEAU ── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <div className="table-empty">
                    <p>📭</p>
                    <p>Aucune candidature pour l'instant.</p>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id}>
                  <td className="td-company">{app.company}</td>
                  <td className="td-position">{app.position}</td>
                  <td>{app.contract_type_label}</td>
                  <td>
                    <span className={`status-badge status ${app.status}`}>
                      {app.status_label}
                    </span>
                  </td>
                  <td>{app.next_action_label}</td>
                  <td className="td-date">{app.date_apply ?? '—'}</td>
                  <td>{app.city_name}</td>
                  <td>
                    <span
                      className="details-badge"
                      onClick={() => onSelectApplication(app)}
                    >
                      Détails →
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODALE AJOUT ── */}
      {showAddApp && (
        <div className="modal-overlay" onClick={() => setShowAddApp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddApp(false)} aria-label="Fermer">✕</button>
            <AddApplication onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}
