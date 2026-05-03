import { useState } from "react";
import AsyncSelect from 'react-select/async';

import '../assets/styleAddApplication.css'

const API_URL = import.meta.env.VITE_API_URL;  // variable d'env   


export default function AddApplication({ onSuccess }) {
  const [company, setCompany] = useState(''); //
  const [contact, setContact] = useState(''); ///
  const [email, setEmail] = useState('');  ///
  const [roleContact, setRoleContact] = useState(''); ///

  const [position, setPosition] = useState(''); //
  const [jobContractType, setJobContractType] = useState('PERMANENT');  //
  const [jobMission, setJobMission] = useState(''); ///
  const [offerLink, setOfferLink] = useState('');  ///
  const [dateApply, setDateApply] = useState(''); ///
  const [city, setCity] = useState(null);  //

  const [status, setStatus] = useState('TO_PREPARE'); //
  const [nextActionDate, setNextActionDate] = useState(''); ///
  const [nextAction, setNextAction] = useState('');  ///

  const [cv, setCv] = useState(null);  ///
  const [coverLetter, setCoverLetter] = useState(null); ///
  const [notes, setNotes] = useState(''); ///

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  // 1. La fonction qui va interroger Django pour la recherche des villes lors du saisi (à chaque fois qu'ion tappe une lettre)
  const loadCityOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return []; // On ne cherche pas si moins de 2 lettres tapées
    }
    
    try {
      const response = await fetch(`${API_URL}/cities/?search=${inputValue}`);
      const data = await response.json();
      
      // react-select a besoin d'un format précis : { value: ID, label: TEXTE }
      return data.map(c => ({
        value: c.id,
        label: c.nom_standard
      })).sort((a, b)=> a.label.localeCompare(b.label));
    } catch (error) {
      console.error("Erreur de recherche:", error);
      return [];
    }
  };


  // 2. Fonction gérant l'ajout et l'enregistrement d'une candidature ajoutée   job_contract_type
  const handleSubmit = async () => {
    // Validation des champs obligatoires
    if (!company || !position || !status || !city) {
      setError('Les champs Entreprise, Poste, Statut et Ville sont obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // FormData pour gérer les fichiers (CV, lettre de motivation)
    const formData = new FormData();
    formData.append('company', company);
    formData.append('position', position);
    formData.append('status', status);
    formData.append('city', city);
    formData.append('job_contract_type', jobContractType);


    // Champs optionnels — on n'envoie que s'ils ont une valeur
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
        // Pas de Content-Type ici : le navigateur le pose automatiquement
        // avec le bon boundary pour multipart/form-data
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(JSON.stringify(errData));
      }

      // Succès : remonter l'info au parent pour fermer le form et rafraîchir
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(`Erreur lors de l'envoi : ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="add-application-form">
      <h2>Ajouter une candidature</h2>
      <p className="form-required-note"><span>*</span> Champs obligatoires</p>

      {error && <p className="form-error">{error}</p>}

      {/* ── SECTION : Poste ───────────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Poste</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">Entreprise <span className="label-required">*</span></label>
            <input
              type="text" id="company"
              placeholder="ex : Airbus, SNCF..."
              value={company} onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Poste <span className="label-required">*</span></label>
            <input
              type="text" id="position"
              placeholder="ex : Développeur fullstack"
              value={position} onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Statut <span className="label-required">*</span></label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="TO_PREPARE">À préparer</option>
              <option value="SENT">Envoyé</option>
              <option value="INTERVIEW">Entretien</option>
              <option value="REJECTED">Refusé</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="NO_RESPONSE">Sans réponse</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="job-contract-type">Contrat <span className="label-required">*</span></label>
            <select id="job-contract-type" value={jobContractType} onChange={(e) => setJobContractType(e.target.value)}>
              <option value="PERMANENT">CDI</option>
              <option value="FIXED_TERM">CDD</option>
              <option value="INTERNSHIP">Stage</option>
              <option value="APPRENTICE_SHIP">Alternance</option>
              <option value="FREELANCE">Freelance</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Ville <span className="label-required">*</span></label>
            <AsyncSelect
              inputId="city"
              classNamePrefix="react-select"
              cacheOptions
              defaultOptions={false}
              loadOptions={loadCityOptions}
              onChange={(selectedOption) => setCity(selectedOption ? selectedOption.value : null)}
              placeholder="Tapez le nom d'une ville..."
              noOptionsMessage={({ inputValue }) =>
                !inputValue || inputValue.length < 2
                  ? "Saisissez au moins 2 lettres"
                  : "Aucune ville trouvée"
              }
              loadingMessage={() => "Recherche en cours..."}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date-apply">Date de candidature</label>
            <input
              type="date" id="date-apply"
              value={dateApply} onChange={(e) => setDateApply(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="job-mission">Missions du poste</label>
          <textarea 
            id="job-mission"
            placeholder="ex : Développement API, gestion BDD..."
            value={jobMission} onChange={(e) => setJobMission(e.target.value)}
          >
          </textarea>

        </div>

        <div className="form-group">
          <label htmlFor="offer-link">Lien vers l'offre</label>
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
        <p className="form-section-title">Contact RH</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact">Personne HR</label>
            <input
              type="text" id="contact"
              placeholder="Prénom Nom"
              value={contact} onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="roleContact">Son rôle</label>
            <input
              type="text" id="roleContact"
              placeholder="ex : Talent Acquisition"
              value={roleContact} onChange={(e) => setRoleContact(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Adresse mail</label>
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
        <p className="form-section-title">Suivi</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nextAction">Prochaine action</label>
            <select id="nextAction" value={nextAction} onChange={(e) => setNextAction(e.target.value)}>
              <option value="NONE">Aucune</option>
              <option value="SEND_APPLICATION">Envoyer la candidature</option>
              <option value="TO_FOLLOW_UP">Relancer</option>
              <option value="TO_PREPARE_INTERVIEW">Préparer l'entretien</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nextActionDate">Échéance</label>
            <input
              type="date" id="nextActionDate"
              value={nextActionDate} onChange={(e) => setNextActionDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Informations complémentaires, impression sur l'offre..."
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── SECTION : Documents ───────────────────────────── */}
      <div className="form-section">
        <p className="form-section-title">Documents</p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cv">CV</label>
            <input
              type="file" id="cv"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCv(e.target.files[0] ?? null)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="coverLetter">Lettre de motivation</label>
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
        {isSubmitting ? 'Envoi en cours…' : 'Valider la candidature'}
      </button>
    </div>
  ); ;
}