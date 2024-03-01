const request = require("supertest");
const { server } = require("../server"); 
const pool = require("../db");
const mockUser = { username: "ArmandTodd", password: "LbH38urF4Kn" };

describe("POST /login", () => {
  it("should respond with a 200 and JWT token on successful login", async () => {
    const response = await request(server).post("/login").send(mockUser);

    expect(response.status).toBe(200);
  });

  it("should respond with a 401 on invalid credentials", async () => {
    const response = await request(server)
      .post("/login")
      .send({ ...mockUser, password: "wrongpassword" });

    expect(response.status).toBe(401);
  });
});

// afterAll(async () => {
//     await pool.end();
//   });

afterAll(done => {
  if (server && server.close) {
      server.close(() => {
          console.log('Server closed');
          done(); 
      });
  } else {
      done();
  }
});

