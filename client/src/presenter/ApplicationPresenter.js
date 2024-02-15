import React from 'react';
import ApplicationForm from "../view/Application";
import { useNavigate } from 'react-router-dom';

const ApplicationPresenter = () => {
    const navigate = useNavigate();

    const handleApplicationSubmit = async (competences, availability) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("http://localhost:5001/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ${token}'
                },
                body: JSON.stringify({ competences, availability }),
            });
            
            const data = await response.json();
            if (data.success) {
                alert('Application submitted successfully');
                navigate('/dashboard');
            }
            else {
                alert(data.message);
            }
        } catch (err) {
            console.error("An error occurred while submitting the application.", err);
            alert("An error occurred while submitting the application.");
        }
    };
    
    return <ApplicationForm onSubmitApplication={handleApplicationSubmit} />;
};

export default ApplicationPresenter;