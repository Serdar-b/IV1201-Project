const request = require("supertest");
const { server } = require("../../server"); 
const pool = require("../../db"); 
const username = `testuser`;

/**
 * Integration tests for the AuthController, including registration and login processes.
 */
describe("AuthController Tests", () => {
  describe("POST /register", () => {
    it("should respond with 200 on successful registration", async () => {
     
      const registerData = {
        name: "News",
        surname: "Users",
        pnr: "12345678900",
        email: `${username}@example.com`,
        password: "newpass",
        username: username,
      };
      const response = await request(server).post("/register").send(registerData);

      expect(response.statusCode).toBe(200);
      // expect(response.body).toHaveProperty("message", "Registration successful");
      expect(response.body).toHaveProperty("message", "authorization_validation.registration_successful");
    });

    it("should respond with 409 if the user already exists", async () => {
        
        await request(server).post("/register").send({
          name: "Duplicate",
          surname: "User",
          pnr: "1234567890",
          email: `${username}@example.com`,
          password: "newpass",
          username: username,
        });
  
        
        const response = await request(server).post("/register").send({
          name: "Duplicate",
          surname: "User",
          pnr: "1234567890",
          email: `${username}@example.com`,
          password: "newpass",
          username: username,
        });
  
        expect(response.statusCode).toBe(409);
        // expect(response.body).toHaveProperty("message", "User already exists");
        expect(response.body).toHaveProperty("message", "authorization_validation.user_already_exists");
      });
    

  });

  describe("POST /login", () => {
    it("should respond with 200 and a JWT token on successful login", async () => {
      const loginData = { username: "user40", password: "Test121212" }; 
      const response = await request(server).post("/login").send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should respond with 401 on invalid credentials", async () => {
      const loginData = { username: "newusers", password: "wrongpass" };
      const response = await request(server).post("/login").send(loginData);

      expect(response.statusCode).toBe(401);
    });
  });

  /**
   * After each test, clean up by deleting the test user from the database.
   */
  afterEach(async () => {
    await pool.query("DELETE FROM person WHERE username = $1", [username]);
  });

});

  /**
   * After all tests, close the server and terminate the database connection.
   */
afterAll(async () => {
    if (server && server.close) {
      await new Promise(resolve => server.close(resolve));
    }
    await pool.end();
  });



