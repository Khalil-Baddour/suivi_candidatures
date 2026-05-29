import { useState } from "react";
import AsyncSelect from 'react-select/async';
import { useLanguage } from "../context/LanguageContext";
import '../assets/styleAddApplication.css'

const API_URL = import.meta.env.VITE_API_URL;


export default function AddApplication({ onSuccess }) {
  const { t } = useLanguage();
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [roleContact, setRoleContact] = useState('');

  const [position, setPosition] = useState('');
  const [jobContractType, setJobContractType] = useState('PERMANENT');
  const [jobMission, setJobMission] = useState('');
  const [offerLink, setOfferLink] = useState('');
  const [dateApply, setDateApply] = useState('');
  const [city, setCity] = useState(null);

  const [status, setStatus] = useState('TO_PREPARE');
  const [nextActionDate, setNextActionDate] = useState('');
  const [nextAction, setNextAction] = useState('');

  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  const loadCityOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];
    try {
      const response = await fetch(`${API_URL}/cities/?search=${inputValue}`);
      const data = await response.json();
      return data.map(c => ({
        value: c.id,
        label: c.nom_standard
      })).sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error("Erreur de recherche:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!company || !position || !status || !city) {
      setError(t('form.required_fields'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('company', company);
    formData.append('position', position);
    formData.append('status', status);
    formData.append('city', city);
    formData.append('job_contract_type', jobContractType);

    if (contact)        formData.append('contact', contact);
    if (email)          formData.append('email', email);
    if (roleContact)    formData.append('role_contact', roleContact);
    if (nextAction)     formData.append('next_action', nextAction);
    if (nextActionDate) formData.append('next_action_date', nextActionDate);
    if (cv)             formData.append('cv', cv);
    if (coverLetter)    formData.append('cover_letter', coverLetter);
    if (jobMission)     formData.append('job_mission', jobMission);
    if (offerLink)      formData.append('offer_link', offerLink);
    if (dateApply)      formData.append('date_apply', dateApply);
    if (notes)          formData.append('notes', notes);

    try {
      const response = await fetch(`${API_URL}/applications/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(`${t('form.error_send')} ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-application-form">
      <h2>{t('add_application.title')}</h2>
      <p className="form-required-note"><span>*</span> {t('form.required_note')}</p>

      {error && <p className="form-error">{error}</p>}

      {/* ── SECTION : Poste ───────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_post')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">{t('form.label_company')} <span className="label-required">*</span></label>
            <input
              type="text" id="company"
              placeholder={t('form.placeholder_company')}
              value={company} onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">{t('form.label_position')} <span className="label-required">*</span></label>
            <input
              type="text" id="position"
              placeholder={t('form.placeholder_position')}
              value={position} onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">{t('form.label_status')} <span className="label-required">*</span></label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TO_PREPARE">{t('form.status_to_prepare')}</option>
              <option value="SENT">{t('form.status_sent')}</option>
              <option value="INTERVIEW">{t('form.status_interview')}</option>
              <option value="REJECTED">{t('form.status_rejected')}</option>
              <option value="ACCEPTED">{t('form.status_accepted')}</option>
              <option value="NO_RESPONSE">{t('form.status_no_response')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="job-contract-type">{t('form.label_contract')} <span className="label-required">*</span></label>
            <select id="job-contract-type" value={jobContractType} onChange={(e) => setJobContractType(e.target.value)}>
              <option value="PERMANENT">{t('form.contract_permanent')}</option>
              <option value="FIXED_TERM">{t('form.contract_fixed_term')}</option>
              <option value="INTERNSHIP">{t('form.contract_internship')}</option>
              <option value="APPRENTICE_SHIP">{t('form.contract_apprenticeship')}</option>
              <option value="FREELANCE">{t('form.contract_freelance')}</option>
              <option value="OTHER">{t('form.contract_other')}</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">{t('form.label_city')} <span className="label-required">*</span></label>
            <AsyncSelect
              inputId="city"
              classNamePrefix="react-select"
              cacheOptions
              defaultOptions={false}
              loadOptions={loadCityOptions}
              onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : null)}
              placeholder={t('form.city_placeholder')}
              noOptionsMessage={({ inputValue }) =>
                !inputValue || inputValue.length < 2
                  ? t('form.city_min2')
                  : t('form.city_not_found')
              }
              loadingMessage={() => t('form.city_loading')}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date-apply">{t('form.label_date_apply')}</label>
            <input
              type="date" id="date-apply"
              value={dateApply} onChange={(e) => setDateApply(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="job-mission">{t('form.label_mission')}</label>
          <textarea
            id="job-mission"
            placeholder={t('form.placeholder_mission')}
            value={jobMission} onChange={(e) => setJobMission(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="offer-link">{t('form.label_offer_link')}</label>
          <input
            type="url" id="offer-link"
            placeholder="https://..."
            value={offerLink} onChange={(e) => setOfferLink(e.target.value)}
          />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── SECTION : Contact RH ──────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_contact')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact">{t('form.label_contact')}</label>
            <input
              type="text" id="contact"
              placeholder="Prénom Nom"
              value={contact} onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="roleContact">{t('form.label_role')}</label>
            <input
              type="text" id="roleContact"
              placeholder="ex : Talent Acquisition"
              value={roleContact} onChange={(e) => setRoleContact(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('form.label_email')}</label>
          <input
            type="email" id="email"
            placeholder="contact@entreprise.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── SECTION : Suivi ───────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_tracking')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nextAction">{t('form.label_next_action')}</label>
            <select id="nextAction" value={nextAction} onChange={(e) => setNextAction(e.target.value)}>
              <option value="NONE">{t('form.next_action_none')}</option>
              <option value="SEND_APPLICATION">{t('form.next_action_send')}</option>
              <option value="TO_FOLLOW_UP">{t('form.next_action_follow_up')}</option>
              <option value="TO_PREPARE_INTERVIEW">{t('form.next_action_prepare_interview')}</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nextActionDate">{t('form.label_deadline')}</label>
            <input
              type="date" id="nextActionDate"
              value={nextActionDate} onChange={(e) => setNextActionDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">{t('form.label_notes')}</label>
          <textarea
            id="notes"
            placeholder={t('form.placeholder_notes')}
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── SECTION : Documents ───────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_documents')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cv">{t('form.label_cv')}</label>
            <input
              type="file" id="cv"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCv(e.target.files[0] ?? null)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverLetter">{t('form.label_cover_letter')}</label>
            <input
              type="file" id="coverLetter"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCoverLetter(e.target.files[0] ?? null)}
            />
          </div>
        </div>
      </div>

      {/* ── BOUTON ────────────────────────────────────────── */}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? t('add_application.submit_loading') : t('add_application.submit')}
      </button>
    </div>
  );
}
