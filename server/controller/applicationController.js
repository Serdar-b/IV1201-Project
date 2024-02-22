const applicationDAO = require("../integration/applicationDAO");
const Application = require("../model/Application");

const submitApplication = async (req, res) => {
  const { competences, availability, userData } = req.body;

  try {
    const success = await applicationDAO.saveApplication(
      userData,
      competences,
      availability,
    );
    if (success) {
      res.json({ success: true, message: "Application submitted successfull" });
      console.log(userData.person_id);
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to submit application" });
    }
  } catch (err) {
    console.error("Error submitting application: ", err);
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
    console.error("Error fetching competences: ", err.stack);
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
    console.error("Error fetching all applications: ", error.stack);
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
