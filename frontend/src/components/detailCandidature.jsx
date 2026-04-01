import { useState, useRef } from 'react'

import '../assets/styleDetails.css'

function Details({ candidature, onBack }) {

  const statusLabel = {
    SENT: 'Envoyé',
    INTERVIEW: 'Entretien',
    REJECTED: 'Refusée',
    TO_APPLY: 'À préparer',
    NO_RESPONSE: 'Sans réponse'
  }
  // Champs à modifier
  const [date, setDate] = useState(candidature.next_action_date);
  const [currentStatus, setCurrentStatus] = useState(candidature.status);


  // Fonction sauvegarde des modif sur détails
  async function SaveChangesDetails() {
    try{
      const response = await fetch(`http://localhost:8000/api/applications/${candidature.id}/`,
        {
          method : 'PATCH',   // PATCH envoie uniquement les champs modifiés
          headers : {'Content-Type': 'application/json'},
          body : JSON.stringify({
            next_action_date : date,
            status: currentStatus
          }),
        });
      if (!response.ok){
        const err = await response.json();
        throw new Error(JSON.stringify(err));
      }
      alert("Modifications sauvegardées");

    } catch (err){
      alert(`Erreur : ${err.message}`);
    }
}

  return (
    <>
      <h1>Suivi des candidatures du stage</h1>

      <h3
        onClick={onBack}
        style={{ cursor: 'pointer', color: 'blue' }}
      >
        Retour à la liste
      </h3>

      
      <section className="details-header">
        {candidature.company} / {candidature.position}
      </section>

      <section className="details-content">

        
        <div className="info-recruiter">
          <p>{candidature.contact}</p>
          <p>{candidature.role_contact}</p>
          <p>{candidature.email}</p>
        </div>

       
        <div className="status-echeance">

          <span className="status-box">
            <label htmlFor="status">Statut&nbsp;:</label>

            <select
              name="status"
              id="status"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
            >
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

          </span>

          <span className="date-box">

            <label htmlFor="calendrier">Échéance&nbsp;:</label>

            <input
              type="date"
              id="calendrier"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
            />


          </span>

          <button className="save-button" onClick={SaveChangesDetails}> Saver</button>

        </div>
      </section>
    </>
  )
}

export default Details;
