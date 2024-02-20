const pool = require("../db");

// const saveApplication = async (userData, competences, availability) => {
//   try {
//     for (let { competenceName, yearsOfExperience } of competences) {
//       const compRes = await pool.query(
//         "SELECT competence_id FROM public.competence WHERE name = $1",
//         [competenceName]
//       );
//       if (compRes.rows.length > 0) {
//         const competenceId = compRes.rows[0].competence_id;
//         console.log("competence id", competenceId);
//         console.log("person id", userData.person_id);
//         console.log("experience", yearsOfExperience);

//         await pool.query(
//           "INSERT INTO public.competence_profile (person_id, competence_id, years_of_experience) VALUES ($1, $2, $3)",
//           [userData.person_id, competenceId, yearsOfExperience]
//         );
//       }
//     }

//     for (let { fromDate, toDate } of availability) {
//       await pool.query(
//         "INSERT INTO public.availability (person_id, from_date, to_date) VALUES ($1, $2, $3)",
//         [userData.person_id, fromDate, toDate]
//       );
//       console.log("");
//       console.log("person id", userData.person_id);
//       console.log("from date", fromDate);
//       console.log("to date", toDate);
//     }

//     return true;
//   } catch (err) {
//     console.error("Error saving application: ", err.stack);
//     throw err;
//   }
// };

const saveApplication = async (userData, competences, availability) => {
  // Start a new client from the pool
  const client = await pool.connect();

  try {
    // Begin the transaction
    await client.query("BEGIN");

    // Loop through competences and insert them
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

    // Loop through availability periods and insert them
    for (let { fromDate, toDate } of availability) {
      await client.query(
        "INSERT INTO public.availability (person_id, from_date, to_date) VALUES ($1, $2, $3)",
        [userData.person_id, fromDate, toDate]
      );
    }

    // If everything is successful, commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (err) {
    // If there is an error, rollback the transaction
    await client.query("ROLLBACK");
    console.error("Error saving application: ", err.stack);
    return false;
  } finally {
    // Release the client back to the pool
    client.release();
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
    throw err;
  }
};

module.exports = { saveApplication, getCompetences };
