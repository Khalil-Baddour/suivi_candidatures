import { useState } from 'react'
import '../assets/styleDetails.css'

// Configuration 
const API_URL = import.meta.env.VITE_API_URL

// Mapping statut : classe CSS du badge coloré
const STATUS_COLORS = {
  'En cours':    'badge--blue',
  'Entretien':   'badge--purple',
  'Offre reçue': 'badge--green',
  'Refusé':      'badge--red',
  'En attente':  'badge--amber',
}

//  Sous-composant : valeur vide 
// Affiché à la place d'un champ null/vide pour éviter les blancs silencieux
function EmptyValue({ label = '—' }) {
  return <span className="empty-value">{label}</span>
}

// Composant principal 
// Props :
//   candidature    : objet complet de la candidature à afficher
//   onBack         :  callback : retour à la liste sans action
//   onDeleteSuccess:  callback : appelé après suppression réussie (ex: retour liste)
function Details({ candidature, onBack, onDeleteSuccess }) {

  // Affichage / masquage de la modale de confirmation suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // true pendant l'appel API → désactive le bouton pour éviter le double-clic
  const [isDeleting, setIsDeleting] = useState(false)

  // Message d'erreur à afficher dans la modale si la suppression échoue
  const [deleteError, setDeleteError] = useState(null)

  // ── Fermeture propre de la modale 
  // Reset aussi l'erreur pour ne pas la réafficher à la prochaine ouverture
  function closeModal() {
    setShowDeleteConfirm(false)
    setDeleteError(null)
  }

  // ── Suppression 
  async function handleDeleteApplication() {
    setIsDeleting(true)
    setDeleteError(null) // reset l'éventuelle erreur précédente

    try {
      const response = await fetch(`${API_URL}/applications/${candidature.id}/`, {
        method: 'DELETE',
        // Pas de body : l'id est dans l'URL, Django s'en charge
      })

      if (response.status === 204) {
        // 204 No Content = suppression réussie côté Django
        closeModal()
        onDeleteSuccess() // le parent redirige (retour liste, navigate, etc.)

      } else if (response.status === 404) {
        // La ressource n'existe déjà plus en base
        setDeleteError("Cette candidature n'existe plus.")

      } else {
        // Autre erreur serveur inattendue
        setDeleteError("Une erreur est survenue, réessaie.")
      }

    } catch (error) {
      // Erreur réseau : pas de connexion, serveur down, timeout…
      setDeleteError("Impossible de joindre le serveur.")
      console.error("Erreur réseau lors de la suppression :", error)

    } finally {
      // Toujours réactiver le bouton, succès ou échec
      setIsDeleting(false)
    }
  }

  // ── Modification (à implémenter) 
  async function handleModifyApplication() {
    // TODO : ouvrir un formulaire d'édition ou naviguer vers /edit/:id
  }

  // Classe CSS du badge selon le statut, gris par défaut si statut inconnu
  const badgeClass = STATUS_COLORS[candidature.status_label] ?? 'badge--gray'

  // ── Rendu
  return (
    <div className="details-page">

      {/* NAVIGATION -------------------------------------------------------- */}
      <div className="details-topbar">
        <button onClick={onBack} className="back-btn" aria-label="Retour à la liste">
          ← Retour à la liste
        </button>
      </div>

      {/* HEADER ------------------------------------------------------------ */}
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

      {/* CONTENU ----------------------------------------------------------- */}
      <div className="details-container">

        {/* Infos entreprise + poste */}
        <div className="grid-2">
          <div className="card">
            <h2 className="card__title">🏢 Infos entreprise</h2>
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
                  : <EmptyValue />
                }
              </dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">📄 Infos poste</h2>
            <dl className="info-list">
              <dt>Poste</dt>
              <dd>{candidature.position || <EmptyValue />}</dd>
              <dt>Type</dt>
              <dd>{candidature.contract_type_label || <EmptyValue />}</dd>
              <dt>Ville</dt>
              <dd>{candidature.city_name || <EmptyValue />}</dd>
              <dt>Date de candidature</dt>
              <dd>{candidature.date_apply || <EmptyValue />}</dd>
              <dt>Offre</dt>
              <dd>
                {candidature.offer_link
                  ? <a href={candidature.offer_link} target="_blank" rel="noopener noreferrer">Voir l'offre →</a>
                  : <EmptyValue />
                }
              </dd>
            </dl>
          </div>
        </div>

        {/* Mission */}
        <div className="card">
          <h2 className="card__title">📝 Mission / Description</h2>
          {candidature.job_mission
            ? <p className="card__body">{candidature.job_mission}</p>
            : <p className="empty-value">Aucune description renseignée.</p>
          }
        </div>

        {/* Prochaine action + Documents */}
        <div className="grid-2">
          <div className="card card--highlight">
            <h2 className="card__title">📅 Prochaine action</h2>
            <dl className="info-list">
              <dt>Statut</dt>
              <dd>{candidature.status_label || <EmptyValue />}</dd>
              <dt>Action</dt>
              <dd>{candidature.next_action_label || <EmptyValue />}</dd>
              <dt>Date</dt>
              <dd>{candidature.next_action_date || <EmptyValue />}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">📎 Documents</h2>
            <div className="doc-list">
              {/* CV et LM ont chacun leur propre condition — indépendantes */}
              <div className="doc-item">
                <span className="doc-label">CV</span>
                {candidature.cv
                  ? <a href={candidature.cv} target="_blank" rel="noopener noreferrer" className="doc-link">📄 Voir le CV</a>
                  : <span className="empty-value">Non renseigné</span>
                }
              </div>
              <div className="doc-item">
                <span className="doc-label">Lettre de motivation</span>
                {candidature.cover_letter
                  ? <a href={candidature.cover_letter} target="_blank" rel="noopener noreferrer" className="doc-link">📄 Voir la lettre</a>
                  : <span className="empty-value">Non renseignée</span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="card__title">🗒️ Notes</h2>
          {candidature.notes
            ? <p className="card__body">{candidature.notes}</p>
            : <p className="empty-value">Aucune note renseignée.</p>
          }
        </div>

        {/* Boutons d'action */}
        <div className="actions">
          <button onClick={handleModifyApplication} className="btn btn--primary">
            ✏️ Modifier
          </button>
          {/* Ouvre la modale — ne supprime pas directement */}
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn--danger-outline">
            Supprimer
          </button>
        </div>

        {/* Métadonnées */}
        <div className="meta">
          <span>Créé le {new Date(candidature.created_at).toLocaleString('fr-FR')}</span>
          <span className="meta__sep">·</span>
          <span>Mis à jour le {new Date(candidature.updated_at).toLocaleString('fr-FR')}</span>
        </div>

      </div>

      {/* MODALE DE CONFIRMATION SUPPRESSION -------------------------------- */}
      {showDeleteConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <h2 id="confirm-title" className="modal__title">
              Supprimer cette candidature ?
            </h2>
            <p className="modal__body">
              Cette action est irréversible. La candidature chez{' '}
              <strong>{candidature.company}</strong> sera définitivement supprimée.
            </p>

            {/* Message d'erreur API affiché uniquement en cas d'échec */}
            {deleteError && (
              <p className="modal__error">{deleteError}</p>
            )}

            <div className="modal__actions">
              {/* Annuler : ferme la modale ET reset l'erreur */}
              <button
                onClick={closeModal}
                className="btn btn--secondary"
                disabled={isDeleting}
              >
                Annuler
              </button>

              {/* Confirmer : désactivé pendant la requête pour éviter le double-clic */}
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