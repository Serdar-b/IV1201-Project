import React, { useState, useEffect } from 'react';
import ApplicationsList from '../view/ApplicationsList';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";


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
  const token = localStorage.getItem('token');
  const { t } = useTranslation();

  useEffect(() => {

    fetchCompetences();
    fetchApplications();
  }, []);

  // Fetch competences when the component mounts
  const fetchCompetences = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apply`, {
      
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          'Accept-Language': i18n.language,
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

      const token = localStorage.getItem('token');
      
        const response = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
          'Accept-Language': i18n.language,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications);

    } catch (err) {
      console.log(err)
      setError(t("error_fetching_applications"));
    }

  };

  useEffect(() => {
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

    
    const handleSearchTermChange = (newSearchTerm) => {
      setSearchTerm(newSearchTerm);
    };
  
    const handleCompetenceChange = (selectedOptions) => {
      setSelectedCompetences(selectedOptions || []);
    };

    const handleStatusChange = async (status, person_id) => {
      try {
        const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.REACT_APP_API_URL}/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            'Accept-Language': i18n.language,
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
