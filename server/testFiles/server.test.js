const request = require("supertest");
const { server } = require("../server");
const pool = require("../db");


const testUsername = `testuser_${Date.now()}`;
const testEmail = `testuser_${Date.now()}@example.com`;

const mockUser = {
  username: "user40",
  password: "Test121212"
};

let token;
let personId, username, nameOfUser;

/**
 * Sets up the testing environment before running any tests. Logs in a mock user to obtain authentication token for further requests.
 */
beforeAll(async () => {
  const loginResponse = await request(server).post("/login").send(mockUser);
  token = loginResponse.body.token;
  personId = loginResponse.body.user.person_id;
  username = loginResponse.body.user.username;
  nameOfUser = loginResponse.body.user.name;
  console.log("person   " +personId + " username " + username + " name " + nameOfUser);
});

/**
 * Tests the login endpoint to ensure it responds correctly to successful logins and invalid credentials.
 */
describe("POST /login", () => {
  it("should respond with a 200 and JWT token on successful login", async () => {
    const response = await request(server).post("/login").send(mockUser);
    expect(response.status).toBe(200);
  });

  it("should respond with a 401 on invalid credentials", async () => {
    const response = await request(server).post("/login").send({ ...mockUser, password: "wrongpassword" });
    expect(response.status).toBe(401);
  });
});

/**
 * Tests the registration endpoint to ensure it handles new user registrations correctly.
 */
describe("POST /register", () => {
  it("should respond with a 200 on successful registration", async () => {
    const newUser = {
      name: "Test",
      surname: "User",
      pnr: "1234567890",
      email: testEmail,
      password: "Test123!",
      username: testUsername
    };
    const response = await request(server).post("/register").send(newUser);
    expect(response.status).toBe(200);
  });

  // Clean up after registration tests
  afterAll(async () => {
    await pool.query("DELETE FROM person WHERE username = $1", [testUsername]);
  });
});

/**
 * Tests the application submission endpoint to ensure authenticated users can submit applications.
 */
describe("POST /apply (submitApplication)", () => {
  it("should allow an authenticated user to submit an application", async () => {
    const applicationData = {
      competences: [
        {
          competenceName: "lotteries",
          yearsOfExperience: "4"
        }
      ],
      availability: [
        {
          fromDate: "2025-04-05",
          toDate: "2025-04-06"
        }
      ],
      userData: {
        person_id: personId, 
        name: nameOfUser,
        username: username, 
        role: 2 
      }
    };

    const response = await request(server)
      .post("/apply")
      .set("Authorization", `Bearer ${token}`)
      .send(applicationData);

    expect(response.statusCode).toBe(200);
  });
});

/**
 * Tests the applications listing endpoint to ensure authenticated users can retrieve a list of all applications.
 */
describe("GET /applications", () => {
  it("should allow an authenticated user to list all applications", async () => {
    const response = await request(server).get("/applications").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.applications)).toBe(true);
  });
});

/**
 * Tests the competences fetch endpoint to ensure authenticated users can retrieve competences.
 */
describe("GET /apply (handleCompetences)", () => {
  it("should allow an authenticated user to fetch competences", async () => {
    const response = await request(server).get("/apply").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

/**
 * Cleans up the testing environment after all tests have run. Closes the server connection and ends the database pool connection.
 */
afterAll(async () => {
  if (server && server.close) {
    await new Promise(resolve => server.close(resolve));
  }
  await pool.end();
});


