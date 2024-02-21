import React, { useState } from "react";


/**
 * Form component for applying for a position.
 * @param {Object} props - The props object.
 * @param {Array<Object>} props.competences - The list of competences available for selection.
 * @param {Function} props.onSubmitApplication - The function to handle the submission of the application.
 * @returns {JSX.Element} The application form.
 */

function ApplicationForm({ competences, onSubmitApplication }) {
    const [selectedCompetence, setSelectedCompetence] = useState('');
    const [experience, setExperience] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    /**
   * Handles the submission of the application form.
   * @param {Event} event - The form submission event.
   */

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmitApplication(selectedCompetence, experience, fromDate, toDate);
    }

    return (
        <div className="application-container">
            <h2>Apply for a position</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="competence">Area of Expertise</label>
                    <select
                        id="competence"
                        value={selectedCompetence}
                        onChange={(e) => setSelectedCompetence(e.target.value)}
                        required
                    >
                        <option value="">Select an expertise</option>
                        {competences.map((comp) => (
                            <option key={comp.competence_id} value={comp.name}>
                                {comp.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="experience">Years of Experience</label>
                    <input
                        id="experience"
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Enter your years of experience"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fromDate">From</label>
                    <input
                        id="fromDate"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="toDate">To</label>
                    <input
                        id="toDate"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="application-button">Submit Application</button>
            </form>
        </div>
    );
}

export default ApplicationForm;