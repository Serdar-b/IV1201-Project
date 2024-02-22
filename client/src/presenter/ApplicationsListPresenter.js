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
  const [error, setError] = useState('');
  const [competences, setCompetences] = useState([]);

  useEffect(() => {
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

    fetchCompetences();
  }, []);

  useEffect(() => {
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

    fetchApplications();
  }, []);

  return <ApplicationsList applications={applications} error={error} competences = {competences} />;
};

export default ApplicationsListPresenter;
