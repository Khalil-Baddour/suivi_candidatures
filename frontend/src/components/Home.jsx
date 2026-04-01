import { useState, useEffect } from 'react'
import '../assets/styles.css'
import Details from './detailCandidature.jsx';
import AddApplication from './AddApplication.jsx';

function ShowApplications({ onSelectApplication }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddApp, setShowAddApp] = useState(false);

  // Chargement initial de la liste
  useEffect(() => {
    fetch('http://localhost:8000/api/applications/')
      .then(response => response.json())
      .then(data => {
        setApplications(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error : ", error);
        setIsLoading(false);
      });
  }, []);

  // Raffraichir la liste après avoir ajouté une candidature
  const handleSuccess = () => {
    setShowAddApp(false);
    setIsLoading(true);
    fetch('http://localhost:8000/api/applications/')
      .then(r => r.json())
      .then(data => { setApplications(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  };

  const headersTable = ['Entreprise', 'Contact', 'Poste', 'Status',
                        'Prochaine action', 'Échéance', 'Ville'];

  const statusLabel = {
    SENT: 'Envoyé',
    INTERVIEW: 'Entretien',
    REJECTED: 'Refusée',
    TO_APPLY: 'À préparer',
    NO_RESPONSE: 'Sans réponse'
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <h1>Suivi des candidatures de stage</h1>

      <table>
        <thead>
          <tr className='FirstEmptyRow'></tr>
          <tr>
            {headersTable.map((h, index) => <th key={index}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application.id}>
              <td>{application.company}</td>
              <td>{application.contact}</td>
              <td>{application.position}</td>
              <td className={`status ${application.status}`}>
                {statusLabel[application.status]}
              </td>
              <td>{application.next_action}</td>
              <td>{application.next_action_date}</td>
              <td>{application.city}</td>
              <td>
                <span
                  className="details-badge"
                  onClick={() => onSelectApplication(application)}
                >Détails</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bouton pour afficher le formulaire */}
      <button onClick={() => setShowAddApp(true)}>
        Ajouter une nouvelle candidature
      </button>

      {showAddApp && <AddApplication onSuccess={handleSuccess} />}
    </>
  );
}

export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedApplication(null);
  };

  return (
    <div>
      {showDetails ? (
        <Details
          candidature={selectedApplication}
          onBack={handleBackToList}
        />
      ) : (
        <ShowApplications onSelectApplication={handleSelectApplication} />
      )}
    </div>
  );
}