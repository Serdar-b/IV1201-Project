const pool = require("../db");
const applicationDAO = require("../integration/applicationDAO");

const submitApplication = async (req, res) => {
  const { competences, availability, userData } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!competences || !availability || !userData) {
    return res.status(400).json({ success: false, message: "Competences, availability, and user data are required." });
  }

  if (userData.role !== 2) {
    return res.status(400).json({ success: false, message: "User role has to be applicant." });
  }
  if (isNaN(userData.person_id)) {
    return res.status(400).json({ success: false, message: "Person ID must be a number." });
  }

  console.log("userData: " + userData.role);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const success = await applicationDAO.saveApplication(client, userData, competences, availability);

    await client.query('COMMIT');  
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    await client.query('ROLLBACK');  
    console.error('Error submitting application:', error);
    await applicationDAO.logApplicationError(client, userData.person_id, userData.email, userData.username, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while submitting the application" });
  } finally {
    client.release();  
  }
};


const setApplicationStatus = async (req, res) => {
  const { status, person_id } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (!person_id) {
    return res.status(400).json({ success: false, message: "Person ID must not be a null." });
  }

  if (isNaN(person_id)) {
    return res.status(400).json({ success: false, message: "Person ID must be a number." });
  }
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await applicationDAO.setStatus(client, status, person_id);

    if (result.success) {
      await client.query('COMMIT');
      res.json({ success: true, message: "Application status updated successfully", applications: result });
    } else {
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error setting application status:', error);
    await applicationDAO.logApplicationError(client, person_id, null, null, error.message, userAgent, ipAddress);
    res.status(500).json({ success: false, message: "An error occurred while setting application status" });
  } finally {
    client.release();
  }
};

const handleCompetences = async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  try {
    const result = await applicationDAO.getCompetences();
    res.json(result);
  } catch (error) {
    console.error('Error fetching competences:', error);
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await applicationDAO.logApplicationError(client, null, null, null, 'Error fetching competences', userAgent, ipAddress);
      await client.query('COMMIT');
    } catch (logError) {
      await client.query('ROLLBACK');
      console.error('Error logging fetch competences error:', logError);
    } finally {
      client.release();
    }
    res.status(500).json({ success: false, message: "An error occurred while fetching competences" });
  }
};
const listAllApplications = async (req, res) => {
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    const result = await applicationDAO.getAllApplications(client); 
    await client.query('COMMIT');

    res.json({ applications: result });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error fetching all applications:', error);

    try {
      await client.query('BEGIN');
      await applicationDAO.logApplicationError(client, null, null, null, 'Error fetching all applications', userAgent, ipAddress);
      await client.query('COMMIT');
    } catch (logError) {
      await client.query('ROLLBACK');
      console.error('Error logging fetch all applications error:', logError);
    }

    res.status(500).json({ success: false, message: "An error occurred while fetching applications" });
  } finally {
    client.release();
  }
};


module.exports = { submitApplication, handleCompetences, listAllApplications, setApplicationStatus };