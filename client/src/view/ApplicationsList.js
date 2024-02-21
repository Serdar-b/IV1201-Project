import React from 'react';

const ApplicationsList = ({ applications, error }) => {
  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div>
      <h2>All Applications</h2>
      {applications.length > 0 ? (
        <ul>
          {applications.map((app) => (
            <li key={app.person_id}>
              Applicant: {app.name} {app.surname} - Status: {app.status}
              {/* Adjust the properties based on how your data is structured */}
            </li>
          ))}
        </ul>
      ) : (
        <div>No applications found.</div>
      )}
    </div>
  );
};

export default ApplicationsList;
