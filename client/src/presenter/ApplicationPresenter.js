import React, { useState, useEffect } from "react";
import ApplicationForm from "../view/Application";
import { useNavigate } from "react-router-dom";

/**
 * Presenter component for handling job application functionality.
 * This component fetches competences, handles application submission,
 * and renders the application form view.
 * @returns {React.ReactElement} The ApplicationForm component with competences and a submit handler.
 */
const ApplicationPresenter = () => {
  const navigate = useNavigate();
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
  // console.log("komp", competences);

  useEffect(() => {
    console.log("Competences updated:", competences);
  }, [competences]);
  /**
   * Handles the submission of a job application.
   * @param {string} selectedCompetence - The selected competence.
   * @param {number} experience - The years of experience.
   * @param {string} fromDate - The start date of availability.
   * @param {string} toDate - The end date of availability.
   */

  const handleApplicationSubmit = async (
    selectedCompetence,
    experience,
    fromDate,
    toDate
  ) => {
    if (Number(experience) < 0) {
      alert("Years of experience cannot be negative.");
      return;
    }

    // Validate that the fromDate is not in the past
    if (new Date(fromDate) < new Date()) {
      alert("The start date cannot be in the past.");
      return;
    }

    // Validate that the toDate is after the fromDate
    if (new Date(toDate) <= new Date(fromDate)) {
      alert("The end date must be after the start date.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    // Adjust the structure of the request body as needed
    const competencesSubmission = [
      { competenceName: selectedCompetence, yearsOfExperience: experience },
    ];
    const availability = [{ fromDate, toDate }];

    try {
      const response = await fetch("http://localhost:5001/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competences: competencesSubmission,
          availability,
          userData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Application submitted successfully");
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(
        "An error occurred while submitting the application.",
        error
      );
      alert("An error occurred while submitting the application.");
    }
  };

  return (
    <ApplicationForm
      competences={competences}
      onSubmitApplication={handleApplicationSubmit}
    />
  );
};

export default ApplicationPresenter;
