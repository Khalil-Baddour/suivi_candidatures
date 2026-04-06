import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import '../assets/styles.css'
import Details from './detailCandidature.jsx';
import AddApplication from './AddApplication.jsx';


function ShowApplications({ onSelectApplication }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddApp, setShowAddApp] = useState(false);

  // Chargement initial de la liste  (voir le serializers django pour comprendre les données envoyées)
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

  const headersTable = ['Entreprise', 'Poste', 'Contrat', 'Status', 
                        'Prochaine action',  'Date de candidature', 'Ville'];



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
              <td>{application.position}</td>
              <td>{application.contract_type_label}</td>  
              <td className={`status ${application.status}`}>
                {application.status_label}
              </td>
              <td>{application.next_action_label}</td>
              <td>{application.date_apply}</td>
              <td>{application.city_name}</td>
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

      {showAddApp && (
        <div className='modal-overlay' onClick={()=> setShowAddApp(false)}> 
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddApp(false)}>X</button>
            <AddApplication onSuccess={handleSuccess} />
          </div>
        </div>
        
    
    
    )}
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
          onDeleteSuccess={handleBackToList}
        />
      ) : (
        <ShowApplications onSelectApplication={handleSelectApplication} />
      )}
    </div>
  );
}