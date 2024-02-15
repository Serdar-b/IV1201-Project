class Application {
    constructor({ person_id, competences, availability }) {
        this.person_id = person_id;
        this.competences = competences;
        this.availability = availability;
    }

    get getPersonId() {
        return this.person_id;
    }

    addCompetence(competence) {
        this.competences.push(competence);
    }

    addAvailabilty(availabilityPeriod) {
        this.availability.push(availabilityPeriod);
    }
}

module.exports = Application;