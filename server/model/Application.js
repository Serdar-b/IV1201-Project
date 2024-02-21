class Application {
    constructor({ person_id, competences, availability, status = "Unhandled" }) {
        this.person_id = person_id;
        this.competences = competences;
        this.availability = availability;
        this.status = status;
    }

    setStatus(status) {
        this.status = status;
    }

    get getStatus() {
        return this.status;
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