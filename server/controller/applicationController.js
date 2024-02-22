const applicationDAO = require("../integration/applicationDAO");
const Application = require("../model/Application");

const submitApplication = async (req, res) => {
  const { competences, availability, userData } = req.body;
  const userAgent = req.headers['user-agent'];

  try {
    const success = await applicationDAO.saveApplication(
      userData,
      competences,
      availability,
    );
    if (success) {
      res.json({ success: true, message: "Application submitted successfully" });
      console.log(userData.person_id);
    } else {
      const logMessage = "Failed to submit application";
      await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent);
      res
        .status(500)
        .json({ success: false, message: logMessage });
    }
  } catch (err) {
    const logMessage = 'Error submitting application: ' + err.message;
    await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent);
    console.error(logMessage);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while submitting the application",
      });
  }
};

const handleCompetences = async (req, res) => {
  try {
    const result = await applicationDAO.getCompetences();
    res.json(result);
    console.log(result);
  } catch (err) {
    const logMessage = "Error fetching competences: " + err.stack;
    await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent);
    console.error(logMessage);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching competences",
      });
  }
};

const listAllApplications = async (req, res) => {
  try {
    const applicationsData = await applicationDAO.getAllApplications();
    
    const applicationsWithStatus = applicationsData.map(appData => {
      // Create an instance of Application for each application
      const appInstance = new Application({
        person_id: appData.person_id,
        competences: appData.competences, 
        availability: appData.availability, 
      });

      return {
        ...appData,
        status: appInstance.getStatus // Use the getter to get the status
      };
    });

    res.json({ applications: applicationsWithStatus });
  } catch (error) {
    const logMessage = "Error fetching all applications: " + error.stack;
    await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent);
    console.error(logMessage);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching applications",
    });
  }
};


module.exports = { submitApplication, handleCompetences, listAllApplications };
