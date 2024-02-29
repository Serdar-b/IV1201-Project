// const applicationDAO = require("../integration/applicationDAO");

// const submitApplication = async (req, res) => {
//   const { competences, availability, userData } = req.body;
//   const userAgent = req.headers['user-agent'];
//   const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

// if (!competences || !availability || !userData) {
//   return res.status(400).json({ success: false, message: "Competences, availability, and user data are required." });
// }

//   try {
//     const success = await applicationDAO.saveApplication(userData, competences, availability);
//     if (success) {
//       res.json({ success: true, message: "Application submitted successfully" });
//     } else {
//       const logMessage = "Failed to submit application";
//       await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, logMessage, userAgent, ipAddress);
//       res.status(500).json({ success: false, message: logMessage });
//     }
//   } catch (error) {
//     console.error('Error submitting application:', error);
//     await applicationDAO.logApplicationError(userData.person_id, userData.email, userData.username, error.message, userAgent, ipAddress);
//     res.status(500).json({ success: false, message: "An error occurred while submitting the application" });
//   }
// };

// const handleCompetences = async (req, res) => {
//   try {
//     const result = await applicationDAO.getCompetences();
//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching competences:', error);
    
//     await applicationDAO.logApplicationError(null, null, null, error.message, userAgent, ipAddress);
//     res.status(500).json({ success: false, message: "An error occurred while fetching competences" });
//   }
// };

// const listAllApplications = async (req, res) => {
//   try {
//     const result = await applicationDAO.getAllApplications();
//     res.json({ applications: result });
//   } catch (error) {
//     console.error('Error fetching all applications:', error);
    
//     await applicationDAO.logApplicationError(null, null, null, error.message, userAgent, ipAddress);
//     res.status(500).json({ success: false, message: "An error occurred while fetching applications" });
//   }
// };

// const setApplicationStatus = async (req, res) => {
//   const { status, person_id } = req.body;

//   try {
//     const result = await applicationDAO.setStatus(status, person_id);
//     res.json({ success: true, message: "Application status updated successfully", applications: result });
//   } catch (error) {
//     console.error('Error setting application status:', error);
   
//     await applicationDAO.logApplicationError(person_id, null, null, error.message, userAgent, ipAddress);
//     res.status(500).json({ success: false, message: "An error occurred while setting application status" });
//   }
// };

// module.exports = { submitApplication, handleCompetences, listAllApplications, setApplicationStatus };



const pool = require("../db");
const applicationDAO = require("../integration/applicationDAO");

const submitApplication = async (req, res) => {
  const { competences, availability, userData } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!competences || !availability || !userData) {
    return res.status(400).json({ success: false, message: "Competences, availability, and user data are required." });
  }

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
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await applicationDAO.setStatus(client, status, person_id);

    if (result.success) {
      await client.query('COMMIT');
      res.json({ success: true, message: "Application status updated successfully", applications: result });
    } else {
      await client.query('ROLLBACK');
      // Optionally log an error here using applicationDAO.logApplicationError
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
    // Assuming logApplicationError is adjusted to accept a client and be part of transaction management
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