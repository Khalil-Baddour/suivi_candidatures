import { useState } from "react";
import AsyncSelect from 'react-select/async';
import { useLanguage } from "../context/LanguageContext";
import '../assets/styleAddApplication.css'

const API_URL = import.meta.env.VITE_API_URL;


export default function Modifyapplication({ candidature, onSuccess }) {
    const { t } = useLanguage();
    const [company, setCompany] = useState(candidature.company ?? '')
    const [contact, setContact] = useState(candidature.contact ?? '')
    const [email, setEmail] = useState(candidature.email ?? '')
    const [roleContact, setRoleContact] = useState(candidature.role_contact ?? '')
    const [position, setPosition] = useState(candidature.position ?? '')
    const [jobContractType, setJobContractType] = useState(candidature.job_contract_type ?? '')
    const [jobMission, setJobMission] = useState(candidature.job_mission ?? '')
    const [offerLink, setOfferLink] = useState(candidature.offer_link ?? '')
    const [dateApply, setDateApply] = useState(candidature.date_apply ?? '')
    const [city, setCity] = useState(
        candidature.city
            ? { value: candidature.city, label: candidature.city_name }
            : null
        )
    const [status, setStatus] = useState(candidature.status ?? 'TO_PREPARE')
    const [nextActionDate, setNextActionDate] = useState(candidature.next_action_date ?? '')
    const [nextAction, setNextAction] = useState(candidature.next_action ?? '')
    const [notes, setNotes] = useState(candidature.notes ?? '')
    const [cv, setCv] = useState(null)
    const [coverLetter, setCoverLetter] = useState(null)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

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

    const handleModify = async () => {
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
        formData.append('city', city.value);
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
            const response = await fetch(`${API_URL}/applications/${candidature.id}/`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }

            const updatedCandidature = await response.json();

            setSuccessMsg(t('modify_application.success'));

            setTimeout(() => {
                setSuccessMsg('');
                if (onSuccess) onSuccess(updatedCandidature);
            }, 800);

        } catch (err) {
            setError(`${t('form.error_send')} ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="add-application-form">
      <h2>{t('modify_application.title')}</h2>
      <p className="form-required-note"><span>*</span> {t('form.required_note')}</p>

      {successMsg && <p className="form-success">{successMsg}</p>}
      {error && <p className="form-error">{error}</p>}

      {/* ── SECTION : Poste ───────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_post')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">{t('form.label_company')} <span className="label-required">*</span></label>
            <input
              type="text" id="company"
              value={company} onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">{t('form.label_position')} <span className="label-required">*</span></label>
            <input
              type="text" id="position"
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
              value={city}
              defaultOptions={false}
              loadOptions={loadCityOptions}
              onChange={(selectedOption) => setCity(selectedOption ?? null)}
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
            value={jobMission} onChange={(e) => setJobMission(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="offer-link">{t('form.label_offer_link')}</label>
          <input
            type="url" id="offer-link"
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
              value={contact} onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="roleContact">{t('form.label_role')}</label>
            <input
              type="text" id="roleContact"
              value={roleContact} onChange={(e) => setRoleContact(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('form.label_email')}</label>
          <input
            type="email" id="email"
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
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── SECTION : Documents ───────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">{t('form.section_documents')}</p>
        <p className="form-files-note">{t('modify_application.files_note')}</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cv">{t('modify_application.label_cv')}</label>
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
      <button type="button" onClick={handleModify} disabled={isSubmitting}>
        {isSubmitting ? t('modify_application.submit_loading') : t('modify_application.submit')}
      </button>
    </div>
  );
}
