const {
    saveApplication,
    setStatus,
    getCompetences,
    getAllApplications,
  } = require("../../integration/applicationDAO");
  const userDAO = require("../../integration/userDAO");

const pool = require("../../db");

let client;
let personId;

/**
 * Before all tests, connect to the database and get the person ID for a test user.
 */
beforeAll(async () => {
  client = await pool.connect();
  const testUser = await userDAO.findUserByUsername('user40');
  personId = testUser.person_id;
});

/**
 * After all tests, release the database client and end the pool.
 */
afterAll(async () => {
  await client.release();
  await pool.end();
});

/**
 * Tests for the saveApplication function.
 */
describe("saveApplication", () => {
 

  it("should throw an error if required data is missing", async () => {
    await expect(saveApplication(client, null, null, null))
      .rejects
      // .toThrow('User data, competences, and availability are required.');
      .toThrow('application_validation.required_fields');
  });

  it("should throw an error if the user ID is not provided", async () => {
    const userData = {};
    const competences = [{ competenceName: "Test Competence", yearsOfExperience: 5 }];
    const availability = [{ fromDate: "2025-01-01", toDate: "2025-02-01" }];

    await expect(saveApplication(client, userData, competences, availability))
      .rejects
      // .toThrow('A valid user ID is required.');
      .toThrow('application_validation.valid_user');
  });

  it("should throw an error if competences are not provided as a non-empty array", async () => {
    const userData = { person_id: personId };
    const competences = [];
    const availability = [{ fromDate: "2025-01-01", toDate: "2025-02-01" }];

    await expect(saveApplication(client, userData, competences, availability))
      .rejects
      // .toThrow('Competences must be a non-empty array.');
      .toThrow('database.competences_empty_array');
  });

  it("should throw an error if any competence has negative years of experience", async () => {
    const userData = { person_id: personId };
    const competences = [{ competenceName: "Test Competence", yearsOfExperience: -1 }];
    const availability = [{ fromDate: "2025-01-01", toDate: "2025-02-01" }];

    await expect(saveApplication(client, userData, competences, availability))
      .rejects
      // .toThrow('Years of experience cannot be negative.');
      .toThrow('application_form.years_of_experience_cannot_be_negative');
  });

  it("should successfully save the application when valid data is provided", async () => {
    const userData = { person_id: personId }; 
    const competences = [{ competenceName: "Existing Competence", yearsOfExperience: 5 }]; 
    const availability = [{ fromDate: "2025-01-01", toDate: "2025-02-01" }];

    const result = await saveApplication(client, userData, competences, availability);
    expect(result).toBe(true);
  });

});

/**
 * Tests for the setStatus function.
 */
describe("setStatus", () => {
    
    it("should throw an error if an invalid person ID is provided", async () => {
      await expect(setStatus(client, 'Approved', null))
        .rejects
        // .toThrow('Invalid person ID provided.');
        .toThrow('application_validation.valid_user');
    });
  
    it("should successfully update the status when valid data is provided", async () => {
      const person_id = personId; 
      const status = 'Approved'; 
  
      const result = await setStatus(client, status, person_id);
      expect(result.success).toBe(true);
      // expect(result.message).toBe("Status updated successfully");
      expect(result.message).toBe("application_validation.status_updated");
    });
  
  });

/**
 * Test suite for `getCompetences` function.
 */
  describe("getCompetences", () => {
    it("should return a list of competences", async () => {
      const competences = await getCompetences();
  
      expect(competences).not.toBeNull();
      expect(Array.isArray(competences)).toBe(true);
      expect(competences.length).toBeGreaterThan(0); 
    });
  });

/**
 * Test suite for getAllApplications function.
 * 
 * This suite checks if the getAllApplications function properly retrieves a list of all applications.
 */
  describe("getAllApplications", () => {
    
  
    it("should return a list of all applications", async () => {
      const applications = await getAllApplications(client);
  
      expect(applications).not.toBeNull();
      expect(Array.isArray(applications)).toBe(true);
    });
  });
  
  


