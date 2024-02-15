const applicationDAO = require('../integration/applicationDAO');

const submitApplication = async (req, res) => {
    const { competences, availability, userData } = req.body;

    try {
        const success = await applicationDAO.saveApplication(userData, competences, availability);
        if (success) {
            res.json({ success: true, message: "Application submitted successfull" });
            console.log(userData.person_id);
        } 
        else {
            res.status(500).json({ success: false, message: "Failed to submit application" });
        }
    } catch (err) {
        console.error("Error submitting application: ", err);
        res.status(500).json({ success: false, message: "An error occurred while submitting the application" });
    }
};

const handleCompetences = async (req, res) => {
    try {
        const result = await applicationDAO.getCompetences();
        res.json(result);
        console.log(result);
    } catch (err) {
        console.error("Error fetching competences: ", err.stack);
        res.status(500).json({ success: false, message: "An error occurred while fetching competences" });
    }
};

module.exports = { submitApplication, handleCompetences };