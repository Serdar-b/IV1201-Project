const pool = require("../db");

const saveApplication = async (personId, competences, availability) => {
    try {
        for (let {competenceName, yearsOfExperience } of competences) {
            const compRes = await pool.query("SELECT competence_id FROM public.competence WHERE name = $1", [competenceName]);
            if (compRes.rows.length > 0) {
                const competenceId = compRes.rows[0].competence_id;

                await pool.query("INSERT INTO public.competence_profile (person_id, competence_id, years_of_experiences) VALUES ($1, $2, $3)", [personId, competenceId, yearsOfExperience]);
            }
        }
    

        for (let { fromDate, toDate } of availability) {
            await pool.query("INSERT INTO public.availability (person_id, from_date, to_date) VALUES ($1, $2, $3)", [personId, fromDate, toDate]);  
        }

        return true;
    } catch (err) {
        console.error("Error saving application: ", err.stack);
        throw err;
    }
};

module.exports = { saveApplication };