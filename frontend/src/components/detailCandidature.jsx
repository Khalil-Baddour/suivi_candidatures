import { useState } from 'react'
import '../assets/styleDetails.css'
import ModifyApplication from './ModifyApplications'

const API_URL = import.meta.env.VITE_API_URL

// Mapping statut → classe CSS du badge
const STATUS_COLORS = {
  'En cours':    'badge--blue',
  'Entretien':   'badge--amber',
  'Offre reçue': 'badge--green',
  'Refusé':      'badge--red',
  'En attente':  'badge--gray',
}

// Valeur vide — évite les blancs silencieux
function EmptyValue() {
  return <span className="empty-value">Non renseigné</span>
}

// ─── Composant principal ──────────────────────────────────────────────────────
function Details({ candidature, onBack, onDeleteSuccess, onModifySuccess }) {

  const [showModify,       setShowModify]       = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting,       setIsDeleting]       = useState(false)
  const [deleteError,      setDeleteError]      = useState(null)

  function closeDeleteModal() {
    setShowDeleteConfirm(false)
    setDeleteError(null)
  }

  async function handleDeleteApplication() {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const response = await fetch(`${API_URL}/applications/${candidature.id}/`, {
        method: 'DELETE',
      })
      if (response.status === 204) {
        closeDeleteModal()
        onDeleteSuccess()
      } else if (response.status === 404) {
        setDeleteError("Cette candidature n'existe plus.")
      } else {
        setDeleteError("Une erreur est survenue, réessaie.")
      }
    } catch {
      setDeleteError("Impossible de joindre le serveur.")
    } finally {
      setIsDeleting(false)
    }
  }

  function handleModifySuccess(updatedData) {
    setShowModify(false)
    onModifySuccess(updatedData)
  }

  const badgeClass = STATUS_COLORS[candidature.status_label] ?? 'badge--gray'

  return (
    <div className="details-page">

      {/* ── TOPBAR ── */}
      <div className="details-topbar">
        <button onClick={onBack} className="back-btn" aria-label="Retour à la liste">
          Retour à la liste
        </button>
      </div>

      {/* ── HEADER ── */}
      <div className="details-header">
        <div className="details-header__title">
          <span className="details-header__company">
            {candidature.company || <EmptyValue />}
          </span>
          <span className="details-header__position">
            {candidature.position || <EmptyValue />}
          </span>
        </div>
        <span className={`status-badge ${badgeClass}`}>
          {candidature.status_label || '—'}
        </span>
      </div>

      {/* ── CONTENU ── */}
      <div className="details-container">

        {/* Infos entreprise + poste */}
        <div className="grid-2">
          <div className="card">
            <h2 className="card__title">Infos entreprise</h2>
            <dl className="info-list">
              <dt>Entreprise</dt>
              <dd>{candidature.company || <EmptyValue />}</dd>
              <dt>Contact</dt>
              <dd>{candidature.contact || <EmptyValue />}</dd>
              <dt>Rôle</dt>
              <dd>{candidature.role_contact || <EmptyValue />}</dd>
              <dt>Email</dt>
              <dd>
                {candidature.email
                  ? <a href={`mailto:${candidature.email}`}>{candidature.email}</a>
                  : <EmptyValue />}
              </dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">Infos poste</h2>
            <dl className="info-list">
              <dt>Poste</dt>
              <dd>{candidature.position || <EmptyValue />}</dd>
              <dt>Contrat</dt>
              <dd>{candidature.contract_type_label || <EmptyValue />}</dd>
              <dt>Ville</dt>
              <dd>{candidature.city_name || <EmptyValue />}</dd>
              <dt>Date de candidature</dt>
              <dd>{candidature.date_apply || <EmptyValue />}</dd>
              <dt>Offre</dt>
              <dd>
                {candidature.offer_link
                  ? <a href={candidature.offer_link} target="_blank" rel="noopener noreferrer">Voir l'offre →</a>
                  : <EmptyValue />}
              </dd>
            </dl>
          </div>
        </div>

        {/* Mission */}
        <div className="card">
          <h2 className="card__title">Mission / Description</h2>
          {candidature.job_mission
            ? <p className="card__body">{candidature.job_mission}</p>
            : <p className="empty-value">Aucune description renseignée.</p>}
        </div>

        {/* Prochaine action + Documents */}
        <div className="grid-2">
          <div className="card card--highlight">
            <h2 className="card__title">Prochaine action</h2>
            <dl className="info-list">
              <dt>Statut</dt>
              <dd>{candidature.status_label || <EmptyValue />}</dd>
              <dt>Action</dt>
              <dd>{candidature.next_action_label || <EmptyValue />}</dd>
              <dt>Échéance</dt>
              <dd>{candidature.next_action_date || <EmptyValue />}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">Documents</h2>
            <div className="doc-list">
              <div className="doc-item">
                <span className="doc-label">CV</span>
                {candidature.cv
                  ? <a href={candidature.cv} target="_blank" rel="noopener noreferrer" className="doc-link">📄 Voir le CV</a>
                  : <span className="empty-value">Non renseigné</span>}
              </div>
              <div className="doc-item">
                <span className="doc-label">Lettre de motivation</span>
                {candidature.cover_letter
                  ? <a href={candidature.cover_letter} target="_blank" rel="noopener noreferrer" className="doc-link">📄 Voir la lettre</a>
                  : <span className="empty-value">Non renseignée</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="card__title">Notes</h2>
          {candidature.notes
            ? <p className="card__body">{candidature.notes}</p>
            : <p className="empty-value">Aucune note renseignée.</p>}
        </div>

        {/* Boutons d'action */}
        <div className="actions">
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn--danger-outline">
            Supprimer
          </button>
          <button onClick={() => setShowModify(true)} className="btn btn--primary">
            ✏️ Modifier
          </button>
        </div>

        {/* Métadonnées */}
        <div className="meta">
          <span>Créé le {new Date(candidature.created_at).toLocaleString('fr-FR')}</span>
          <span className="meta__sep">·</span>
          <span>Mis à jour le {new Date(candidature.updated_at).toLocaleString('fr-FR')}</span>
        </div>

      </div>

      {/* ── MODALE MODIFICATION ── */}
      {showModify && (
        <div className="modal-overlay" onClick={() => setShowModify(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModify(false)}
              aria-label="Fermer"
            >✕</button>
            <ModifyApplication
              candidature={candidature}
              onSuccess={handleModifySuccess}
            />
          </div>
        </div>
      )}

      {/* ── MODALE SUPPRESSION ── */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={closeDeleteModal}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 id="confirm-title" className="modal__title">
              Supprimer cette candidature ?
            </h2>
            <p className="modal__body">
              Cette action est irréversible. La candidature chez{' '}
              <strong>{candidature.company}</strong> sera définitivement supprimée.
            </p>

            {deleteError && <p className="modal__error">{deleteError}</p>}

            <div className="modal__actions">
              <button
                onClick={closeDeleteModal}
                className="btn btn--secondary"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteApplication}
                className="btn btn--danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression…' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Details