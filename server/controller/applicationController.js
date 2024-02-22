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

    const result = await applicationDAO.getAllApplications();
    
    // Return the fetched applications to the client
    res.json({ applications: result }); 
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

const setApplicationStatus = async (req, res) => {
  
  const { status, person_id } = req.body;

  console.log("status: " + status)

  console.log("person id: " + person_id)

  try {
    const result = await applicationDAO.setStatus(status, person_id);

    res.json({ applications: result }); 
  } catch (error) {
    console.error("Error fetching all applications: ", error.stack);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching applications",
    });
  }

}

module.exports = { submitApplication, handleCompetences, listAllApplications, setApplicationStatus };
