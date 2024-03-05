// const { findUserByUsername, findUserByUsernameOrEmail, createUser, logFailedAttempt } = require("../../integration/userDAO");
// const pool = require("../../db");
// const User = require("../../model/User");

// let isPoolClosed = false;

// describe("createUser", () => {
//   let newUser;
//   let client;

//   // beforeAll(
//   //   async () => {
//   //   // newUser = {
//   //   //   name: "Test",
//   //   //   surname: "User",
//   //   //   pnr: "1234567890",
//   //   //   email: "testuser@example.com",
//   //   //   password: "securepassword",
//   //   //   username: "testuser",
//   //   // };
//   //   client = await pool.connect();
//   // });

//   // afterAll(async () => {
    
//   //   client.release();
//   //   if (!isPoolClosed) {
//   //     try {
//   //       const deleteUserQuery = "DELETE FROM public.person WHERE username = $1";
//   //       await pool.query(deleteUserQuery, [newUser.username]);
//   //     } catch (error) {
//   //       console.error("Cleanup failed:", error);
//   //     }
//   //   }
//   // });

//   // it("should successfully create a new user with valid data", async () => {
//   //   await client.query('BEGIN');
//   //   const result = await createUser(client, newUser);

//   //   expect(result.success).toBeTruthy();
//   //   expect(result.user).not.toBeNull();
//   //   expect(result.user.name).toBe(newUser.name);

//   //   await client.query('ROLLBACK'); 
//   // });
// });

// describe("findUserByUsername", () => {
//   it("should return a User object when the user is found", async () => {
//     const user = await findUserByUsername("ArmandTodd");

//     expect(user).not.toBeNull();
//     expect(user).toBeInstanceOf(User);
//     expect(user.getName).toBe("Armand");
//   });

//   it("should return a null object when the user is not found", async () => {
//     const user = await findUserByUsername("User1");

//     expect(user).toBeNull();
//   });
// });

// // describe("findUserByUsernameOrEmail", () => {
// //   it("should return a User object when the user is found by name or by email", async () => {

// //     const user = await findUserByUsernameOrEmail("ArmandTodd", "armand@example.com");

// //     expect(user).not.toBeNull();
// //     expect(user).toBeInstanceOf(User);
// //     expect(user.getName).toBe("Armand");
// //   });

// //   it("should return a null object when the user is not found by name or by email", async () => {
   
// //     const user = await findUserByUsernameOrEmail("User1", "user1@example.com");

// //     expect(user).toBeNull();
// //   });
// // });


// afterAll(async () => {
//   if (!isPoolClosed) {
//     await pool.end();
//     isPoolClosed = true;
//   }
// });


const { findUserByUsername } = require("../../integration/userDAO");
const pool = require("../../db");
jest.mock("../../db"); // This line mocks the db module

describe("findUserByUsername", () => {
  beforeEach(() => {
    // Reset mocks before each test
    pool.query.mockReset();
  });

  it("should return a fixed user object without querying the database", async () => {
    // Mock implementation of pool.query to return a fixed response
    pool.query.mockResolvedValue({
      rows: [
        {
          person_id: 1271,
          name: 'user40',
          surname: 'user40',
          pnr: '200000000000',
          email: 'user40@gmail.com',
          password: '$2b$10$SULnywHireLOJ6LfIoAgPeUl/JmFpWSycM7KqAo6SnXZU4POpvGTO',
          role_id: 2,
          username: 'user40'
        }
      ]
    });

    const user = await findUserByUsername("user40");

    expect(user).not.toBeNull();
    expect(user.person_id).toBe(1271);
    expect(user.username).toBe("user40");
    // Add more expectations as needed
  });
});
