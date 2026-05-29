import { useState, useEffect } from 'react'
import '../assets/styleHome.css'
import AddApplication from './AddApplication.jsx'
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const API_URL = import.meta.env.VITE_API_URL

export default function ShowApplications({ onSelectApplication }) {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading]       = useState(true)
  const [showAddApp, setShowAddApp]     = useState(false)
  const { token, logout, user } = useAuth()
  const { t } = useLanguage()

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

  const total     = applications.length
  const entretien = applications.filter(a => a.status === 'INTERVIEW').length
  const enAttente = applications.filter(a => a.status === 'SENT').length
  const acceptees = applications.filter(a => a.status === 'ACCEPTED').length

  const headers = [
    t('home.col_company'), t('home.col_position'), t('home.col_contract'), t('home.col_status'),
    t('home.col_next_action'), t('home.col_date'), t('home.col_city'), '',
  ]

  if (isLoading) return <div className="loading">{t('common.loading')}</div>

  return (
    <div className="home-page">

      {/* ── EN-TÊTE ── */}
      <div className="home-header">
        <div className="home-header__titles">
          <h1>{t('home.title_part1')}<em>{t('home.title_em')}</em></h1>
          {user?.username && (
            <p className="home-welcome">
              {t('home.welcome')} <strong>{user.username.toUpperCase()}</strong> 👋
            </p>
          )}
          <p>{total} {t(total > 1 ? 'home.count_many' : 'home.count_one')}</p>
        </div>

        <div className="home-header__actions">
          <button className="btn-add" onClick={() => setShowAddApp(true)}>
            {t('home.add_btn')}
          </button>
          <button className="btn-logout" onClick={logout}>
            {t('home.logout')}
          </button>
        </div>
      </div>

      {/* ── STATS RAPIDES ── */}
      <div className="home-stats">
        <span className="stat-pill"><strong>{total}</strong> {t('home.stat_total')}</span>
        <span className="stat-pill"><strong>{enAttente}</strong> {t('home.stat_sent')}</span>
        <span className="stat-pill"><strong>{entretien}</strong> {t('home.stat_interviews')}</span>
        <span className="stat-pill"><strong>{acceptees}</strong> {t('home.stat_accepted')}</span>
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
                    <p>{t('home.empty_table')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map(app => (
                <tr key={app.id}>
                  <td className="td-company">{app.company}</td>
                  <td className="td-position">{app.position}</td>
                  <td>{t(`contract.${app.job_contract_type}`) || app.contract_type_label}</td>
                  <td>
                    <span className={`status-badge status ${app.status}`}>
                      {t(`status.${app.status}`) || app.status_label}
                    </span>
                  </td>
                  <td>{t(`next_action.${app.next_action}`) || app.next_action_label}</td>
                  <td className="td-date">{app.date_apply ?? '—'}</td>
                  <td>{app.city_name}</td>
                  <td>
                    <span
                      className="details-badge"
                      onClick={() => onSelectApplication(app)}
                    >
                      {t('home.details_btn')}
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
            <button className="modal-close" onClick={() => setShowAddApp(false)} aria-label={t('common.close')}>✕</button>
            <AddApplication onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}
