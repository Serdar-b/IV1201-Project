const pool = require("../db");

/**
 * Saves an application to the database, including competence profiles and availability periods.
 * @param {Object} client - Database client for transaction management.
 * @param {Object} userData - User data including person_id.
 * @param {Array} competences - List of competences with their names and years of experience.
 * @param {Array} availability - List of availability periods with from and to dates.
 * @throws Will throw an error if user data, competences, or availability are invalid or if a database error occurs.
 * @returns {Boolean} True if the application is saved successfully.
 */
const saveApplication = async (client, userData, competences, availability) => {
  if (!userData || !competences || !availability) {
    throw new Error('application_validation.required_fields');
  }

  if (!userData.person_id) {
    throw new Error('application_validation.valid_user');
  }

  if (!Array.isArray(competences) || competences.length === 0) {
    throw new Error('database.competences_empty_array');
  }

  const hasNegativeExperience = competences.some(competence => competence.yearsOfExperience < 0);
  if (hasNegativeExperience) {
    throw new Error('application_form.years_of_experience_cannot_be_negative');
  }
  try {
    
    for (let { competenceName, yearsOfExperience } of competences) {
      const compRes = await client.query(
        "SELECT competence_id FROM public.competence WHERE name = $1",
        [competenceName]
      );
      if (compRes.rows.length > 0) {
        const competenceId = compRes.rows[0].competence_id;

        await client.query(
          "INSERT INTO public.competence_profile (person_id, competence_id, years_of_experience) VALUES ($1, $2, $3)",
          [userData.person_id, competenceId, yearsOfExperience]
        );
      }
    }

    for (let { fromDate, toDate } of availability) {
      await client.query(
        "INSERT INTO public.availability (person_id, from_date, to_date) VALUES ($1, $2, $3)",
        [userData.person_id, fromDate, toDate]
      );
    }

    return true;
  } catch (err) {
    console.error("Error saving application: ", err.stack);
    throw err; 
  }
};

/**
 * Sets the status of an application in the database.
 * @param {Object} client - Database client for transaction management.
 * @param {string} status - The new status of the application.
 * @param {number} person_id - The ID of the person whose application status is being updated.
 * @throws Will throw an error if person_id is invalid or if a database error occurs.
 * @returns {Object} Object containing the success state and message of the operation.
 */
const setStatus = async (client, status, person_id) => {
  
  if (!person_id || isNaN(person_id)) {
    throw new Error("application_validation.valid_user");
  }

  try {
    
    const updateQuery = `
      UPDATE public.competence_profile
      SET status = $1
      WHERE person_id = $2
    `;

    await client.query(updateQuery, [status, person_id]);

    return { success: true, message: "application_validation.status_updated" };
  } catch (error) {
    console.error("Error changing application status: ", error.stack);
    throw error; 
  }
};

/**
 * Logs an application error to the database.
 * @param {Object} client - Database client for transaction management.
 * @param {number|null} personId - ID of the person associated with the log.
 * @param {string|null} email - Email of the person associated with the log.
 * @param {string|null} username - Username of the person associated with the log.
 * @param {string} reason - Reason for logging.
 * @param {string} userAgent - User agent of the client.
 * @param {string} ipAddress - IP address of the client.
 * @throws Will throw an error if a database error occurs during log creation.
 */
const logApplicationError = async (
  client,
  personId,
  email,
  username,
  reason,
  userAgent,
  ipAddress
) => {
  try {
    const insertText = `
      INSERT INTO logs (person_id, email, username, reason, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const insertValues = [
      personId,
      email,
      username,
      reason,
      userAgent,
      ipAddress,
    ];

    await client.query(insertText, insertValues);
    console.log("Logging success.");
  } catch (err) {
    console.error("Error creating log: ", err);
    throw err; 
  }
};

/**
 * Retrieves all competences from the database.
 * @throws Will throw an error if a database error occurs during fetch operation.
 * @returns {Array|null} An array of all competences or null if none found.
 */
const getCompetences = async () => {
  try {
    const result = await pool.query("SELECT * FROM public.competence");
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting competence: ", err.stack);
    throw new Error("application_validation.error_fetching_competences");
  }
};

/**
 * Retrieves all applications from the database along with their associated competences and availability periods.
 * @param {Object} client - Database client for transaction management.
 * @throws Will throw an error if a database error occurs during fetch operation.
 * @returns {Array} An array of all applications.
 */
const getAllApplications = async (client) => {
  try {
    const query = `
      SELECT
        p.person_id, 
        p.name,
        p.surname,
        (
          SELECT string_agg(c.name || ' (' || cp.years_of_experience || ' years)', ', ')
          FROM competence_profile cp
          JOIN competence c ON cp.competence_id = c.competence_id
          WHERE cp.person_id = p.person_id
        ) AS competences_with_experience,
        (
          SELECT string_agg(a.from_date || ' to ' || a.to_date, '; ')
          FROM availability a
          WHERE a.person_id = p.person_id
        ) AS availability_periods,
        (
          SELECT string_agg(DISTINCT cp.status, ', ')
          FROM competence_profile cp
          WHERE cp.person_id = p.person_id
        ) AS status
      FROM
        person p`;

    const result = await client.query(query);

    return result.rows;
  } catch (error) {
    console.error("Error fetching all applications: ", error.stack);
    throw new Error("application_validation.error_fetching_applications");
  }
};

module.exports = {
  saveApplication,
  getCompetences,
  getAllApplications,
  logApplicationError,
  setStatus,
};
