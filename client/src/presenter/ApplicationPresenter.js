import React, { useState, useEffect } from 'react';
import ApplicationForm from "../view/Application";
import { useNavigate } from 'react-router-dom';

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
                console.log("data", competences);

            } catch (error) {
                console.error("Error fetching competences:", error);
            } 
        };

        fetchCompetences();
    }, []);
    console.log("komp", competences);
    const handleApplicationSubmit = async (selectedCompetence, experience, fromDate, toDate) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        // Adjust the structure of the request body as needed
        const competencesSubmission = [{ competenceName: selectedCompetence, yearsOfExperience: experience }];
        const availability = [{ fromDate, toDate }];

        try {
            const response = await fetch("http://localhost:5001/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ competences: competencesSubmission, availability, userData }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Application submitted successfully');
                navigate('/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("An error occurred while submitting the application.", error);
            alert("An error occurred while submitting the application.");
        }
    };

    return <ApplicationForm competences={competences} onSubmitApplication={handleApplicationSubmit} />;
};

export default ApplicationPresenter;