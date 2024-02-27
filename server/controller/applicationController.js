const applicationDAO = require("../integration/applicationDAO");

const submitApplication = async (req, res) => {
  const { competences, availability, userData } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

if (!competences || !availability || !userData) {
  return res.status(400).json({ success: false, message: "Competences, availability, and user data are required." });
}

  try {
    const success = await applicationDAO.saveApplication(userData, competences, availability);
    if (success) {
      res.json({ success: true, message: "Application submitted successfully" });
    } else {
      const logMessage = "Failed to submit application";
      await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent, ipAddress);
      res.status(500).json({ success: false, message: logMessage });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while submitting the application" });
  }
};

const handleCompetences = async (req, res) => {
  try {
    const result = await applicationDAO.getCompetences();
    res.json(result);
  } catch (error) {
    console.error('Error fetching competences:', error);
    
    await applicationDAO.logApplicationError(null, null, null, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while fetching competences" });
  }
};

const listAllApplications = async (req, res) => {
  try {
    const result = await applicationDAO.getAllApplications();
    res.json({ applications: result });
  } catch (error) {
    console.error('Error fetching all applications:', error);
    
    await applicationDAO.logApplicationError(null, null, null, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while fetching applications" });
  }
};

const setApplicationStatus = async (req, res) => {
  const { status, person_id } = req.body;

  try {
    const result = await applicationDAO.setStatus(status, person_id);
    res.json({ success: true, message: "Application status updated successfully", applications: result });
  } catch (error) {
    console.error('Error setting application status:', error);
   
    await applicationDAO.logApplicationError(person_id, null, null, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while setting application status" });
  }
};

module.exports = { submitApplication, handleCompetences, listAllApplications, setApplicationStatus };
