import React, { useState, useEffect } from 'react';
import './ApplicationsList.css';

const ApplicationsList = ({ applications, error }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCompetence, setSearchCompetence] = useState('');

  const applicationsPerPage = 10;

  useEffect(() => {
    // Reset to the first page when the search term changes
    setCurrentPage(0);
  }, [searchTerm, searchCompetence]);

  if (error) {
    return <div>An error occurred: {error}</div>;
  }


// Filter applications based on the search term, availability, and specific competence
const filteredApplications = applications.filter(app => {
  const nameMatch = (app.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                    (app.surname?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());
  const availabilityCheck = app.availability_periods && app.availability_periods.length > 0;
  
  // Assuming competences_with_experience is a string and ensuring it's not null before calling toLowerCase()
  const competenceMatch = searchCompetence ? (app.competences_with_experience?.toLowerCase() ?? '').includes(searchCompetence.toLowerCase()) : true;
  
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
      <input
        type="text"
        placeholder="Search by competences..."
        value={searchCompetence}
        onChange={(e) => setSearchCompetence(e.target.value)}
        className="search-input"
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
