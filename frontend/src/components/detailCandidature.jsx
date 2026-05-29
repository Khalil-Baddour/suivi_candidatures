import { useState } from 'react'
import '../assets/styleDetails.css'
import ModifyApplication from './ModifyApplications'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL

const STATUS_COLORS = {
  'SENT':        'badge--blue',
  'INTERVIEW':   'badge--amber',
  'ACCEPTED':    'badge--green',
  'REJECTED':    'badge--red',
  'TO_PREPARE':  'badge--gray',
  'NO_RESPONSE': 'badge--gray',
}

function EmptyValue({ feminine }) {
  const { t } = useLanguage()
  return <span className="empty-value">{feminine ? t('common.not_filled_f') : t('common.not_filled')}</span>
}

function Details({ candidature, onBack, onDeleteSuccess, onModifySuccess }) {
  const { t, dateLocale } = useLanguage()

  const [showModify,        setShowModify]        = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting,        setIsDeleting]        = useState(false)
  const [deleteError,       setDeleteError]       = useState(null)

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
        setDeleteError(t('details.error_not_found'))
      } else {
        setDeleteError(t('details.error_generic'))
      }
    } catch {
      setDeleteError(t('details.error_server'))
    } finally {
      setIsDeleting(false)
    }
  }

  function handleModifySuccess(updatedData) {
    setShowModify(false)
    onModifySuccess(updatedData)
  }

  const badgeClass = STATUS_COLORS[candidature.status] ?? 'badge--gray'

  return (
    <div className="details-page">

      {/* ── TOPBAR ── */}
      <div className="details-topbar">
        <button onClick={onBack} className="back-btn" aria-label={t('details.back_btn')}>
          {t('details.back_btn')}
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
          {t(`status.${candidature.status}`) || candidature.status_label || '—'}
        </span>
      </div>

      {/* ── CONTENU ── */}
      <div className="details-container">

        <div className="grid-2">
          <div className="card">
            <h2 className="card__title">{t('details.card_company')}</h2>
            <dl className="info-list">
              <dt>{t('details.label_company')}</dt>
              <dd>{candidature.company || <EmptyValue />}</dd>
              <dt>{t('details.label_contact')}</dt>
              <dd>{candidature.contact || <EmptyValue />}</dd>
              <dt>{t('details.label_role')}</dt>
              <dd>{candidature.role_contact || <EmptyValue />}</dd>
              <dt>{t('details.label_email')}</dt>
              <dd>
                {candidature.email
                  ? <a href={`mailto:${candidature.email}`}>{candidature.email}</a>
                  : <EmptyValue />}
              </dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">{t('details.card_post')}</h2>
            <dl className="info-list">
              <dt>{t('details.label_position')}</dt>
              <dd>{candidature.position || <EmptyValue />}</dd>
              <dt>{t('details.label_contract')}</dt>
              <dd>{t(`contract.${candidature.job_contract_type}`) || candidature.contract_type_label || <EmptyValue />}</dd>
              <dt>{t('details.label_city')}</dt>
              <dd>{candidature.city_name || <EmptyValue />}</dd>
              <dt>{t('details.label_date_apply')}</dt>
              <dd>{candidature.date_apply || <EmptyValue />}</dd>
              <dt>{t('details.label_offer')}</dt>
              <dd>
                {candidature.offer_link
                  ? <a href={candidature.offer_link} target="_blank" rel="noopener noreferrer">{t('details.see_offer')}</a>
                  : <EmptyValue />}
              </dd>
            </dl>
          </div>
        </div>

        <div className="card">
          <h2 className="card__title">{t('details.card_mission')}</h2>
          {candidature.job_mission
            ? <p className="card__body">{candidature.job_mission}</p>
            : <p className="empty-value">{t('details.no_description')}</p>}
        </div>

        <div className="grid-2">
          <div className="card card--highlight">
            <h2 className="card__title">{t('details.card_next_action')}</h2>
            <dl className="info-list">
              <dt>{t('details.label_status')}</dt>
              <dd>{t(`status.${candidature.status}`) || candidature.status_label || <EmptyValue />}</dd>
              <dt>{t('details.label_action')}</dt>
              <dd>{t(`next_action.${candidature.next_action}`) || candidature.next_action_label || <EmptyValue />}</dd>
              <dt>{t('details.label_deadline')}</dt>
              <dd>{candidature.next_action_date || <EmptyValue />}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="card__title">{t('details.card_documents')}</h2>
            <div className="doc-list">
              <div className="doc-item">
                <span className="doc-label">{t('details.label_cv')}</span>
                {candidature.cv
                  ? <a href={candidature.cv} target="_blank" rel="noopener noreferrer" className="doc-link">{t('details.see_cv')}</a>
                  : <span className="empty-value">{t('common.not_filled')}</span>}
              </div>
              <div className="doc-item">
                <span className="doc-label">{t('details.label_cover_letter')}</span>
                {candidature.cover_letter
                  ? <a href={candidature.cover_letter} target="_blank" rel="noopener noreferrer" className="doc-link">{t('details.see_letter')}</a>
                  : <span className="empty-value">{t('common.not_filled_f')}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card__title">{t('details.card_notes')}</h2>
          {candidature.notes
            ? <p className="card__body">{candidature.notes}</p>
            : <p className="empty-value">{t('details.no_notes')}</p>}
        </div>

        <div className="actions">
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn--danger-outline">
            {t('details.delete_btn')}
          </button>
          <button onClick={() => setShowModify(true)} className="btn btn--primary">
            {t('details.modify_btn')}
          </button>
        </div>

        <div className="meta">
          <span>{t('details.created_at')} {new Date(candidature.created_at).toLocaleString(dateLocale)}</span>
          <span className="meta__sep">·</span>
          <span>{t('details.updated_at')} {new Date(candidature.updated_at).toLocaleString(dateLocale)}</span>
        </div>

      </div>

      {/* ── MODALE MODIFICATION ── */}
      {showModify && (
        <div className="modal-overlay" onClick={() => setShowModify(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModify(false)}
              aria-label={t('common.close')}
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
              {t('details.delete_modal_title')}
            </h2>
            <p className="modal__body">
              {t('details.delete_modal_body_prefix')}{' '}
              <strong>{candidature.company}</strong>{' '}
              {t('details.delete_modal_body_suffix')}
            </p>

            {deleteError && <p className="modal__error">{deleteError}</p>}

            <div className="modal__actions">
              <button
                onClick={closeDeleteModal}
                className="btn btn--secondary"
                disabled={isDeleting}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteApplication}
                className="btn btn--danger"
                disabled={isDeleting}
              >
                {isDeleting ? t('details.confirm_delete_loading') : t('details.confirm_delete_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Details
