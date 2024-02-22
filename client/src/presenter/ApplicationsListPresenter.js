import React, { useState, useEffect } from 'react';
import ApplicationsList from '../view/ApplicationsList';

/**
 * Presenter component for listing all applications.
 * This component fetches competences, handles application submission,
 * and renders the application form view.
 * @returns {React.ReactElement} The ApplicationForm component with competences and a submit handler.
 */

const ApplicationsListPresenter = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState('');
  const [competences, setCompetences] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetences, setSelectedCompetences] = useState([]);

  useEffect(() => {

    fetchCompetences();
    fetchApplications();
  }, []);

  // Fetch competences when the component mounts
  const fetchCompetences = async () => {
    try {
      const response = await fetch("http://localhost:5001/apply", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCompetences(data);
    } catch (error) {
      console.error("Error fetching competences:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5001/applications', {
        method: 'GET',
        credentials: 'include', // To ensure cookies are sent with the request for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Perform filtering logic here
    const filtered = applications.filter(app => {
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
    setFilteredApplications(filtered);
  }, [applications, searchTerm, selectedCompetences]);

    // Handlers to be passed to the view
    const handleSearchTermChange = (newSearchTerm) => {
      setSearchTerm(newSearchTerm);
    };
  
    const handleCompetenceChange = (selectedOptions) => {
      setSelectedCompetences(selectedOptions || []);
    };

    const handleStatusChange = async (status, person_id) => {
      try {
        const response = await fetch("http://localhost:5001/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status, person_id }),
        });
  
        if (response.ok) {
          // Update applications state to reflect the status change
          const updatedApplications = applications.map(app => 
            app.person_id === person_id ? { ...app, status } : app
          );
          setApplications(updatedApplications);
        } else {
          console.error("Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    };
  

    return (
      <ApplicationsList
        applications={filteredApplications}
        error={error}
        competences={competences}
        onSearchTermChange={handleSearchTermChange}
        onCompetenceChange={handleCompetenceChange}
        onUpdateStatus={handleStatusChange}
      />
    );
};

export default ApplicationsListPresenter;
