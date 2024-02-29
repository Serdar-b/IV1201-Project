const pool = require("../db");

const saveApplication = async (client, userData, competences, availability) => {
  if (!userData || !competences || !availability) {
    throw new Error('User data, competences, and availability are required.');
  }

  if (!userData.person_id) {
    throw new Error('A valid user ID is required.');
  }

  if (!Array.isArray(competences) || competences.length === 0) {
    throw new Error('Competences must be a non-empty array.');
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

const setStatus = async (client, status, person_id) => {
  
  if (!person_id || isNaN(person_id)) {
    return { success: false, message: "Invalid person ID provided." };
  }

  try {
    
    const updateQuery = `
      UPDATE public.competence_profile
      SET status = $1
      WHERE person_id = $2
    `;

    await client.query(updateQuery, [status, person_id]);

    return { success: true, message: "Status updated successfully" };
  } catch (error) {
    console.error("Error changing application status: ", error.stack);
    throw error; 
  }
};

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
    throw new Error("Failed to fetch competences");
  }
};

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
    throw new Error("An error occurred while fetching all applications");
  }
};

module.exports = {
  saveApplication,
  getCompetences,
  getAllApplications,
  logApplicationError,
  setStatus,
};
