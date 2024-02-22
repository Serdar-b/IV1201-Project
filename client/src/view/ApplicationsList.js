// ApplicationsList.js
import React, { useState } from 'react';
import './ApplicationsList.css';
import Select from 'react-select';

const ApplicationsList = ({
  applications,
  error,
  competences,
  onSearchTermChange,
  onCompetenceChange,
  onUpdateStatus
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const applicationsPerPage = 10;

  // Calculate the current applications to display
  const indexOfLastApplication = (currentPage + 1) * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);

  // Calculate total pages
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  // Change page handler
  const paginate = (direction) => {
    setCurrentPage(prevPage => Math.max(0, Math.min(prevPage + direction, totalPages - 1)));
  };

  const handleStatusChange = (status, person_id) => {
    onUpdateStatus(status.value, person_id)
  };
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted':
        return { backgroundColor: 'green', color: 'white', padding: '5px', borderRadius: '5px' };
      case 'rejected':
        return { backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px' };
      case 'unhandled':
        return { backgroundColor: 'darkgrey', color: 'white', padding: '5px', borderRadius: '5px' };
      default:
        return {};
    }
  };

  return (
    <div className="applications-list">
      <h2>All Applications</h2>
      <input
        type="text"
        placeholder="Search by name..."
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="search-input"
      />
      <Select
        isMulti
        name="competences"
        options={competences.map(comp => ({ value: comp.name, label: comp.name }))}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={onCompetenceChange}
      />

      {error && <div>An error occurred: {error}</div>}

      <div className="applications-container">
        {currentApplications.length > 0 ? (
          currentApplications.map((app) => (
            <div className="application-card" key={app.person_id}>
              <div><strong>Applicant:</strong> {app.name} {app.surname}</div>
              <div><strong>Competences:</strong> {app.competences_with_experience}</div>
              <div><strong>Availability:</strong> {app.availability_periods}</div>
              <div style={getStatusStyle(app.status)}>
                <strong>Status:</strong> {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
              </div>
              <Select
                name="status"
                options={[
                  { value: 'unhandled', label: 'Unhandled' },
                  { value: 'accepted', label: 'Accepted' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selectedOption) => handleStatusChange(selectedOption, app.person_id, app.competence_id)}
                value={app.status ? { value: app.status, label: app.status.charAt(0).toUpperCase() + app.status.slice(1) } : null}
              />
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
