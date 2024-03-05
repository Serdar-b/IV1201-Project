// const request = require("supertest");
// const { server } = require("../../server"); 
// const pool = require("../../db"); 
// const username = `testuser`;

// describe("AuthController Tests", () => {
//   describe("POST /register", () => {
//     it("should respond with 200 on successful registration", async () => {
     
//       const registerData = {
//         name: "News",
//         surname: "Users",
//         pnr: "12345678900",
//         email: `${username}@example.com`,
//         password: "newpass",
//         username: username,
//       };
//       const response = await request(server).post("/register").send(registerData);

//       expect(response.statusCode).toBe(200);
//       expect(response.body).toHaveProperty("message", "Registration successful");
//     });

//     it("should respond with 409 if the user already exists", async () => {
        
//         await request(server).post("/register").send({
//           name: "Duplicate",
//           surname: "User",
//           pnr: "1234567890",
//           email: `${username}@example.com`,
//           password: "newpass",
//           username: username,
//         });
  
        
//         const response = await request(server).post("/register").send({
//           name: "Duplicate",
//           surname: "User",
//           pnr: "1234567890",
//           email: `${username}@example.com`,
//           password: "newpass",
//           username: username,
//         });
  
//         expect(response.statusCode).toBe(409);
//         expect(response.body).toHaveProperty("message", "User already exists");
//       });
    

//   });

//   describe("POST /login", () => {
//     it("should respond with 200 and a JWT token on successful login", async () => {
//       const loginData = { username: "user40", password: "Test121212" }; 
//       const response = await request(server).post("/login").send(loginData);

//       expect(response.statusCode).toBe(200);
//       expect(response.body).toHaveProperty("token");
//     });

//     it("should respond with 401 on invalid credentials", async () => {
//       const loginData = { username: "newusers", password: "wrongpass" };
//       const response = await request(server).post("/login").send(loginData);

//       expect(response.statusCode).toBe(401);
//     });
//   });

//   afterEach(async () => {
//     await pool.query("DELETE FROM person WHERE username = $1", [username]);
//   });

// });

// afterAll(async () => {
//     if (server && server.close) {
//       await new Promise(resolve => server.close(resolve));
//     }
//     await pool.end();
//   });





const request = require("supertest");
const { server } = require("../../server");

// Mock user data
const mockUserData = {
  name: "Test",
  surname: "User",
  pnr: "1234567890",
  email: "testuser@example.com",
  password: "securepassword",
  username: "testuser",
};

describe("AuthController Tests", () => {
  describe("POST /register", () => {
    it("should respond with 200 on successful registration", async () => {
      const response = await request(server).post("/register").send(mockUserData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Registration successful");
    });

    it("should respond with 409 if the user already exists", async () => {
      // Simulate the first successful registration
      await request(server).post("/register").send(mockUserData);

      // Attempt to register the same user again
      const response = await request(server).post("/register").send(mockUserData);

      expect(response.statusCode).toBe(409);
      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("POST /login", () => {
    it("should respond with 200 and a JWT token on successful login", async () => {
      // Ensure the user is registered first
      await request(server).post("/register").send(mockUserData);

      const loginData = { username: mockUserData.username, password: mockUserData.password };
      const response = await request(server).post("/login").send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should respond with 401 on invalid credentials", async () => {
      const loginData = { username: mockUserData.username, password: "wrongpassword" };
      const response = await request(server).post("/login").send(loginData);

      expect(response.statusCode).toBe(401);
    });
  });

  // Clean up: delete the test user from the database after all tests
  afterAll(async () => {
    await request(server).delete(`/user/${mockUserData.username}`);
  });
});
