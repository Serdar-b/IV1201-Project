const jwt = require('jsonwebtoken');
const applicationDAO = require('../integration/applicationDAO');

const submitApplication = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    let personId;

    console.log(`Token received for verification: ${token}`);

    
   if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            personId = decoded.person_id; 
        } catch (err) {
            console.log("JWT Error:", err.message);
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ success: false, message: "Token not provided" });
    } 




    const { competences, availability } = req.body;

    try {
        const success = await applicationDAO.saveApplication(personId, competences, availability);

        

        if (success) {
            res.json({ success: true, message: "Application submitted successfull" });
            console.log(personId);
        } 
        else {
            res.status(500).json({ success: false, message: "Failed to submit application" });
        }
    } catch (err) {
        console.error("Error submitting application: ", err);
        res.status(500).json({ success: false, message: "An error occurred while submitting the application" });
    }
};

module.exports = { submitApplication };