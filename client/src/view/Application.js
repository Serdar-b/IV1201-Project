import React, { useState } from "react";

function ApplicationForm({ competences, onSubmitApplication }) {
    const [selectedCompetence, setSelectedCompetence] = useState('');
    const [experience, setExperience] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

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