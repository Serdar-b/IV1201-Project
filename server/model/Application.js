/**
 * Represents an application submitted by a user.
 */
class Application {
    /**
     * Creates an instance of Application.
     * @param {Object} params - The parameters for creating an application.
     * @param {number} params.person_id - The ID of the person submitting the application.
     * @param {Array<Object>} params.competences - The competences associated with the application.
     * @param {Array<Object>} params.availability - The availability periods for the application.
     */
    constructor({ person_id, competences, availability}) {
        this.person_id = person_id;
        this.competences = competences;
        this.availability = availability;
    }

    /**
     * Gets the person ID of the application.
     * @returns {number} The person ID.
     */
    get getPersonId() {
        return this.person_id;
    }

    /**
     * Adds a competence to the application.
     * @param {Object} competence - The competence to add.
     */
    addCompetence(competence) {
        this.competences.push(competence);
    }

    /**
     * Adds an availability period to the application.
     * @param {Object} availabilityPeriod - The availability period to add.
     */
    addAvailabilty(availabilityPeriod) {
        this.availability.push(availabilityPeriod);
    }
}

module.exports = Application;