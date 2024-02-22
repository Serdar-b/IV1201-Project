import React, { useState, useEffect } from 'react';
import './ApplicationsList.css';
import Select from 'react-select';

const ApplicationsList = ({ applications, error, competences }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetences, setSelectedCompetences] = useState([]);

  const applicationsPerPage = 10;

  useEffect(() => {
    // Reset to the first page when the search term changes
    setCurrentPage(0);
  }, [searchTerm, selectedCompetences]);
  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  const options = competences.map(comp => ({ value: comp.name, label: comp.name }));

  const handleCompetenceChange = selectedOptions => {
    setSelectedCompetences(selectedOptions || []);
  };
  

  const filteredApplications = applications.filter(app => {
    const nameMatch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) || app.surname?.toLowerCase().includes(searchTerm.toLowerCase());
    const availabilityCheck = app.availability_periods && app.availability_periods.length > 0;
  
    // Split the app.competences_with_experience string into an array of competences
    const appCompetences = app.competences_with_experience ? app.competences_with_experience.split(', ').map(c => c.split(' (')[0].toLowerCase()) : [];
    
    // Check if every selectedCompetence is included in the appCompetences array
    const competenceMatch = selectedCompetences.length === 0 || selectedCompetences.every(selectedCompetence => 
      appCompetences.includes(selectedCompetence.value.toLowerCase())
    );
  
    return nameMatch && availabilityCheck && competenceMatch;
  });
  


  // Calculate the current applications to display after filtering
  const indexOfLastApplication = (currentPage + 1) * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  // Calculate total pages after filtering
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  // Change page handler
  const paginate = (direction) => {
    setCurrentPage(prevPage => Math.max(0, Math.min(prevPage + direction, totalPages - 1)));
  };

  return (
    <div className="applications-list">
      <h2>All Applications</h2>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <Select
        isMulti
        name="competences"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleCompetenceChange}
        value={selectedCompetences}
      />

      <div className="applications-container">
        {currentApplications.length > 0 ? (
          currentApplications.map((app) => (
            <div className="application-card" key={app.person_id}>
              <div><strong>Applicant:</strong> {app.name} {app.surname}</div>
              <div><strong>Competences:</strong> {app.competences_with_experience}</div>
              <div><strong>Availability:</strong> {app.availability_periods}</div>
              <div><strong>Status:</strong> {app.status}</div>
            </div>
          ))
        ) : (
          <div>No applications found.</div>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => paginate(-1)} disabled={currentPage <= 0}>Left</button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={() => paginate(1)} disabled={currentPage >= totalPages - 1}>Right</button>
      </div>
    </div>
  );
};

export default ApplicationsList;
