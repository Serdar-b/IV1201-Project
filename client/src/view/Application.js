import React, { useState } from "react";

function ApplicationForm({ onSubmitApplication}) {
    const [expertise, setExpertise] = useState("");
    const [experience, setExperience] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const competences = [{ competenceName: expertise, yearsOfExperience: experience }];
        const availability = [{ fromDate, toDate }];
        onSubmitApplication(competences, availability);
    }

    return (
        <div className="application-container">
            <h2>Apply for a position</h2>
            <form onSubmit={handleSubmit}>
                <div classname="form-group">
                    <label htmlFor="expertise">Area of Expertise</label>
                    <input
                        id="expertise"
                        type="text"
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        placeholder="Enter your area of experise"
                        required
                        />
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