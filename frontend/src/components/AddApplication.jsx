import { useState } from "react";

export default function AddApplication({ onSuccess }) {
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [roleContact, setRoleContact] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('TO_APPLY');
  const [nextAction, setNextAction] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');
  const [city, setCity] = useState('');
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

    // Champs optionnels — on n'envoie que s'ils ont une valeur
    if (contact)        formData.append('contact', contact);
    if (email)          formData.append('email', email);
    if (roleContact)    formData.append('role_contact', roleContact);
    if (nextAction)     formData.append('next_action', nextAction);
    if (nextActionDate) formData.append('next_action_date', nextActionDate);
    if (cv)             formData.append('cv', cv);
    if (coverLetter)    formData.append('cover_letter', coverLetter);

    try {
      const response = await fetch('http://localhost:8000/api/applications/', {
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

      {error && <p className="form-error">{error}</p>}

      {/* Champs obligatoires  */}
      <label htmlFor="company">Entreprise *</label>
      <input
        type="text" id="company"
        value={company} onChange={(e) => setCompany(e.target.value)}
      />

      <label htmlFor="position">Poste *</label>
      <input
        type="text" id="position"
        value={position} onChange={(e) => setPosition(e.target.value)}
      />

      <label htmlFor="status">Statut *</label>
      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="TO_APPLY">À préparer</option>
        <option value="SENT">Envoyé</option>
        <option value="INTERVIEW">Entretien</option>
        <option value="REJECTED">Refusée</option>
        <option value="NO_RESPONSE">Sans réponse</option>
        <option value="ACCEPTED">Acceptée</option>
      </select>

      <label htmlFor="city">Ville *</label>
      <input
        type="text" id="city"
        value={city} onChange={(e) => setCity(e.target.value)}
      />

      {/* Champs optionnels */}
      <label htmlFor="contact">Contact</label>
      <input
        type="text" id="contact"
        value={contact} onChange={(e) => setContact(e.target.value)}
      />

      <label htmlFor="email">Email du contact</label>
      <input
        type="email" id="email"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="roleContact">Rôle du contact</label>
      <input
        type="text" id="roleContact"
        value={roleContact} onChange={(e) => setRoleContact(e.target.value)}
      />

      <label htmlFor="nextAction">Prochaine action</label>
      <input
        type="text" id="nextAction"
        value={nextAction} onChange={(e) => setNextAction(e.target.value)}
      />

      <label htmlFor="nextActionDate">Échéance</label>
      <input
        type="date" id="nextActionDate"
        value={nextActionDate} onChange={(e) => setNextActionDate(e.target.value)}
      />

      {/* Fichiers */}
      <label htmlFor="cv">CV (PDF, DOCX…)</label>
      <input
        type="file" id="cv"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setCv(e.target.files[0] ?? null)}
      />

      <label htmlFor="coverLetter">Lettre de motivation</label>
      <input
        type="file" id="coverLetter"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setCoverLetter(e.target.files[0] ?? null)}
      />

      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Envoi en cours…' : 'Ajouter la candidature'}
      </button>
    </div>
  );
}